import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AppController } from './controller/app.controller';
import { UploadController } from './controller/upload.controller';
import { ProductService } from './services/app.service';
import { Product } from './entities/product.entity';

@Module({
  imports: [
     ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: './config/.env.dev', // Use standard .env file
    }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
      type: 'postgres',
      host: configService.get('DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      username: configService.get('DB_USER'),
      password: configService.get('DB_PASS'), // Ensure this returns a string
      database: configService.get('DB_NAME'),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true,
    }),
  }),

    TypeOrmModule.forFeature([Product]),

    ClientsModule.registerAsync([
      {
        name: 'PRODUCT_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'product',
              brokers: [configService.get<string>('KAFKA_HOST')],
            },
            consumer: {
              groupId: 'product-group',
            },
          },
        }),
      },
    ]),
  ],
  controllers: [AppController, UploadController],
  providers: [ProductService],
})
export class AppModule {}
