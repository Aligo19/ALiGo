import { Controller, Get, Inject, Logger, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { DataUserService } from 'src/data_user/data_user.service';

@Controller('/user')
export class UserController {
  constructor(private UserService: UserService,
              private DataUserService: DataUserService) {}

  @Get(':id')
  async getUser(@Param('id') id: string) {
    let output = {};
    let logger = "";
    try {
      let user = await this.UserService.findOne(Number(id)),
          data_user = await this.DataUserService.findWhere(Number(id)),
          datas = [];
      if ((user === undefined || user === null)) {
        logger = 'UserController getUser: ' + id + "user not found";
        output = {error: 'User not found'};
      }
      for (let index = 0; index < data_user.length; index++) {
        const data = data_user[index];
        datas.push({
          data: data.data,
          field: data.Id_field.name,
        });
      }
      logger = 'UserController getUser: ' + id;
      output = {...user, ...datas};
    } catch (error) {
      logger = 'UserController getUser: ' + id + ' // Error in request';
      output = {error: 'The request failed'};
    }
    Logger.log(logger, 'Request GET');
    return JSON.stringify(output);
  }
}