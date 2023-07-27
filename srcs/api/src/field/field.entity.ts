import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class Field extends BaseEntity {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ length: 255 })
  name: string;

  @Column()
  status: number;
}
