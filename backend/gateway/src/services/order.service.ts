// ✅ Updated OrderService for API Gateway (batch support)
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { OrderDto } from '../entities/dtos/order.dto';

@Injectable()
export class OrderService {
  constructor(
    @Inject('GATEWAY_SERVICE') private readonly gatewayService: ClientKafka
  ) {}

  async createOrder(req: OrderDto) {
    return this.gatewayService.send('order_create', req);
  }

  async getOrderStatus(orderId: number) {
    return this.gatewayService.send('order_get_status', orderId);
  }

  async onOrderPayment(orderId: number, amount: number) {
    return this.gatewayService.send('order_payment', { orderId, amount });
  }

  async onOrderFailure(orderId: number) {
    return this.gatewayService.send('order_failed', { orderId });
  }
}