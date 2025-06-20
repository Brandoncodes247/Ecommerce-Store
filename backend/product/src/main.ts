import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Serve static images from /uploads
  app.use('/uploads', express.static(join(__dirname, '..', 'public/uploads')));

  // Connect Kafka microservice
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_HOST],
      },
      consumer: {
        groupId: 'product-group',
      },
    },
  });

  await app.startAllMicroservices(); // Start Kafka
  await app.listen(3000);            // Start HTTP server
}
bootstrap();
