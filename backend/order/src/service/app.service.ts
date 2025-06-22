// order.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { Order } from '../entities/order.entities';
import { OrderItem } from '../entities/order-item.entity';
import { OrderStatus } from '../entities/order.enum';
import { OrderLog, ProcessCommand, ProcessStatus } from '../entities/log.entity';
import * as retry from 'async-retry';
import { firstValueFrom } from 'rxjs';
import { OrderDto } from '../dtos/order.dto';

@Injectable()
export class OrderService {
  constructor(
    @Inject('ORDER_SERVICE') private orderBrokerServices: ClientKafka,
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(OrderLog) private orderLogRepository: Repository<OrderLog>
  ) {}

  async createOrder(orderDto: OrderDto) {
    const log = new OrderLog();
    log.command = ProcessCommand.ORDER;
    log.processedAt = new Date();

    try {
      const order = await this.orderRepository.save({
        status: OrderStatus.PENDING,
        totalAmount: orderDto.totalAmount,
        createdAt: new Date()
      });

      for (const item of orderDto.items) {
        await this.orderItemRepository.save({
          order,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        });
      }

      log.orderId = order.id;
      log.status = ProcessStatus.SUCCESS;

      await this.orderBrokerServices.emit('inventory_batch_reserve', {
        orderId: order.id,
        items: orderDto.items
      });

      return { id: order.id };
    } catch (e) {
      log.status = ProcessStatus.FAILED;
      log.errorMessage = e.message;
      console.error('Order creation failed:', e);
      throw e;
    } finally {
      await this.orderLogRepository.save(log);
    }
  }

  async onOrderPayment(orderId: number, amount: number) {
    const existingLog = await this.orderLogRepository.findOne({
      where: {
        command: ProcessCommand.PAY,
        status: ProcessStatus.SUCCESS,
        orderId
      }
    });

    if (existingLog) {
      await this.orderRepository.update({ id: orderId }, { status: OrderStatus.SUCCESS });
      return;
    }

    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order || order.status !== OrderStatus.PENDING) return;

    await retry(async (_, attempt) => {
      const log = new OrderLog();
      log.orderId = orderId;
      log.command = ProcessCommand.PAY;
      log.processedAt = new Date();

      try {
        if (attempt === 6) {
          log.errorMessage = 'Max retries reached';
          await this.orderRepository.update(orderId, { status: OrderStatus.FAILED });

          const items = await this.orderItemRepository.find({ where: { order: { id: orderId } } });
          for (const item of items) {
            await this.orderBrokerServices.emit('inventory_release', {
              productId: item.productId,
              quantity: item.quantity
            });
          }
          throw new Error(log.errorMessage);
        }

        let payment = await firstValueFrom(
          this.orderBrokerServices.send('payment_inquiry', { orderId })
        );

        if (!payment || payment.status !== true) {
          payment = await firstValueFrom(
            this.orderBrokerServices.send('payment_create', {
              orderId,
              amount,
              method: 'Mpesa', // Customize as needed based on payment form
              currency: 'KES',
              customerId: `cust-${orderId}`
            })
          );
        }

        if (payment?.success) {
          log.status = ProcessStatus.SUCCESS;
          await this.orderRepository.update(orderId, { status: OrderStatus.SUCCESS });
        } else {
          log.status = ProcessStatus.FAILED;
          throw new Error('Payment failed');
        }
      } catch (e) {
        log.status = ProcessStatus.FAILED;
        log.errorMessage = e.message;
        console.error(e);
        throw e;
      } finally {
        await this.orderLogRepository.save(log);
      }
    }, { retries: 6 });
  }

  async onOrderFailure(orderId: number) {
    await this.orderRepository.update({ id: orderId }, { status: OrderStatus.FAILED });
  }
}
