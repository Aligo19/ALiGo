import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './match.entity';

@Injectable()
export class MatchService{
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
  ) {}

  async findAll(): Promise<Match[]> {
    return this.matchRepository.find();
  }

  async findOne(id: number): Promise<Match | null> {
    return this.matchRepository.findByIds([id]).then((matches) => matches[0] || null);
  }
  
  
  
  async create(match: Match): Promise<Match> {
    return this.matchRepository.save(match);
  }

  // async update(id: number, match: Match): Promise<Match> {
  //   await this.matchRepository.update(id, match);
  //   return this.matchRepository.findOne(id);
  // }

  async remove(id: number): Promise<void> {
    await this.matchRepository.delete(id);
  }
}
