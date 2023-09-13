import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, BaseEntity } from 'typeorm';
import { User } from '../user/user.entity';
import { Message } from './message.objet';

@Entity()
export class Conv extends BaseEntity{
  @PrimaryGeneratedColumn()
  ID: number;

  @Column()
  Name: string;

  @ManyToMany(() => User)
  @JoinTable()
  Users: User[];

  @ManyToMany(() => User)
  @JoinTable()
  Admin: User[];

  @Column({ type: 'integer' })
  Status: number;

  @Column({ nullable: true })
  Password: string;

  @ManyToMany(() => User)
  @JoinTable()
  Muted: User[];

  @Column('jsonb', { nullable: true })
  Messages: Message[];
}
