import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { OrderLine } from './order-line.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  customerId!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount!: number;

  @Column({ default: 'PENDING' })
  status!: 'PENDING' | 'PAID' | 'CANCELLED';

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => OrderLine, orderLine => orderLine.order, {
    cascade: true,
    eager: true, // load order lines with order
  })
  orderLines!: OrderLine[];
}
