import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataMess } from 'src/data_mess/data_mess.entity';

@Injectable()
export class DataMessService {
  constructor(
    @InjectRepository(DataMess)
    private readonly dataMessRepository: Repository<DataMess>,
  ) {}

  async findAll(): Promise<DataMess[]> {
    return this.dataMessRepository.find();
  }

  // async findOne(id: number): Promise<DataMess> {
  //   return this.dataMessRepository.findOne(id);
  // }

  async create(dataMess: DataMess): Promise<DataMess> {
    return this.dataMessRepository.save(dataMess);
  }

  // async update(id: number, dataMess: DataMess): Promise<DataMess> {
  //   await this.dataMessRepository.update(id, dataMess);
  //   return this.dataMessRepository.findOne(id);
  // }

  async remove(id: number): Promise<void> {
    await this.dataMessRepository.delete(id);
  }
}
