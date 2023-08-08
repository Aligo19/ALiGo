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
  @Get(':id/bannedUser/:bannedId')
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

 @Get(':id/bannedAmin/:bannedId')
 async addBannedAdminToConv( @Param('id', ParseIntPipe) id: number, @Param('bannedId', ParseIntPipe) bannedId: number ) {
    let output, logger;
    try {
      output = await this.convService.removeAdminFromConv(id, bannedId);
      logger = ["The request is ok", "Request: POST[ /conv/:id/banneds ]"];
    } catch (error) {
      logger = ["The request doesn't work", "Request: POST[ /conv/:id/banneds ]"];
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
  @Post(':id/users')
  async addUsersToConv( @Param('id', ParseIntPipe) id: number, @Body() userIds: number[] ) {
    let output, logger;
    try {
      let users = [];
      for (const userId of userIds)
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
  @Post(':id/admins')
  async addAdminsToConv( @Param('id', ParseIntPipe) id: number, @Body() adminIds: number[] ) {
    let output, logger;
    try {
      let admins = [];
      for (const adminId of adminIds)
          admins.push(await this.userService.getUserById(adminId));
      output = await this.convService.addAdminsToConv(id, admins);
      logger = ["The request is ok", "Request: POST[ /conv/:id/admins ]"];
    } catch (error) {
      logger = ["The request doesn't work", "Request: POST[ /conv/:id/admins ]"];
      output = error;
    }
    Logger.log(logger[0], logger[1]);
    return JSON.stringify(output);
  }

/**
 * @description Add muteds to conv
 * @param id 
 * @param mutedIds 
 * @returns 
 */
  @Post(':id/muteds')
  async addMutedsToConv( @Param('id', ParseIntPipe) id: number, @Body() mutedIds: number[] ) {
    let output, logger;
    try {
      let muteds = [];
      for (const mutedId of mutedIds)
          muteds.push(await this.userService.getUserById(mutedId));
      output = await this.convService.addMutedsToConv(id, muteds);
      logger = ["The request is ok", "Request: POST[ /conv/:id/muteds ]"];
    } catch (error) {
      logger = ["The request doesn't work", "Request: POST[ /conv/:id/muteds ]"];
      output = error;
    }
    Logger.log(logger[0], logger[1]);
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