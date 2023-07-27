import { ConfigService } from '@nestjs/config';
import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataUser } from './data_user.entity';
import { DataUserController } from './data_user.controller';
import { DataUserService } from './data_user.service';


@Module({
    imports: [TypeOrmModule.forFeature([DataUser])],
	controllers: [DataUserController],
  	providers: [DataUserService],
})
export class DataUserModule {
	constructor (
		@Inject(DataUserService)
		private DataUserService: DataUserService,
	) {}
}