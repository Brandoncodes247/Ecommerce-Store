import { Body, Controller, Inject, Post, Get, Param } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { OrderService } from '../services/order.service';
import { OrderDto } from '../entities/dtos/order.dto';
import { ClientKafka } from '@nestjs/microservices';

@Controller('order') // base path is /order
export class OrderController {
  constructor(
    @Inject() private orderService: OrderService,
    @Inject('GATEWAY_SERVICE') private readonly client: ClientKafka
  ) {}

  @Post() // this maps to POST /order
  @ApiBody({ type: OrderDto })
  async createOrder(@Body() req: OrderDto) {
    return await this.orderService.createOrder(req);
  }


  async onModuleInit() {
    this.client.subscribeToResponseOf('order_create');
    this.client.subscribeToResponseOf('order_payment');
    this.client.subscribeToResponseOf('order_failed');
    this.client.subscribeToResponseOf('order_get_by_id');

    await this.client.connect();
  }
  @Get(':orderId') // this maps to GET /order/:orderId
  async getOrderById(@Param('orderId') orderId: number) {
    return await this.orderService.getOrderById(orderId);
  }

}

