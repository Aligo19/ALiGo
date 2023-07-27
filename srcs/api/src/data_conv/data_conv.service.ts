import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataConv } from 'src/data_conv/data_conv.entity';

@Injectable()
export class DataConvService {
  constructor(
    @InjectRepository(DataConv)
    private readonly dataConvRepository: Repository<DataConv>,
  ) {}

  async findAll(): Promise<DataConv[]> {
    return this.dataConvRepository.find();
  }

  // async findOne(id: number): Promise<DataConv> {
  //   return this.dataConvRepository.findOne(id);
  // }

  async create(dataConv: DataConv): Promise<DataConv> {
    return this.dataConvRepository.save(dataConv);
  }

  // async update(id: number, dataConv: DataConv): Promise<DataConv> {
  //   await this.dataConvRepository.update(id, dataConv);
  //   return this.dataConvRepository.findOne(id);
  // }

  async remove(id: number): Promise<void> {
    await this.dataConvRepository.delete(id);
  }
}
