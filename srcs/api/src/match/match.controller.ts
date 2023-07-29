// match.controller.ts
import { Controller, Get, Post, Body, Param, ParseIntPipe, NotFoundException, Logger } from '@nestjs/common';
import { MatchService } from './match.service';
import { CreateMatchDto } from './create-match.dto';
import { Match } from 'src/match/match.entity';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/create-user.dto';

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
  @Get(':userId/user')
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


  
/**
 * @description Create a new match
 * @param createMatchDto 
 * @returns 
 */
  @Get(':id/search')
  async createMatch(@Param('id', ParseIntPipe) id: number) {
    let output, logger;
    try {
      const gameLoading = await this.matchService.getMatchLoading();
      const user = await this.userService.getUserById(id);
      if (gameLoading.length > 0) {
        const game = gameLoading[0]
        game.ID_user2 = user;
        game.Status = 1;
        output = await this.matchService.updateMatch(game);
      } else {
        output = await this.matchService.createMatch(user);
      }
      logger = ["The request is ok", "Request: POST[ /matches ]"];
    } catch (error) {
      logger = ["The request doesn't work", "Request: POST[ /matches ]"];
      output = error;
    }
    Logger.log(logger[0], logger[1]);
    return JSON.stringify(output);
  }
}

/****************************************/
/*                                      */
/*   POST                               */
/*                                      */
/****************************************/

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