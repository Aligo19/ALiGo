import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { Field } from '../field/field.entity';

@Entity()
export class DataUser {
  @PrimaryGeneratedColumn()
  ID: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  Id_user: User;

  @Column({ type: 'text' })
  data: string;

  @ManyToOne(() => Field, { onDelete: 'CASCADE' })
  Id_field: Field;

  @Column({ type: 'date' })
  logged_at: Date;
}
