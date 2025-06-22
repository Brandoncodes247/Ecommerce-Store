import { Body, Controller, Inject, Post, Get, Param } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { OrderService } from '../services/order.service';
import { OrderDto } from '../entities/dtos/order.dto';
import { ClientKafka } from '@nestjs/microservices';

@Controller('order')
export class OrderController {
  constructor(
    @Inject() private orderService: OrderService,
    @Inject('GATEWAY_SERVICE') private readonly client: ClientKafka
  ) {}

  @Post('Order')
  @ApiBody({ type: OrderDto })
  async createOrder(@Body() req: OrderDto) {
    return await this.orderService.createOrder(req);
  }

  @Get('order/:id')
  async getOrderStatus(@Param('id') orderId: number) {
    return this.orderService.getOrderStatus(orderId);
  }

  onModuleInit() {
    this.client.subscribeToResponseOf('order_create');
    this.client.subscribeToResponseOf('order_get_status');
    this.client.connect();
  }
}
