import { Controller, Get, Post, Body, Param, ParseIntPipe, Logger } from '@nestjs/common';
import { ConvService } from './conv.service';
import { CreateConvDto } from './create-conv.dto';
import { UserService } from 'src/user/user.service';
import { Message } from './message.objet';
import { Conv } from './conv.entity';

@Controller('conv')
export class ConvController {
  constructor(private convService: ConvService, private userService: UserService) {}

  @Get(':id')
  async getConvById(@Param('id', ParseIntPipe) id: number) {
    let output,
        logger = ["", ""];
    try {
      logger = ["The request is ok", "Request: GET[ /conv/:id ]"];
      output = await this.convService.getConvById(id);
    } catch (error) {
      logger = ["The request doesn't work", "Request: GET[ /conv/:id ]"];
      output = error;
    }
    Logger.log(logger[0], logger[1]);
    return JSON.stringify(output);
  }

  @Get(':id/user')
  async getConvUsers(@Param('id', ParseIntPipe) id: number) {
    let output,
    logger = ["", ""];
    try {
      logger = ["The request is ok", "Request: GET[ /conv/:id/users ]"];
      output = await this.convService.getConversationsByUserId(id);
    } catch (error) {
      logger = ["The request doesn't work", "Request: GET[ /conv/:id/users ]"];
      output = error;
    }
    Logger.log(logger[0], logger[1]);
    return JSON.stringify(output);
  }

  @Post(':id/pwd')
  async modifPwd(@Param('id', ParseIntPipe) id : number, @Body() pwd: string)
  {
    try {
      if (pwd)
      {
        let conv:Conv = await this.convService.getConvById(id)
        Logger.log("conv", pwd)
        if (!conv)
          return ;
        this.convService.updatePwd(conv, (pwd['value'].length === 0) ? null: pwd['value']);
      }
      
    } catch (error) {
        Logger.log(error)
    }
  }

  @Get(':id/banned/:bannedId')
  async addBannedToConv( @Param('id', ParseIntPipe) id: number, @Param('bannedId', ParseIntPipe) bannedId: number ) {
    let output, logger;
    try {
      output = await this.convService.removeUserFromConv(id, bannedId);
      logger = ["The request is ok", "Request: POST[ /conv/:id/banneds ]"];
    } catch (error) {
      logger = ["The request doesn't work", "Request: POST[ /conv/:id/banneds ]"];
      output = error;
    }
    Logger.log(logger[0], logger[1]);
    return JSON.stringify(output);
  }

  @Get(':id/pwd/:pwd')
  async checkPwd( @Param('id', ParseIntPipe) id: number, @Param('pwd') pwd: string ) {
    return this.convService.checkPwd(id, pwd);
  }

  @Post()
  async createConv(@Body() createConvDto: CreateConvDto) {
    let output,
        logger = ["", ""];
    const { name, status, password } = createConvDto;
    try {
      logger = ["The request is ok", "Request: POST[ /conv ]"];
      output =  await this.convService.createConv(name, status, password);
    } catch (error) {
      logger = ["The request doesn't work", "Request: POST[ /conv ]"];
      output = error;
    }
    Logger.log(logger[0], logger[1]);
    return JSON.stringify(output);
  }

  @Get(':id/users/:idUser')
  async addUsersToConv( @Param('id', ParseIntPipe) id: number, @Param('idUser', ParseIntPipe) userId: number ) {
    let output, logger;
    try {
      let users = [];
      users.push(await this.userService.getUserById(userId));
      logger = ["The request is ok", "Request: POST[ /conv/:id/users ]"];
      output = await this.convService.addUsersToConv(id, users);
    } catch (error) {
      logger = ["The request doesn't work", "Request: POST[ /conv/:id/users ]"];
      output = error;
    }
    Logger.log(logger[0], logger[1]);
    return JSON.stringify(output);
  }

  @Get(':id/admins/:adminId')
  async addAdminsToConv( @Param('id', ParseIntPipe) id: number, @Param('adminId', ParseIntPipe) adminId: number) {
    let output, logger;
    try {
      let admins = [];
      let me = await this.userService.getUserById(adminId)
      admins.push(me);
      output = await this.convService.addAdminsToConv(id, admins);
      logger = ["The request is ok", "Request: POST[ /conv/:id/admins ]"];
    } catch (error) {
      logger = ["The request doesn't work", "Request: POST[ /conv/:id/admins ]"];
      output = error;
    }
    Logger.log(logger[0], output);
    return JSON.stringify(output);
  }

