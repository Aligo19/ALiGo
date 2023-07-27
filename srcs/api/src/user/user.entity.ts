import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class User extends BaseEntity{
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ name: 'ID_19', length: 255 })
  ID19: string;

  @Column({ length: 255 })
  Pseudo: string;

  @Column({ length: 255 })
  Avatar: string;
}
