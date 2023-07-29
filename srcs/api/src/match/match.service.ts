// match.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { Match } from './match.entity';
import { User } from '../user/user.entity';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
  ) {}

  async createMatch(user1: User, user2: User, scoreUser1: number, scoreUser2: number): Promise<Match> {
    const match = new Match();
    match.ID_user1 = user1;
    match.ID_user2 = user2;
    match.Score_user1 = scoreUser1;
    match.Score_user2 = scoreUser2;

    return this.matchRepository.save(match);
  }

  async getMatchById(id: number): Promise<Match> {
    return this.matchRepository.findOne({
        where : {ID : Equal(id)}, 
        relations: ['ID_user1', 'ID_user2']
    });
  }

  async getMatchByIdUser(userId: number): Promise<Match[]> {
    return this.matchRepository.find({
      where: { ID_user1: Equal(userId), ID_user2: Equal(userId)},
      relations: ['ID_user1', 'ID_user2'],
    });
  }

  // Add other service methods here if necessary for managing additional functionalities related to matches.
}
