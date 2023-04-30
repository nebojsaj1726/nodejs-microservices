import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

interface Order {
  id: number;
  userId: string;
  totalPrice: string;
  items: string[];
}

interface Payment {
  id: number;
  userId: string;
  orderIds: string[];
  totalAmount: number;
  paymentDate: Date;
}

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ type: 'json', nullable: true, default: [] })
  orders: Order[];

  @Column({ type: 'json', nullable: true, default: [] })
  payments: Payment[];
}
