import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conv } from './conv.entity';

@Injectable()
export class ConvService {
  constructor(
    @InjectRepository(Conv)
    private readonly convRepository: Repository<Conv>,
  ) {}

  async findAll(): Promise<Conv[]> {
    return this.convRepository.find();
  }

  // async findOne(id: number): Promise<Conv> {
  //   return this.convRepository.findOne(id);
  // }

  async create(conv: Conv): Promise<Conv> {
    return this.convRepository.save(conv);
  }

  // async update(id: number, conv: Conv): Promise<Conv> {
  //   await this.convRepository.update(id, conv);
  //   return this.convRepository.findOne(id);
  // }

  async remove(id: number): Promise<void> {
    await this.convRepository.delete(id);
  }
}
