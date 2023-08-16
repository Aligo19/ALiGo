// user.controller.ts
import { Controller, Get, Post, Body, Param, ParseIntPipe, NotFoundException, Logger, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './create-user.dto'; // Replace this with your DTO if you have one
import { User } from './user.entity';
import { HttpService } from '@nestjs/axios';


@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService, private readonly httpService: HttpService) {}

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

    @Get(':code/login')
    async getUserByCode(@Param('code') code: string): Promise<User> {
      try {
        const response = await this.httpService.axiosRef
        .post(
          'https://api.intra.42.fr/oauth/token',
            {
                grant_type: 'authorization_code',
                client_id: 'u-s4t2ud-3877a3e700b6b8841a31f110495b6d430ce41dc60be48f28aeca81423a03577b',
                client_secret: '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',
                code: code,
                redirect_uri: 'http://127.0.0.1:3000',
            },
            {   
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }
        );
          
        const token = response.data["access_token"];
        const user = await this.httpService.axiosRef.get('https://api.intra.42.fr/v2/me?access_token=' + token);
        if (await this.userService.getUserBy19Id(user.data["login"]) == null)
        {
            return await this.userService.createUser(user.data["login"], user.data["login"], user.data["image"]["link"]);
        }
        else
        {
            return await this.userService.getUserBy19Id(user.data["login"]);
        }
      } catch (error) {
        Logger.log('fds', error);
        return null; // TODO: CATCH HTTP ERROR CODE AND SHOW SOME ERROR MESSAGE TO THE USER ft_delog
      }
    }

/**
 * @description Add a friend to a user
 * @param id 
 * @param friendId 
 * @returns 
 */
  @Get(':id/friends/:friendName/add')
  async addFriend(@Param('id', ParseIntPipe) id: number, @Param('friendName') friendName: string): Promise<String> {
    let output, logger;
    try {
      const user = await this.userService.getUserById(id);
      const friend = await this.userService.getUserByPseudo(friendName);
      if (!user || !friend) {
        throw new NotFoundException('User not found');
      }
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
  @Get(':id/block/:blockName/add')
  async blockUser(@Param('id', ParseIntPipe) id: number, @Param('blockName') blockName: string): Promise<String> {
    let output, logger;
    try {
      const user = await this.userService.getUserById(id);
      const blockedUser = await this.userService.getUserByPseudo(blockName);
      if (!user || !blockedUser) {
        throw new NotFoundException('User not found');
      }
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
  async updateUser(@Param('id', ParseIntPipe) id: number, @Body() updatedUserData: Partial<User>): Promise<String> {
    let output, logger;
    try {
      const user = await this.userService.getUserById(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      Object.assign(user, updatedUserData);
      logger = ["The request is ok", "Request: PATCH[ /users/id ]"];
      output =  updatedUserData;
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