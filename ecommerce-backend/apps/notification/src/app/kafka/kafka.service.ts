import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Consumer } from 'kafkajs';

// Define an interface for the expected notification data
export interface OrderCreatedEvent {
  orderId: string;
  userId: string;
  // Add other relevant fields as needed
  [key: string]: any;
}

@Injectable()
export class KafkaService implements OnModuleInit {
  private readonly kafka = new Kafka({
    clientId: 'notification-service',
    brokers: ['localhost:9092'], // adjust if using Docker
  });

  private readonly consumer: Consumer = this.kafka.consumer({ groupId: 'notification-group' });

  async onModuleInit() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'order_created', fromBeginning: true });

    await this.consumer.run({
      eachMessage: async ({ topic, message }) => {
        const value = message.value?.toString();
        console.log(`[Kafka] Message received on topic ${topic}:`, value);

        // Here you’d send an email, SMS, etc.
        if (value) {
          this.handleNotification(JSON.parse(value));
        } else {
          console.warn('[Kafka] Received message with undefined value');
        }
      },
    });
  }

  handleNotification(data: OrderCreatedEvent) {
    console.log('🔔 Sending notification for order:', data);
    // Implement actual notification logic (e.g., nodemailer, Twilio, etc.)
  }
}
