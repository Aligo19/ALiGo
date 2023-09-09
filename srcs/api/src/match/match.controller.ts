// match.controller.ts
import { Controller, Get, Post, Body, Param, ParseIntPipe, NotFoundException, Logger } from '@nestjs/common';
import { MatchService } from './match.service';
import { CreateMatchDto } from './create-match.dto';
import { Match } from 'src/match/match.entity';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/create-user.dto';
import { EndMatchDto } from './end-match.dot';
import { ConvService } from 'src/conv/conv.service';

@Controller('matches')
export class MatchController {
  constructor(private matchService: MatchService, private userService: UserService, private convService: ConvService) {}

/****************************************/
/*                                      */
/*   GET                                */
/*                                      */
/****************************************/
@Get('/streaming')
async sdf() {
  let output, logger;
  try { 
    output = await this.matchService.getMatchPlaying();
    logger = ["The request is ok", "Request: GET[ /streaming ]"];
  
  } catch (error) {
    output = error;
    logger = ["The request doesn't work", "Request: GET[ /streaming ]"];
  }
  Logger.log(logger[0], logger[1]);
  return JSON.stringify(output);
}
/**
 * @description Get match with id
 * @param id 
 * @returns 
 */
  @Get(':id')
  async getMatchById(@Param('id', ParseIntPipe) id: number): Promise<Match> {
    let output, logger;
    try {
      output = await this.matchService.getMatchById(id);
      logger = ["The request is ok", "Request: GET[ /matches/:id ]"];
      if (!output)
        throw new NotFoundException('Match not found');
    } catch (error) {
      logger = ["The request doesn't work", "Request: GET[ /matches/:id ]"];
      output = error;
    }
    Logger.log(logger[0], logger[1]);
    return output;
  }

/**
 * @description Get all matches of id user
 * @param userId 
 * @returns 
 */
  @Get(':userId/user')
  async getMatchesByUserId(@Param('userId', ParseIntPipe) userId: number): Promise<String> {
    let output, logger;
    try {
      output = await this.matchService.getMatchByIdUser(userId);
      logger = ["The request is ok", "Request: GET[ /user/:userId ]"];
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
        this.userService.updateGameStatus(user, true);
        this.userService.updateDate(user);
        let matches = await this.matchService.getMatchByIdUserDebug(user.ID);
        Logger.log(matches)
        if (matches && matches.length > 0)
            return JSON.stringify(matches[0]);
        if (gameLoading.length > 0) {
            const game = gameLoading[0]
            game.ID_user2 = user;
            game.Status = 1;
            output = await this.matchService.updateMatch(game);
        } else
            output = await this.matchService.createMatch(user);
        logger = ["The request is ok", "Request: POST[ /matches ]"];
    } catch (error) {
        logger = ["The request doesn't work", "Request: POST[ /matches ]"];
        output = error;
    }
    Logger.log(logger[0], logger[1]);
    return JSON.stringify(output);
  }

  @Get(':id/search/:idFriend')
  async createMatchWithFriend(@Param('id', ParseIntPipe) id1: number, @Param('idFriend', ParseIntPipe) id2: number) {
    let output, logger;
    try {
        const user1 = await this.userService.getUserById(id1);
        const user2 = await this.userService.getUserById(id2);
        let game = await this.matchService.getMatchByIdUserDebug(user1.ID)
        let game2 = await this.matchService.getMatchByIdUserDebug(user2.ID)
        if (game && game2 && game.length && game2.length && game[0].ID === game2[0].ID && game[0].Status === -1)
        {
          let matches = await this.matchService.getMatchById(game[0].ID);
          if (matches.ID_user1.ID !== user1.ID)
          {
            matches.Status = 1;
            let convs1:any = await this.convService.getConversationsByUserId(user1.ID)
            let convs2:any = await this.convService.getConversationsByUserId(user2.ID)
            let conv;
            for (let i1 = 0; i1 < convs1.length; i1++)
              for (let i2 = 0; i2 < convs2.length; i2++)
                if (convs1[i1].ID === convs2[i2].ID && convs1[i1].Status === 2)
                  conv = convs1[i1]
            conv = await this.convService.getConvById(conv.ID);
            conv.Messages = conv.Messages.filter(message => message.Button !== true);
            conv.save();
            output = await this.matchService.updateMatch(matches);
          }
          output = null
        }
        else
        {
          this.userService.updateGameStatus(user1, true);
          this.userService.updateDate(user1);
          let matches = await this.matchService.getMatchByIdUserDebug(user1.ID);
          if (matches && matches.length > 0)
              return JSON.stringify(matches[0]);
          matches = await this.matchService.getMatchByIdUserDebug(user2.ID);
          if (matches && matches.length > 0)
              return JSON.stringify(matches[0]);
          output = await this.matchService.createMatchWithFriend(user1, user2);
        }
        logger = ["The request is ok", "Request: GET[ /matches/:id/search/:idFriend ]"];
    } catch (error) {
        logger = ["The request doesn't work", "Request: GET[ /matches/:id/search/:idFriend ]"];
        output = error;
    }
    Logger.log(logger[0], logger[1]);
    return JSON.stringify(output);
  }

  // @Get(":id/connect/:idGame")
  // async joinGame(@Param('id', ParseIntPipe) id1: number, @Param('idGame', ParseIntPipe) idGame: number)
  // {
  //   let output, logger;
  //   try {
  //     const user1 = await this.userService.getUserById(id1);
  //     this.userService.updateGameStatus(user1, true);
  //     this.userService.updateDate(user1);
  //     let matches = await this.matchService.getMatchById(idGame);
  //     if (user1.Pseudo === matches.ID_user1.Pseudo)
  //       return;
  //     matches.Status = 1;
  //     output = await this.matchService.updateMatch(matches);
  //     logger = ["The request is ok", "Request: POST[ /matches ]"];
  // } catch (error) {
  //     logger = ["The request doesn't work", "Request: POST[ /matches ]"];
  //     output = error;
  // }
  // Logger.log(logger[0], logger[1]);
  // return JSON.stringify(output);
  // }

  /****************************************/
  /*                                      */
  /*   POST                               */
  /*                                      */
  /****************************************/
  /**
   * @description End a match
   * @param match
   * @returns
   * 
   * TODO: Add a winner and loser to the match and update the elo of the players and the status
   **/
    @Post('/end')
    async endMatch(@Body() matchDatas: EndMatchDto) {
        let output, logger, match;
        try {
            match = await this.matchService.getMatchById(matchDatas.Id);
            this.userService.updateGameStatus(match.ID_user1, false);
            this.userService.updateGameStatus(match.ID_user2, false);
            this.userService.updateUser(match.ID_user1);
            this.userService.updateUser(match.ID_user2);
            if (match.Status != 1)
                throw new NotFoundException('Match is finished or not start');
            match.Status = 2;
            if (matchDatas.Score_user1 < matchDatas.Score_user2) {
                match.ID_user1.Elo -= 10;
                match.ID_user2.Elo += 10;
            }
            else {
                match.ID_user1.Elo += 10;
                match.ID_user2.Elo -= 10;
            }
            logger = ["The request is ok", "Request: POST[ /matches/:id/end ]"];
            output = await this.matchService.updateMatch(match);
        } catch (error) {
            logger = ["The request doesn't work", "Request: POST[ /matches/:id/end ]"];
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