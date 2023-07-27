import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { DataUser } from 'src/data_user/data_user.entity';
import { equal } from 'assert';

@Injectable()
export class DataUserService {
  constructor(
    @InjectRepository(DataUser)
    private readonly datasUserRepository: Repository<DataUser>,
  ) {}

  async findWhere(id: number): Promise<DataUser[]> {
    return this.datasUserRepository.find({
      where: { Id_user: Equal(id) },
      relations: ['Id_field'],
    });
  }
  

  async create(datasUser: DataUser): Promise<DataUser> {
    return this.datasUserRepository.save(datasUser);
  }

  // async update(id: number, datasUser: DatasUser): Promise<DatasUser> {
  //   await this.datasUserRepository.update(id, datasUser);
  //   return this.datasUserRepository.findOne(id);
  // }

  async remove(id: number): Promise<void> {
    await this.datasUserRepository.delete(id);
  }
}
