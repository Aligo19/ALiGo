// conv.controller.ts
import { Controller, Get, Post, Body, Param, ParseIntPipe, NotFoundException, Logger } from '@nestjs/common';
import { ConvService } from './conv.service';
import { CreateConvDto } from './create-conv.dto'; // Replace this with your DTO if you have one
import { Conv } from 'src/conv/conv.entity';
import { UserService } from 'src/user/user.service';
import { Message } from './message.objet';

@Controller('conv')
export class ConvController {
  constructor(private convService: ConvService, private userService: UserService) {}

/****************************************/
/*                                      */
/*   GET                                */
/*                                      */
/****************************************/

/**
 * @description Get conv with id
 * @param id 
 * @returns 
 */
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
  
/**
 * @description Get all convs with user id
 * @param id 
 * @returns 
 */
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

  /**
 * @description Add banned to conv
 * @param id
 * @param bannedIds
 * @returns
  */
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


/****************************************/
/*                                      */
/*   POST                               */
/*                                      */
/****************************************/


/**
 * @description Create a new conv
 * @param createConvDto
 * @returns
 */
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

/**
 * @description Add users to conv
 * @param id 
 * @param userIds 
 * @returns 
 */
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

/**
 * @description Add admins to conv
 * @param id 
 * @param adminIds 
 * @returns 
 */
  @Get(':id/admins/:adminId')
  async addAdminsToConv( @Param('id', ParseIntPipe) id: number, @Param('adminId', ParseIntPipe) adminId: number) {
    let output, logger;
    try {
      let admins = [];
      admins.push(await this.userService.getUserById(adminId));
      output = await this.convService.addAdminsToConv(id, admins);
      logger = ["The request is ok", "Request: POST[ /conv/:id/admins ]"];
    } catch (error) {
      logger = ["The request doesn't work", "Request: POST[ /conv/:id/admins ]"];
      output = error;
    }
    Logger.log(logger[0], output);
    return JSON.stringify(output);
  }

/**
 * @description Add muteds to conv
 * @param id 
 * @param mutedIds 
 * @returns 
 */
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