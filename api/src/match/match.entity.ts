import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Match extends BaseEntity{
  @PrimaryGeneratedColumn()
  ID: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'ID_user1' })
  ID_user1: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'ID_user2' })
  ID_user2: User;

  @Column({ type: 'integer' })
  Score_user1: number;

  @Column({ type: 'integer' })
  Score_user2: number;

  @Column({ type: 'integer' })
  Status: number;
}
