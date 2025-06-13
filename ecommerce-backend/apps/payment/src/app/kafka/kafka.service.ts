import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit {
  private readonly kafka = new Kafka({
    clientId: 'payment-service',
    brokers: ['localhost:9092'],
  });

  private producer!: Producer;

  async onModuleInit() {
    this.producer = this.kafka.producer();
    await this.producer.connect();
  }

  async emitPaymentSuccess(orderId: string) {
    const message = {
      orderId,
      status: 'paid',
      timestamp: new Date().toISOString(),
    };

    await this.producer.send({
      topic: 'payment_successful',
      messages: [{ value: JSON.stringify(message) }],
    });

    console.log('✅ Sent payment_successful:', message);
  }
}
