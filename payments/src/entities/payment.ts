import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column('simple-array')
  orderIds: string[];

  @Column()
  totalAmount: number;

  @Column()
  paymentDate: Date;
}
