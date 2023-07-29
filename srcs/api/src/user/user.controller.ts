// user.controller.ts
import { Controller, Get, Post, Body, Param, ParseIntPipe, NotFoundException, Logger, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './create-user.dto'; // Replace this with your DTO if you have one
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

/****************************************/
/*                                      */
/*   GET                                */
/*                                      */
/****************************************/

/**
 * @description Get user with id
 * @param id 
 * @returns 
 */
  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    let output, logger;
    try {
      logger = ["The request is ok", "Request: GET[ /users/:id ]"];
      output = await this.userService.getUserById(id);
    } catch (error) {
      logger = ["The request doesn't work", "Request: GET[ /users/:id ]"];
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
 * @description Create a new user
 * @param createUserDto 
 * @returns 
 */
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    let output, logger;
    try {
      const { ID_19, Pseudo, Avatar } = createUserDto;
      logger = ["The request is ok", "Request: POST[ /users ]"];
      output = this.userService.createUser(ID_19, Pseudo, Avatar);
    } catch (error) {
      logger = ["The request doesn't work", "Request: POST[ /users ]"];
      output = error;
    }
    Logger.log(logger[0], logger[1]);
    return JSON.stringify(output);
    
  }

/**
 * @description Add a friend to a user
 * @param id 
 * @param friendId 
 * @returns 
 */
  @Post(':id/friends')
  async addFriend(@Param('id', ParseIntPipe) id: number, @Body() friendId: number) {
    let output, logger;
    try {
      const user = await this.userService.getUserById(id);
      const friend = await this.userService.getUserById(friendId);
      logger = ["The request is ok", "Request: POST[ /users/:id/friends ]"];
      output = this.userService.addFriend(user, friend);
    } catch (error) {
      logger = ["The request doesn't work", "Request: POST[ /users/:id/friends ]"];
      output = error;
    }
    Logger.log(logger[0], logger[1]);
    return JSON.stringify(output);
  }

/**
 * @description Block a user
 * @param id 
 * @param blockedUserId 
 * @returns 
 */
  @Post(':id/block')
  async blockUser(@Param('id', ParseIntPipe) id: number, @Body() blockedUserId: number) {
    let output, logger;
    try {
      const user = await this.userService.getUserById(id);
      const blockedUser = await this.userService.getUserById(blockedUserId);
      logger = ["The request is ok", "Request: POST[ /users/:id/block ]"];
      output = await this.userService.blockUser(user, blockedUser);
    } catch (error) {
      logger = ["The request doesn't work", "Request: POST[ /users/:id/block ]"];
      output = error;
    }
    Logger.log(logger[0], logger[1]);
    return JSON.stringify(output);
    
  }

/****************************************/
/*                                      */
/*   PATCH                              */
/*                                      */
/****************************************/

/**
 * @description Update a user
 * @param id 
 * @param updatedUserData 
 * @returns 
 */
  @Patch(':id')
  async updateUser(@Param('id', ParseIntPipe) id: number, @Body() updatedUserData: Partial<User>) {
    let output, logger;
    try {
      const user = await this.userService.getUserById(id);
      Object.assign(user, updatedUserData);
      logger = ["The request is ok", "Request: PATCH[ /users/id ]"];
      output =  this.userService.updateUser(user);
    } catch (error) {
      logger = ["The request doesn't work", "Request: PATCH[ /users/id ]"];
      output = error;
    }
    Logger.log(logger[0], logger[1]);
    return JSON.stringify(output);

  }
}


/**
    let output, logger;
    try {
      logger = ["The request is ok", "Request: POST[ /users ]"];
      output = await this.convService.getConversationsByUserId(id);
    } catch (error) {
      logger = ["The request doesn't work", "Request: POST[ /users ]"];
      output = error;
    }
    Logger.log(logger[0], logger[1]);
    return JSON.stringify(output);
 */