  @Get(':id/muteds/:mutedId')
  async addMutedsToConv( @Param('id', ParseIntPipe) id: number, @Param('mutedId', ParseIntPipe) mutedId: number) {
    let output, logger;
    try {
      let muteds = [];
      muteds.push(await this.userService.getUserById(mutedId));
      output = await this.convService.addMutedsToConv(id, muteds);
      logger = ["The request is ok", "Request: POST[ /conv/:id/muteds ]"];
    } catch (error) {
      logger = ["The request doesn't work", "Request: POST[ /conv/:id/muteds ]"];
      output = error;
    }
    Logger.log(logger[0], output);
    return JSON.stringify(output);
  }

  @Get(':id/muteds/:mutedId/remove')
  async removeMutedsToConv( @Param('id', ParseIntPipe) id: number, @Param('mutedId', ParseIntPipe) mutedId: number) {
    let output, logger;
    try {
      output = await this.convService.removeMutedFromConv(id, mutedId);
      logger = ["The request is ok", "Request: POST[ /conv/:id/muteds/:mutedId/remove ]"];
    } catch (error) {
      logger = ["The request doesn't work", "Request: POST[ /conv/:id/muteds/:mutedId/remove ]"];
      output = error;
    }
    Logger.log(logger[0], logger[1]);
    return JSON.stringify(output);
  }

  @Get(':id/admins/:adminId/remove')
  async removeAdminsToConv( @Param('id', ParseIntPipe) id: number, @Param('adminId', ParseIntPipe) adminId: number) {
    let output, logger;
    try {
      output = await this.convService.removeAdminFromConv(id, adminId);
      logger = ["The request is ok", "Request: POST[ /conv/:id/admins/:adminId/remove ]"];
    } catch (error) {
      logger = ["The request doesn't work", "Request: POST[ /conv/:id/admins/:adminId/remove ]"];
      output = error;
    }
    Logger.log(logger[0], logger[1]);
    return JSON.stringify(output);
  }

  @Get(':id/users/:idUser/remove')
  async removeUsersToConv( @Param('id', ParseIntPipe) id: number, @Param('idUser', ParseIntPipe) userId: number) {
    let output, logger;
    try {
      output = await this.convService.removeUserFromConv(id, userId);
      output = await this.convService.removeAdminFromConv(id, userId);
      output = await this.convService.removeMutedFromConv(id, userId);
      logger = ["The request is ok", "Request: POST[ /conv/:id/users/:idUser/remove ]"];
    } catch (error) {
      logger = ["The request doesn't work", "Request: POST[ /conv/:id/users/:idUser/remove ]"];
      output = error;
    }
    Logger.log(logger[0], output.message);
    return JSON.stringify(output);
  }
  
  @Post(':id/message')
  async addMessageToConv( @Param('id', ParseIntPipe) id: number, @Body() messages: Message ) {
    let output, logger;
    try {
      output = await this.convService.addMessageToConv(id, messages);
      logger = ["The request is ok", "Request: POST[ /conv/:id/message ]"];
    } catch (error) {
      logger = ["The request doesn't work", "Request: POST[ /conv/:id/message ]"];
      output = error;
    }
    Logger.log(logger[0], logger[1]);
    return JSON.stringify(output);
  }

  @Get(':idUser/erase/:userFriend')
  async eraseConv( @Param('idUser', ParseIntPipe) idUser: number, @Param('userFriend') userFriend: string) {
    let output, logger;
    try {
      let idFriend = (await this.userService.getUserByPseudo(userFriend)).ID;
      output = await this.convService.removeConv(idUser, idFriend);
      logger = ["The request is ok", "Request: POST[ /conv/:idUser/erase/:userFriend ]"];
    } catch (error) {
      logger = ["The request doesn't work", "Request: POST[ /conv/:idUser/erase/:userFriend ]"];
      output = error;
    }
    Logger.log(logger[0], logger[1]);
    return JSON.stringify(output);
  }
}