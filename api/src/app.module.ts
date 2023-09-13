import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_PIPE } from '@nestjs/core';
import * as dotenv from 'dotenv';

import { User } from './user/user.entity';
import { Conv } from './conv/conv.entity';
import { Match } from './match/match.entity';

import { UserModule } from './user/user.module';
import { MatchModule } from './match/match.module';
import { ConvModule } from './conv/conv.module';

import { MulterModule } from '@nestjs/platform-express';
import { FilesController } from './pic/pic.controller';

import { MailerModule } from '@nestjs-modules/mailer';
import { MailController } from './mail/mail.controller';

dotenv.config();

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.EMAIL_HOST,
          port: parseInt(process.env.EMAIL_PORT, 10),
          secure: false,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PWD,
          },
        },
        defaults: {
          from: `"No Reply" <${process.env.EMAIL_USER}>`,
        }
      }),
    }),
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
    UserModule, MatchModule, ConvModule,  MailerModule,
    MulterModule.register({dest: './public/img',})
  ],
  controllers: [FilesController, MailController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
