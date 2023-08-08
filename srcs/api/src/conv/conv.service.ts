// conv.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { Conv } from './conv.entity';
import { User } from '../user/user.entity';
import { Message } from './message.objet';

@Injectable()
export class ConvService {
  constructor(
    @InjectRepository(Conv)
    private convRepository: Repository<Conv>,
  ) {}

  async createConv(name: string, status: number, password?: string): Promise<Conv> {
    const conv = new Conv();
    conv.Name = name;
    conv.Status = status;
    conv.Password = password;

    return this.convRepository.save(conv);
  }

  async addUsersToConv(convId: number, users: User[]): Promise<Conv> {
    const conv = await this.convRepository.findOne({
        where : {ID: Equal(convId)}, 
        relations: ['Users']
    });
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
    if (!conv) {
      throw new Error('Conversation not found');
    }

    conv.Muted = [...conv.Muted, ...muteds];

    return this.convRepository.save(conv);
  } 

  async getConvById(convId: number): Promise<Conv> {
    return this.convRepository.findOne({
        where : {ID: Equal(convId)}, 
        relations: ['Admin', 'Users', 'Muted']
    });
  }

  async getConversationsByUserId(userId: number): Promise<Conv[]> {
    return this.convRepository.createQueryBuilder('conv')
    .leftJoinAndSelect('conv.Users', 'user')
    .leftJoinAndSelect('conv.Admin', 'admin')
    .leftJoinAndSelect('conv.Muted', 'muted')
    .where('user.ID = :userId', { userId })
    .orWhere('admin.ID = :userId', { userId })
    .orWhere('muted.ID = :userId', { userId })
    .getMany();

  }

  async removeUserFromConv(convId: number, userId: number): Promise<Conv> {
    const conv = await this.convRepository.findOne({
        where : {ID: Equal(convId)}, 
        relations: ['Users']
    });
    if (!conv)
      throw new Error('Conversation not found');

    conv.Users = conv.Users.filter(user => user.ID !== userId);

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
    const conv = await this.convRepository.findOne({
        where : {ID: Equal(convId)}
    });
    if (!conv)
      throw new Error('Conversation not found');

    conv.Messages = [...conv.Messages, message];

    return this.convRepository.save(conv);
  }
}
