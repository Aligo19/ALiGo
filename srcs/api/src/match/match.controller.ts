// match.controller.ts
import { Controller, Get, Post, Body, Param, ParseIntPipe, NotFoundException, Logger } from '@nestjs/common';
import { MatchService } from './match.service';
import { CreateMatchDto } from './create-match.dto';
import { Match } from 'src/match/match.entity';
import { UserService } from 'src/user/user.service';

@Controller('matches')
export class MatchController {
  constructor(private matchService: MatchService, private userService: UserService) {}

/****************************************/
/*                                      */
/*   GET                                */
/*                                      */
/****************************************/

/**
 * @description Get match with id
 * @param id 
 * @returns 
 */
  @Get(':id')
  async getMatchById(@Param('id', ParseIntPipe) id: number): Promise<Match> {
    const match = await this.matchService.getMatchById(id);
    if (!match) {
      throw new NotFoundException('Match not found');
    }
    return match;
  }

/**
 * @description Get all matches of id user
 * @param userId 
 * @returns 
 */
  @Get('user/:userId')
  async getMatchesByUserId(@Param('userId', ParseIntPipe) userId: number) {
    let output, logger;
    try {
      logger = ["The request is ok", "Request: GET[ /user/:userId ]"];
      output = this.matchService.getMatchByIdUser(userId);
    } catch (error) {
      logger = ["The request doesn't work", "Request: GET[ /user/:userId ]"];
      output = error;
    }
    Logger.log(logger[0], logger[1]);
    return JSON.stringify(output);
  }

/****************************************/
/*                                      */
/*   POST                               */
/*                                      */
/****************************************/
  
/**
 * @description Create a new match
 * @param createMatchDto 
 * @returns 
 */
  @Post()
  async createMatch(@Body() createMatchDto: CreateMatchDto) {
    let output, logger;
    try {
      const { ID_user1, ID_user2, Score_user1, Score_user2 } = createMatchDto;
      const user1 = await this.userService.getUserById(ID_user1);
      const user2 = await this.userService.getUserById(ID_user2);
      if (!user1 || !user2)
        throw new NotFoundException('One or more users not found');
      if (Score_user1 < Score_user2)  {
        user2.Wins++;
        user1.Loses++;
      } else if (Score_user1 > Score_user2) {
        user1.Wins++;
        user2.Loses++;
      }
      user1.save();
      user2.save();
      logger = ["The request is ok", "Request: POST[ /matches ]"];
      output =  this.matchService.createMatch(user1, user2, Score_user1, Score_user2);
    } catch (error) {
      logger = ["The request doesn't work", "Request: POST[ /matches ]"];
      output = error;
    }
    Logger.log(logger[0], logger[1]);
    return JSON.stringify(output);
  }
}

/**
    let output, logger;
    try {
      logger = ["The request is ok", "Request: POST[ /conv ]"];
      output = await this.convService.getConversationsByUserId(id);
    } catch (error) {
      logger = ["The request doesn't work", "Request: POST[ /conv ]"];
      output = error;
    }
    Logger.log(logger[0], logger[1]);
    return JSON.stringify(output);
 */