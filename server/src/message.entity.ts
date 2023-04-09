import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fromUser: string;

  @Column()
  toUser: string;

  @Column()
  text: string;

  @Column()
  createdAt: Date;
}
