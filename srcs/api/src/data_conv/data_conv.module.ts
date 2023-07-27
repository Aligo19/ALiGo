import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataConv } from './data_conv.entity';
import { DataConvController } from './data_conv.controller';
import { DataConvService } from './data_conv.service';

@Module({
    imports: [TypeOrmModule.forFeature([DataConv])],
	controllers: [DataConvController],
  	providers: [DataConvService],
})
export class DataConvModule {
	constructor (
		@Inject(DataConvService)
		private DataConvService: DataConvService,
	) {}
}