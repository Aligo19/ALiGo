import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_PIPE } from '@nestjs/core';
import * as dotenv from 'dotenv'; // Import dotenv package

import { User } from './user/user.entity';
import { Conv } from './conv/conv.entity';
import { Match } from './match/match.entity';

import { UserModule } from './user/user.module';
import { MatchModule } from './match/match.module';
import { ConvModule } from './conv/conv.module';

import { MulterModule } from '@nestjs/platform-express';

dotenv.config(); // Load environment variables from .env file

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT, 10),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [User, Conv, Match],
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule, MatchModule, ConvModule,
    MulterModule.register({dest: './public/uploads',})
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
