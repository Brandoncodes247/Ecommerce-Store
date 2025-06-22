import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderId: number;

  @Column()
  amount: number;

  @Column({ default: true })
  status: boolean;

  @Column({ nullable: true })
  currency: string;

  @Column({ nullable: true })
  method: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  customerId: string;

  @Column({ nullable: true })
  transactionId: string;
}

  


