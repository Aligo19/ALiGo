// conv.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { Conv } from './conv.entity';
import { User } from '../user/user.entity';
import { Message } from './message.objet';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ConvService {
  constructor(
    @InjectRepository(Conv)
    private convRepository: Repository<Conv>,
    private userService: UserService,
  ) {}

  async createConv(name: string, status: number, password?: string): Promise<Conv> {
    const conv = new Conv();
    conv.Name = name;
    conv.Status = status;
    if (status === 1)
      conv.Password = password;
    else
      conv.Password = null;
    conv.Admin = [];
    conv.Users = [];
    conv.Muted = [];
    conv.Messages = [];
    return this.convRepository.save(conv);
  }

  async addUsersToConv(convId: number, users: User[]): Promise<Conv> {
    const conv = await this.convRepository.findOne({
        where : {ID: Equal(convId)}, 
        relations: ['Users']
    });
    if (conv.Users.find((user) => user.ID === users[0].ID))
      throw new Error('User already in conversation');
    if (!conv) {
        throw new Error('Conversation not found');
    }

    conv.Users = [...conv.Users, ...users];

    return this.convRepository.save(conv);
  }

  async addAdminsToConv(convId: number, admins: User[]): Promise<Conv> {
    const conv = await this.convRepository.findOne({
        where : {ID: Equal(convId)}, 
        relations: ['Admin']
    });
    if (conv.Admin.find((admin) => admin.ID === admins[0].ID))
      throw new Error('User already in conversation');
    if (!conv.Users.find((user) => user.ID === admins[0].ID))
      throw new Error('User not found in conversation');
    if (!conv) {
        throw new Error('Conversation not found');
    }

    conv.Admin = [...conv.Admin, ...admins];

    return this.convRepository.save(conv);
  }

   async addMutedsToConv(convId: number, muteds: User[]): Promise<Conv> {
    const conv = await this.convRepository.findOne({
        where : {ID: Equal(convId)}, 
        relations: ['Muted']
    });
    if (conv.Muted.find((muted) => muted.ID === muteds[0].ID))
      throw new Error('User already muted in conversation');
    if (!conv) {
      throw new Error('Conversation not found');
    }
    if (!conv.Users.find((user) => user.ID === muteds[0].ID))
      throw new Error('User not found in conversation');

    conv.Muted = [...conv.Muted, ...muteds];

    return this.convRepository.save(conv);
  } 

  async getConvById(convId: number): Promise<Conv> {
    return this.convRepository.findOne({
        where : {ID: Equal(convId)}, 
        relations: ['Admin', 'Users', 'Muted']
    });
  }

  async getConversationsByUserId(userId: number): Promise<String[]> {
    let allDatasConv =  await this.convRepository.createQueryBuilder('conv')
    .leftJoinAndSelect('conv.Users', 'user')
    .leftJoinAndSelect('conv.Admin', 'admin')
    .leftJoinAndSelect('conv.Muted', 'muted')
    .where('user.ID = :userId', { userId })
    .orWhere('admin.ID = :userId', { userId })
    .orWhere('muted.ID = :userId', { userId })
    .getMany();
    let returnValue = [];
    for (let i = 0; i < allDatasConv.length; i++) {
      let conv = allDatasConv[i];
      let convData = {
        ID: conv.ID,
        Name: conv.Name,
        Status: conv.Status,
        Password: conv.Password,
      };
      returnValue.push(convData);
    }
    return returnValue;
  }

  async removeUserFromConv(convId: number, userId: number): Promise<Conv> {
    const conv = await this.convRepository.findOne({
        where : {ID: Equal(convId)}, 
        relations: ['Users']
    });
    if (!conv)
      throw new Error('Conversation not found');

    conv.Users = conv.Users.filter(user => user.ID !== userId);
    conv.Admin = conv.Admin.filter(user => user.ID !== userId);
    conv.Muted = conv.Muted.filter(user => user.ID !== userId);

    return this.convRepository.save(conv);
  }

  async removeAdminFromConv(convId: number, userId: number): Promise<Conv> {
    const conv = await this.convRepository.findOne({
        where : {ID: Equal(convId)}, 
        relations: ['Admin']
    });
    if (!conv)
      throw new Error('Conversation not found');

    conv.Admin = conv.Admin.filter(user => user.ID !== userId);

    return this.convRepository.save(conv);
  }

  async removeMutedFromConv(convId: number, userId: number): Promise<Conv> {
    const conv = await this.convRepository.findOne({
        where : {ID: Equal(convId)}, 
        relations: ['Muted']
    });
    if (!conv)
      throw new Error('Conversation not found');

    conv.Muted = conv.Muted.filter(user => user.ID !== userId);

    return this.convRepository.save(conv);
  }

  async addMessageToConv(convId: number, message: Message): Promise<Conv> {
    const user = await this.userService.getUserById(message.ID_user);
    if (!user)
      throw new Error('User not found');
    this.userService.updateDate(user);
    const conv = await this.convRepository.findOne({
        where : {ID: Equal(convId)}
    });
    if (!conv)
      throw new Error('Conversation not found');

    if (!conv.Messages)
      conv.Messages = [message];
    else
      conv.Messages.push(message);

    return this.convRepository.save(conv);
  }

  //le status de la conv doit etre 2 et doit contenir dans ses users idUser et idFriend
  async removeConv(idUser: number, idFriend: number): Promise<Conv> {
    const conv = await this.convRepository.find({
        where : {Status: Equal(2)},
        relations: ['Users']
    });
    let unic = conv.find((conv) => conv.Users.find((user) => user.ID === idUser) && conv.Users.find((user) => user.ID === idFriend));
    if (!conv)
      throw new Error('Conversation not found');

    return this.convRepository.remove(unic);
  }
}
