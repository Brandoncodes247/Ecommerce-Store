import { Module } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { ProductService } from './services/app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Product } from './entities/product.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: './config/.env.dev', // Use standard .env file
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT')),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Product]),
    ClientsModule.registerAsync({
      clients: [
        {
          name: 'PRODUCT_SERVICE',
          inject: [ConfigService],
          imports: [ConfigModule],
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
              // Uncomment if you need custom partitioning:
              // producer: {
              //   createPartitioner: Partitioners.DefaultPartitioner
              // }
            },
          }),
        },
      ],
    }),
  ],
  controllers: [AppController],
  providers: [ProductService],
  exports: [ConfigModule],
})
export class AppModule {}