import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { HttpModule } from '@nestjs/axios';
import { Axios } from 'axios';

@Module({
  imports: [TypeOrmModule.forFeature([User]), HttpModule, Axios],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
