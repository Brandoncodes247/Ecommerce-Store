import { Module } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { InventoryService } from './services/app.service';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from "@nestjs/typeorm";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { OrderLog } from "./entities/log.entity";
import { Inventory } from "./entities/inventory.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Changed to standard .env file location
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
      inject: [ConfigService]
    } as TypeOrmModuleAsyncOptions),
    TypeOrmModule.forFeature([Inventory, OrderLog]),
    ClientsModule.registerAsync({
      clients: [{
        name: "INVENTORY_SERVICE",
        inject: [ConfigService],
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'inventory',
              brokers: [configService.get<string>('KAFKA_HOST')],
            },
            consumer: {
              groupId: 'inventory-group',
            },
          }
        })
      }]
    })
  ],
  controllers: [AppController],
  providers: [InventoryService],
})
export class AppModule {}