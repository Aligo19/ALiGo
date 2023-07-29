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
    const user = new User();
    user.ID_19 = ID_19;
    user.Pseudo = Pseudo;
    user.Avatar = Avatar;
    user.Coins = 0;
    user.Actual_skin = 0;
    user.Global_skin = [];
    user.Wins = 0;
    user.Loses = 0;

    return this.userRepository.save(user);
  }

  async getUserById(id: number): Promise<User> {
    return this.userRepository.findOne({
        where:{ID: Equal(id)}
    });
  }

  async addFriend(user: User, friend: User): Promise<User> {
    user.Friends = [...user.Friends, friend];
    return this.userRepository.save(user);
  }

  async blockUser(user: User, blockedUser: User): Promise<User> {
    user.Blocked = [...user.Blocked, blockedUser];
    return this.userRepository.save(user);
  }

  async updateUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
}
