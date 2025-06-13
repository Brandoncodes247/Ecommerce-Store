import { Injectable } from '@nestjs/common';
import { KafkaService } from './kafka/kafka.service';

@Injectable()
export class PaymentService {
  constructor(private readonly kafkaService: KafkaService) {}

  async processPayment(orderId: string) {
    // Mocking payment logic
    console.log(`💳 Processing payment for order ${orderId}...`);

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Emit Kafka event
    await this.kafkaService.emitPaymentSuccess(orderId);

    return { message: 'Payment processed', orderId };
  }
}
