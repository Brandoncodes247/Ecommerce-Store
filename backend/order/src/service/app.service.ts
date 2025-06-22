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

  // NOTE: You can reuse your existing onOrderPayment() and onOrderFailure() methods here.
}
