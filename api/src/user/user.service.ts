import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { User } from './user.entity';

const red_Create = 255;
const green_Created = 255;
const blue_Create = 255;

const red_New_friend = 100;
const green_New_friend = 100;
const blue_New_friend = 100;

const red_New_Blocked = 50;
const green_New_Blocked = 50;
const blue_New_Blocked = 50;

function hex(r, g, b)
{
  return ((r * 255 * 255) + (g * 255) + b)
}

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
    if (!Avatar)
      Avatar = 'files/NoFace.gif';
    const user = new User();
    user.ID_19 = ID_19;
    user.Pseudo = Pseudo;
    user.Avatar = (Avatar);
    user.Friends = [];
    user.Elo = 0;
    user.Actual_skin = hex(red_Create, green_Created, blue_Create);
    user.Global_skin = [hex(red_Create, green_Created, blue_Create)];
    user.Blocked = [];
    user.Wins = 0;
    user.Loses = 0;
    user.Last_connection = new Date();
    user.Game_status = false;
    user.password = 0;
    user.email = "";

    return this.userRepository.save(user);
  }

  async getPassword(user: number): Promise<number> {
    let tmp = await this.getUserById(user);
    if (!tmp)
      throw new Error('User not found');
    return tmp.password;
  }

  async removePassword(user: number): Promise<User> {
    let tmp = await this.getUserById(user);
    if (!tmp)
      throw new Error('User not found');
    tmp.password = 0;
    return this.userRepository.save(tmp);
  }

  async passwordReset(user: string, password: number): Promise<User> {
    let tmp = await this.getUserByPseudo(user);
    if (!tmp)
      throw new Error('User not found');
    tmp.password = password;
    return this.userRepository.save(tmp);
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

  async updateAvatar(user: User, avatar: string): Promise<User> {
    user.Avatar = avatar;
    return this.userRepository.save(user);
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

  async addSkin(user:User, r:number, g:number, b:number)
  {
    user.Global_skin = [...user.Global_skin, hex(r, g, b)]
    return this.userRepository.save(user);
  }

  async addFriend(user: User, friend: User): Promise<User> {
    if (user.Friends.find(f => f.Pseudo === friend.Pseudo))
      throw new Error('User already friend');
    user.Blocked = user.Blocked.filter(f => f.Pseudo !== friend.Pseudo);
    if (user.Friends.length === 0)
      user.Global_skin = [...user.Global_skin, hex(red_New_friend, green_New_friend, blue_New_friend)]
    user.Friends = [...user.Friends, friend];
    friend.Friends = [...friend.Friends, user];
    friend.save();
    return this.userRepository.save(user);
  }

  async blockUser(user: User, blockedUser: User): Promise<User> {
    if (user.Blocked.includes(blockedUser))
      throw new Error('User already blocked');
    if (user.Blocked.length === 0)
      user.Global_skin = [...user.Global_skin, hex(red_New_Blocked, green_New_Blocked, blue_New_Blocked)]
    user.Blocked = [...user.Blocked, blockedUser];
    return this.userRepository.save(user);
  }

  async removeFriend(user: User, friend: User): Promise<User> {
    if (!user.Friends.find(f => f.Pseudo === friend.Pseudo))
      throw new Error('User not friend');
    user.Friends = user.Friends.filter(f => f.Pseudo !== friend.Pseudo);
    friend.Friends = friend.Friends.filter(f => f.Pseudo !== user.Pseudo);
    friend.save();
    return this.userRepository.save(user);
  }

  async updateUser(user: User): Promise<String> {
    let tmp = await this.getUserById(user.ID);
    if (!tmp)
      throw new Error('User not found');
    tmp = await this.getUserByPseudo(user.Pseudo);
    if (tmp && tmp.ID != user.ID)
      throw new Error('Pseudo already exist');
    this.userRepository.save(user);
    return "User updated";
  }
}
