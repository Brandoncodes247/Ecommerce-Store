export class CreateProductDto {
  name!: string;
  description?: string;
  price!: number;
  sku!: string;
  quantity!: number;
}
