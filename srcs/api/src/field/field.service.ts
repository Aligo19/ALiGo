import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Field } from 'src/field/field.entity';

@Injectable()
export class FieldService {
  constructor(
    @InjectRepository(Field)
    private readonly fieldRepository: Repository<Field>,
  ) {}

  async findAll(): Promise<Field[]> {
    return this.fieldRepository.find();
  }

  async findOne(id: number): Promise<Field> {
    return this.fieldRepository.findByIds([id]).then((matches) => matches[0] || null);
  }

  async create(field: Field): Promise<Field> {
    return this.fieldRepository.save(field);
  }

  // async update(id: number, field: Field): Promise<Field> {
  //   await this.fieldRepository.update(id, field);
  //   return this.fieldRepository.findOne(id);
  // }

  async remove(id: number): Promise<void> {
    await this.fieldRepository.delete(id);
  }
}
