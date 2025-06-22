// src/entities/dtos/order.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { OrderItemDto } from './order-item.dto';

export class OrderDto {
  @ApiProperty({ type: [OrderItemDto] })
  items: OrderItemDto[];

  @ApiProperty()
  totalAmount: number;

  @ApiProperty({ required: false })
  status?: string;

  @ApiProperty({ required: false })
  id?: number;
}
