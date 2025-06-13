class CreateOrderLineDto {
  productId!: string;
  quantity!: number;
  price!: number;
}

export class CreateOrderDto {
  customerId!: string;
  totalAmount!: number;
  orderLines!: CreateOrderLineDto[];
}
