import { ConfigService } from '@nestjs/config';
import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { FieldService } from 'src/field/field.service';
import { DataUserService } from 'src/data_user/data_user.service';
import { DataUser } from 'src/data_user/data_user.entity';
import { Field } from 'src/field/field.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Field, DataUser])],
	controllers: [UserController],
  	providers: [UserService, FieldService, DataUserService],
})
export class UserModule {
	constructor (
		@Inject(UserService)
		private UserService: UserService,
		private DataUserService: DataUserService,
		private FieldService: FieldService
	) {}
}