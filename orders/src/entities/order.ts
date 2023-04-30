import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  totalPrice: string;

  @Column('simple-array')
  items: string[];

  @Column()
  userId: string;
}
