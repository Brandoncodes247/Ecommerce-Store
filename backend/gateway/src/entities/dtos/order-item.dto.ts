import { ApiProperty } from '@nestjs/swagger';

export class OrderItemDto {
  @ApiProperty({ example: 1, description: 'Product ID' })
  productId: number;

  @ApiProperty({ example: 2, description: 'Quantity of the product' })
  quantity: number;

  @ApiProperty({ example: 1500, description: 'Unit price of the product' })
  price: number;
}

