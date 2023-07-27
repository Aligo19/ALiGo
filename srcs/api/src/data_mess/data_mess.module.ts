import { ConfigService } from '@nestjs/config';
import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataMessController } from './data_mess.controller';
import { DataMess } from './data_mess.entity';
import { DataMessService } from './data_mess.service';

@Module({
    imports: [TypeOrmModule.forFeature([DataMess])],
	controllers: [DataMessController],
  	providers: [DataMessService],
})
export class DataMessModule {
	constructor (
		@Inject(DataMessService)
		private DataMessService: DataMessService,
	) {}
}