import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

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
}
