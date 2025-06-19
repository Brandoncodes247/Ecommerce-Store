import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ProductService } from './services/app.service';
import { Product } from './entities/product.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const productService = app.get(ProductService);

  const products: Partial<Product>[] = [
    {
      name: 'USB Flash Drive',
      price: 1200,
      imageUrl: 'http://localhost:3000/uploads/USB Flash Drive.png',
      description: '16GB USB 3.0 flash drive for quick file transfers.',
    },
    {
      name: 'Wireless Mouse',
      price: 1500,
      imageUrl: 'http://localhost:3000/uploads/Wireless Mouse.png',
      description: 'Comfortable wireless mouse with long battery life.',
    },
    {
      name: 'Wired Keyboard',
      price: 1800,
      imageUrl: 'http://localhost:3000/uploads/Wired Keyboard.png',
      description: 'Full-size keyboard with quiet keys.',
    },
    {
      name: 'HDMI Cable',
      price: 600,
      imageUrl: 'http://localhost:3000/uploads/HDMI Cable.png',
      description: '1.5m HDMI cable for monitors and TVs.',
    },
    {
      name: 'Laptop Stand',
      price: 2500,
      imageUrl: 'http://localhost:3000/uploads/Laptop Stand.png',
      description: 'Adjustable stand for laptops up to 17 inches.',
    },
    {
      name: 'Bluetooth Speaker',
      price: 3200,
      imageUrl: 'http://localhost:3000/uploads/Bluetooth Speaker.png',
      description: 'Portable speaker with clear sound and bass.',
    },
    {
      name: 'Webcam',
      price: 2800,
      imageUrl: 'http://localhost:3000/uploads/Webcam.png',
      description: 'HD webcam for video calls and streaming.',
    },
    {
      name: 'Power Bank',
      price: 1700,
      imageUrl: 'http://localhost:3000/uploads/Power Bank.png',
      description: '5000mAh portable charger for phones and tablets.',
    },
    {
      name: 'Wireless Earbuds',
      price: 2200,
      imageUrl: 'http://localhost:3000/uploads/Wireless Earbuds.png',
      description: 'Compact earbuds with charging case.',
    },
    {
      name: 'Monitor',
      price: 14500,
      imageUrl: 'http://localhost:3000/uploads/Monitor.png',
      description: '21.5-inch Full HD monitor for work and play.',
    },
    {
      name: 'USB-C Charger',
      price: 900,
      imageUrl: 'http://localhost:3000/uploads/USB-C Charger.png',
      description: 'Fast charging USB-C wall adapter.',
    },
    {
      name: 'Ethernet Cable',
      price: 500,
      imageUrl: 'http://localhost:3000/uploads/Ethernet Cable.png',
      description: '2m Cat6 ethernet cable for fast internet.',
    },
    {
      name: 'Mouse Pad',
      price: 400,
      imageUrl: 'http://localhost:3000/uploads/Mouse Pad.png',
      description: 'Smooth surface mouse pad for precise control.',
    },
    {
      name: 'SD Card',
      price: 1100,
      imageUrl: 'http://localhost:3000/uploads/SD Card.png',
      description: '32GB SD card for cameras and devices.',
    },
    {
      name: 'Smart Plug',
      price: 1600,
      imageUrl: 'http://localhost:3000/uploads/Smart Plug.png',
      description: 'WiFi smart plug for remote control of devices.',
    },
    {
      name: 'LED Desk Lamp',
      price: 2000,
      imageUrl: 'http://localhost:3000/uploads/LED Desk Lamp.png',
      description: 'Adjustable LED lamp with touch controls.',
    },
  ];

  for (const product of products) {
    await productService.createProduct(product as Product);
  }

  console.log('✅ Products seeded successfully!');
  await app.close();
}

bootstrap();
