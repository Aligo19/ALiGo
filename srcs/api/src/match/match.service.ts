// match.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { Match } from './match.entity';
import { User } from '../user/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    private userService: UserService
  ) {}

  async createMatch(user1: User): Promise<Match> {
    let testUser = await this.userService.getUserById(user1.ID);
    let testGame = await this.matchRepository.findOne({
      where: { ID_user1: Equal(user1.ID), Status: Equal(0) },
    });
    if (!user1 || !testUser)
      throw new Error('User1 not found');
    if (testGame)
      throw new Error('Game already in research');
    const match = new Match();
    match.ID_user1 = user1;
    match.ID_user2 = null;
    match.Score_user1 = 0;
    match.Score_user2 = 0;
    match.Status = 0;

    return this.matchRepository.save(match);
  }

  async updateMatch(match: Match): Promise<Match> {
    if (!match || !(await this.getMatchById(match.ID)))
      throw new Error('Match not found');
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
