// src/dtos/order.dto.ts

export interface OrderItemInput {
  productId: number;
  quantity: number;
  price: number;
}

export interface OrderDto {
  items: OrderItemInput[];
  totalAmount: number;
}
