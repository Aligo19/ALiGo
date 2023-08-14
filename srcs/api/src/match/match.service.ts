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

  async createMatch(user1: User): Promise<Match> {
    const match = new Match();
    match.ID_user1 = user1;
    match.ID_user2 = null;
    match.Score_user1 = 0;
    match.Score_user2 = 0;
    match.Status = 0;

    return this.matchRepository.save(match);
  }

  async updateMatch(match: Match): Promise<Match> {
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
      //userID = ID_user1 or ID_user2 and status = 2
      where: [{ ID_user1: Equal(userId), Status: Equal(2) }, { ID_user2: Equal(userId), Status: Equal(2) }],
      relations: ['ID_user1', 'ID_user2'],
    });
  }

  async getMatchLoading(): Promise<Match[]> {
    return this.matchRepository.find({
      where: { Status: Equal(0) },
      relations: ['ID_user1'],
    });
  }

  // Add other service methods here if necessary for managing additional functionalities related to matches.
}
