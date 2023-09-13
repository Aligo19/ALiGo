import { Controller, Get, Post, Body, Param, ParseIntPipe, NotFoundException, Logger, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { HttpService } from '@nestjs/axios';
import { UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { promises as fsPromises } from 'fs';
import * as path from 'path';

@Controller('users')
export class UserController {
  constructor(  private readonly userService: UserService, 
                private readonly httpService: HttpService) {}

/****************************************/
/*                                      */
/*   POST                               */
/*                                      */
/****************************************/

/**
 * @description Upload a file
 * @param id
 * @returns
 */
    @Post(':id')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file, @Param('id') userId: string) 
    {
      let output, logger;
      try
      {
        /* Security check */
        if (!file || !file.originalname) {
          return { message: 'No file provided' };
        }
        /* Path and download the file */
        const uniqueFileName = `${userId}-${file.originalname}`;
        let filePath = path.join(__dirname, '..', '..','public','imgs', uniqueFileName);
        await fsPromises.writeFile(filePath, file.buffer);
        filePath = path.join('files', uniqueFileName);
  
          let user = await this.userService.getUserByPseudo(userId);
          output =  await this.userService.updateAvatar(user, filePath);
          logger = ["The request is ok", "Request: POST[ /users/:id ]"];
      } catch (error) {
        logger = ["The request doesn't work", error];
        output = error;
      }
      Logger.log(logger[0], logger[1]);
      return JSON.stringify(output);
    }


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
            if (!output)
                throw new NotFoundException('User not found');
        } catch (error) {
            logger = ["The request doesn't work", "Request: GET[ /users/:id ]"];
            output = error;
        }
        Logger.log(logger[0], logger[1]);
        return JSON.stringify(output);
    }

    //affiche le pseudo
    @Get(':id/pseudo')
    async getUserPseudoById(@Param('id') id: string) {
        let output, logger;
        try {
            logger = ["The request is ok", "Request: GET[ /users/:id/pseudo ]"];
            output = await this.userService.getUserByPseudo(id);
            if (!output)
                throw new NotFoundException('User not found' + id);
        } catch (error) {
            logger = ["The request doesn't work", "Request: GET[ /users/:id/pseudo ]"];
            output = error;
        }
        Logger.log(logger[0], logger[1]);
        return JSON.stringify(output);
    }
    @Get(':id/password/:password')
    async getUserPasswordById(@Param('id') id: number, @Param('password') password: number) {
        let output, logger;
        try {
            logger = ["The request is ok", "Request: GET[ /users/:id/password/:password ]"];
            output = await this.userService.getPassword(id);
            if (output != password)
                throw new NotFoundException('User not found' + id);
            if (!output)
                throw new NotFoundException('User not found' + id);
            output = await this.userService.getUserById(id);
            output = await this.userService.removePassword(id);
            logger[1] = output.ID;
        } catch (error) {
            logger = ["The request doesn't work", "Request: GET[ /users/:id/password/:password ]"];
            output = error;
        }
        Logger.log(logger[0], logger[1]);
        return JSON.stringify(output);
    }

    @Get(':code/login')
    async getUserByCode(@Param('code') code: string){
        let logger, output;
        try {
            const response = await this.httpService.axiosRef
            .post(
            'https://api.intra.42.fr/oauth/token',
                {
                    grant_type: 'authorization_code',
                    client_id: process.env.CLIENT_ID,
                    client_secret: process.env.CLIENT_SECRET,
                    code: code,
                    redirect_uri: process.env.URL_RED,
                },
                {   
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }
            );
            const user = await this.httpService.axiosRef.get('https://api.intra.42.fr/v2/me?access_token=' + response.data["access_token"]);
            output =  await this.userService.getUserBy19Id(user.data["login"]);
            logger = ["The request is ok", "Request: GET[ /users/:code/login ]"];
            if (output == null)
            {
              output = (await this.userService.createUser(user.data["login"], user.data["login"], user.data["image"]["link"]));
              await this.userService.updateDate(output);
              output = { data: output}
            }
            else{
              await this.userService.updateDate(output);
            }
        } catch (error) {
            logger = ["The request doesn't work", output];
            output = error;
        }
        Logger.log(logger[0], logger[1]);
        return JSON.stringify(output);
    }

    @Get(':id/active')
    async active(@Param('id', ParseIntPipe) id: number)
    {
      let logger;
      try {
          await this.userService.updateDate(await this.userService.getUserById(id));
          logger = ["The request is ok", "Request: GET[ /users/:code/login ]"];
      } catch (error) {
          logger = ["The request doesn't work", "Request: GET[ /users/:code/login ]"];
      }
      Logger.log(logger[0], logger[1]);
    }

/**
 * @description Add a friend to a user
 * @param id 
 * @param friendId 
 * @returns 
 */
    @Get(':id/friends/:friendName/add')
    async addFriend(@Param('id', ParseIntPipe) id: number, @Param('friendName') friendName: string) {
        let output, logger;
        try {
            const user = await this.userService.getUserById(id);
            const friend = await this.userService.getUserByPseudo(friendName);
            if (!user || !friend)
                throw new NotFoundException('User not found');
            logger = ["The request is ok", "Request: GET[ /users/:id/friends/:friendName/add ]"];
            if (user.Friends.find(f => f.Pseudo === friend.Pseudo))
            {
                logger = ["The request doesn't work", "Request: GET[ /users/:id/friends/:friendName/add ]"];
                const out = {
                        "message": "User cannot be friend with the same user twice",
                        "status": 400,
                        "error": "Bad Request"
                }
                return JSON.stringify(out);
            }
            if (user == friend)
            {
                logger = ["The request doesn't work", "Request: GET[ /users/:id/friends/:friendName/add ]"];
                const out = {
                        "message": "User cannot be friend with himself",
                        "status": 400,
                        "error": "Bad Request"
                }
                return JSON.stringify(out);
            }
            output = await this.userService.addFriend(user, friend);
            if (output == null)
                throw new NotFoundException('Friend not found');
            await this.userService.updateDate(user);
        } catch (error) {
            logger = ["The request doesn't work", "Request: GET[ /users/:id/friends/:friendName/add ]"];
            output = error;
        }
        Logger.log(logger[0], logger[1]);
        return JSON.stringify(null);
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
      if (!user || !blockedUser)
        throw new NotFoundException('User not found');
      logger = ["The request is ok", "Request: POST[ /users/:id/block ]"];
      output = await this.userService.blockUser(user, blockedUser);
      output = await this.userService.removeFriend(user, blockedUser);
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
      if (!user)
        throw new NotFoundException('User not found');
      Object.assign(user, updatedUserData);
      if (updatedUserData.email.length > 0)
      {
        user.email = updatedUserData.email;
      }
      else
        user.email = '';
    
      logger = ["The request is ok", "PATCH [/users/:id]"];
      output =  updatedUserData;
      await this.userService.updateUser(user);
    } catch (error) {
      logger = ["The request doesn't work", "PATCH [/users/:id]"];
      output = error;
    }
    Logger.log(logger[0], logger[1]);
    return JSON.stringify(output);

  }
}