import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Enable CORS for browser access (Postman works because it doesn't enforce CORS)
  app.enableCors({
    origin: '*', // For development only. Replace with specific frontend URL in production.
    credentials: true,
  });

  // ✅ Swagger config
  const config = new DocumentBuilder()
    .setTitle('ecommerce gateway')
    .addBearerAuth(
      {
        bearerFormat: 'Bearer',
        in: 'header',
        type: 'http',
        name: 'authorization',
      },
      'authorization',
    )
    .setDescription('')
    .setVersion('1.0')
    .addTag('')
    .build();

  app.setGlobalPrefix('api');
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000); // Internal container port (host port is 3001 via Docker)
}
bootstrap();
