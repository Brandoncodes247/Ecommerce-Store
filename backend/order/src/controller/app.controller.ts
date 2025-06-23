import { Controller, Inject } from '@nestjs/common';
import { OrderService } from '../service/app.service';
import { ClientKafka, EventPattern, MessagePattern, Payload } from '@nestjs/microservices'; // ✅ FIXED

@Controller()
export class AppController {
  constructor(
    private readonly appService: OrderService,
    @Inject('ORDER_SERVICE') private client: ClientKafka
  ) {}

  @MessagePattern('order_create')
  createOrder(@Payload() req: any) {
    console.log('order_create received', req);
    return this.appService.createOrder(req);
  }

  @EventPattern('order_payment')
  onOrderInventoryReservation(@Payload() req: { orderId: number; amount: number }) {
    console.log('order_payment received', req);
    return this.appService.onOrderPayment(req.orderId, req.amount);
  }

  @EventPattern('order_failed')
  onOrderFailure(@Payload() req: { orderId: number }) {
    console.log('order_failed received', req);
    return this.appService.onOrderFailure(req.orderId);
  }

  @MessagePattern('order_get_by_id')
  async handleGetOrderById(@Payload() orderId: number) {
    const order = await this.appService.getOrderById(orderId);

    return {
        id: order.id,
        status: order.status,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
        items: order.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
        }))
    };
}


  async onModuleInit() {
    this.client.subscribeToResponseOf('payment_inquiry');
    this.client.subscribeToResponseOf('payment_create');
    this.client.subscribeToResponseOf('order_create');
    this.client.subscribeToResponseOf('order_payment');
    this.client.subscribeToResponseOf('order_failed');
    this.client.subscribeToResponseOf('order_get_by_id');
    await this.client.connect();
  }
}

