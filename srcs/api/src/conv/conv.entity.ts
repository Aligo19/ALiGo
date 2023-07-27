import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Conv {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ length: 255 })
  bouh: string;
}
