import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from './user/user.entity';

import { Field } from './field/field.entity';

import { Conv } from './conv/conv.entity';

import { DataUser } from './data_user/data_user.entity';

import { Match } from './match/match.entity';

import { DataConv } from './data_conv/data_conv.entity';

import { DataMess } from './data_mess/data_mess.entity';
import { UserModule } from './user/user.module';
import { MatchModule } from './match/match.module';
import { FieldModule } from './field/field.module';
import { DataUserModule } from './data_user/data_user.module';
import { ConvModule } from './conv/conv.module';
import { DataConvModule } from './data_conv/data_conv.module';
import { DataMessModule } from './data_mess/data_mess.module';

// import { User ,Field ,Conv ,DatasUser ,Match ,DataConv ,DataMess } from './entities/test';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [User ,Field ,Conv ,DataUser ,Match ,DataConv ,DataMess],
      synchronize: true,
    }),
    UserModule, MatchModule, FieldModule, DataUserModule, ConvModule, DataConvModule, DataMessModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
}
