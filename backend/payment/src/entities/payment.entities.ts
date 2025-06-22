import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderId: number;

  @Column()
  amount: number;

  @Column()
  currency: string;

  @Column()
  method: string; // e.g., Mpesa, card, bank_transfer

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  customerId: string;

  @Column({ default: false })
  status: boolean;
}
