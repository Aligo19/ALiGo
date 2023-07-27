import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Conv } from '../conv/conv.entity';
import { Field } from '../field/field.entity';

@Entity()
export class DataConv {
  @PrimaryGeneratedColumn()
  ID: number;

  @ManyToOne(() => Conv, { onDelete: 'CASCADE' })
  Id_conv: Conv;

  @Column({ type: 'text' })
  data: string;

  @ManyToOne(() => Field, { onDelete: 'CASCADE' })
  Id_field: Field;

  @Column({ type: 'date' })
  logged_at: Date;
}
