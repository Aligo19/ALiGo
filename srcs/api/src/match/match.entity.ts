import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Match  extends BaseEntity{
  @PrimaryGeneratedColumn()
  Id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  Id_user1: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  Id_user2: User;

  @Column()
  score_u1: number;

  @Column()
  score_u2: number;

  @Column()
  level: number;
}
