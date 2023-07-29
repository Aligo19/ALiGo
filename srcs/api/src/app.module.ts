import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_PIPE } from '@nestjs/core';

import { User } from './user/user.entity';
import { Conv } from './conv/conv.entity';
import { Match } from './match/match.entity';

import { UserModule } from './user/user.module';
import { MatchModule } from './match/match.module';
import { ConvModule } from './conv/conv.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [User ,Conv ,Match],
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule, MatchModule, ConvModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {
}
