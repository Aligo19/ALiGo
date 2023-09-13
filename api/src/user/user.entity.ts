import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, BaseEntity } from 'typeorm';

@Entity()
export class User extends BaseEntity{
  @PrimaryGeneratedColumn()
  ID: number;

  @Column()
  ID_19: string;

  @Column()
  Pseudo: string;

  @Column()
  Avatar: string;

  @ManyToMany(() => User)
  @JoinTable()
  Friends: User[];

  @Column({ type: 'integer' })
  Elo: number;

  @Column({ type: 'integer' })
  Actual_skin: number;

  @Column('int', { array: true })
  Global_skin: number[];

  @ManyToMany(() => User)
  @JoinTable()
  Blocked: User[];

  @Column({ type: 'integer' })
  Wins: number;

  @Column({ type: 'integer' })
  Loses: number;

  @Column({ type: 'timestamp' })
  Last_connection: Date;

  //defautl value false
  @Column({ type: 'boolean', default: false})
  Game_status: boolean;

  @Column({ type: 'integer' })
  password: number;

  @Column()
  email: string;

}
