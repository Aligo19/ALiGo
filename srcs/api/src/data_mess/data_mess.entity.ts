import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Conv } from '../conv/conv.entity';
import { User } from '../user/user.entity';

@Entity()
export class DataMess {
  @PrimaryGeneratedColumn()
  Id: number;

  @ManyToOne(() => Conv, { onDelete: 'CASCADE' })
  ID_conv: Conv;

  @Column({ type: 'text' })
  data: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  Id_user: User;

  @Column({ type: 'date' })
  logged_at: Date;
}
