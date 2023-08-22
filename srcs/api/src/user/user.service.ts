// user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(ID_19: string, Pseudo: string, Avatar: string): Promise<User> {
    if (await this.getUserBy19Id(ID_19))
        throw new Error('User already exist');
    if (await this.getUserByPseudo(Pseudo))
        throw new Error('Pseudo already exist');
    const user = new User();
    user.ID_19 = ID_19;
    user.Pseudo = Pseudo;
    user.Avatar = Avatar;
    user.Elo = 0;
    user.Actual_skin = 0;
    user.Global_skin = [];
    user.Wins = 0;
    user.Loses = 0;
    user.Last_connection = new Date();
    user.Game_status = false;

    return this.userRepository.save(user);
  }

  async updateGameStatus(user: User, status: boolean): Promise<User> {
    user.Game_status = status;
    return this.userRepository.save(user);
  }

  async updateDate(user: User): Promise<User> {
    user.Last_connection = new Date();
    return this.userRepository.save(user);
  }

  async getUserById(id: number): Promise<User> {
        let out =  this.userRepository.findOne({
            where:{ID: Equal(id)},
            relations: ['Friends', 'Blocked']

        });
        if (out)
            return out;
        return null;
  }

  async getUserByPseudo(pseudo: string): Promise<User> {
    let out = this.userRepository.findOne({
        where:{Pseudo: Equal(pseudo)},
        relations: ['Friends', 'Blocked']
    });
    if (out)
      return out;
    return null;
  }

  async getUserBy19Id(id: string): Promise<User> {
    let out =  this.userRepository.findOne({
        where:{ID_19: Equal(id)},
        relations: ['Friends', 'Blocked']

    });
    if (out)
      return out;
    return null;
  }

  async addFriend(user: User, friend: User): Promise<User> {
    if (user.Friends.find(f => f.Pseudo === friend.Pseudo))
      throw new Error('User already friend');
    if (user.Blocked.find(f => f.Pseudo === friend.Pseudo))
      throw new Error('User blocked');
    if (friend.Blocked.find(f => f.Pseudo === user.Pseudo))
      throw new Error('User blocked');
    user.Friends = [...user.Friends, friend];
    friend.Friends = [...friend.Friends, user];
    return this.userRepository.save(user);
  }

  async blockUser(user: User, blockedUser: User): Promise<User> {
    if (user.Blocked.includes(blockedUser))
      throw new Error('User already blocked');
    user.Blocked = [...user.Blocked, blockedUser];
    return this.userRepository.save(user);
  }

  async updateUser(user: User): Promise<String> {
    //verif if user exist
    let tmp = await this.getUserById(user.ID);
    if (!tmp)
      throw new Error('User not found');
    //verif if pseudo exist
    tmp = await this.getUserByPseudo(user.Pseudo);
    if (tmp && tmp.ID != user.ID)
      throw new Error('Pseudo already exist');
    this.userRepository.save(user);
    return "User updated";
  }
}
