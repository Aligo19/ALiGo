import { Controller, Get, Post, Body, Param, ParseIntPipe, NotFoundException, Logger } from '@nestjs/common';
import { MatchService } from './match.service';
import { Match } from 'src/match/match.entity';
import { UserService } from 'src/user/user.service';
import { EndMatchDto } from './end-match.dot';
import { ConvService } from 'src/conv/conv.service';

const red_New_Match = 40;
const green_New_Match = 40;
const blue_New_Match = 40;

const red_First_Lose = 110;
const green_First_Lose = 110;
const blue_First_Lose = 110;

const red_First_Win = 120;
const green_First_Win = 120;
const blue_First_Win = 120;


@Controller('matches')
export class MatchController {
  constructor(private matchService: MatchService, private userService: UserService, private convService: ConvService) {}

@Get('/delete/:id')
async lotre(@Param('id', ParseIntPipe) id: number) {
  Logger.log("test", "test")

  let matches = await this.matchService.getMatchById(id);
  const user1 = await this.userService.getUserById(matches.ID_user1.ID);
  const user2 = await this.userService.getUserById(matches.ID_user2.ID);
  this.userService.updateGameStatus(user1, false)
  this.userService.updateGameStatus(user2, false)
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
  await this.matchService.updateMatch(matches);
  await this.matchService.deleteMatch(id)
}

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

    @Post('/end')
    async endMatch(@Body() matchDatas: EndMatchDto) {
        let output, logger, match;
        try {
            match = await this.matchService.getMatchById(matchDatas.Id);
            match.Score_user1 = matchDatas.Score_user1;
            match.Score_user2 = matchDatas.Score_user2;
            this.userService.updateGameStatus(match.ID_user1, false);
            this.userService.updateGameStatus(match.ID_user2, false);
            if (match.Status != 1)
                throw new NotFoundException('Match is finished or not start');
            match.Status = 2;
            if (match.ID_user1.Loses === 0 && match.ID_user1.Wins === 0)
             this.userService.addSkin(match.ID_user1, red_New_Match, green_New_Match, blue_New_Match)
            if (match.ID_user2.Loses === 0 && match.ID_user2.Wins === 0)
             this.userService.addSkin(match.ID_user2, red_New_Match, green_New_Match, blue_New_Match)
            if (matchDatas.Score_user1 < matchDatas.Score_user2) {
                match.ID_user1.Elo -= 10;
                match.ID_user2.Elo += 10;
                if (match.ID_user2.Wins === 0)
                  this.userService.addSkin(match.ID_user2, red_First_Win, green_First_Win, blue_First_Win)
                if (match.ID_user1.Loses === 0)
                  this.userService.addSkin(match.ID_user1, red_First_Lose, green_First_Lose, blue_First_Lose)
                match.ID_user2.Wins++;
                match.ID_user1.Loses++;
            }
            else {
                match.ID_user1.Elo += 10;
                match.ID_user2.Elo -= 10;
                if (match.ID_user1.Wins === 0)
                  this.userService.addSkin(match.ID_user1, red_First_Win, green_First_Win, blue_First_Win)
                if (match.ID_user2.Loses === 0)
                  this.userService.addSkin(match.ID_user2, red_First_Lose, green_First_Lose, blue_First_Lose)
                match.ID_user1.Wins++;
                match.ID_user2.Loses++;
            }
            this.userService.updateUser(match.ID_user1);
            this.userService.updateUser(match.ID_user2);
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