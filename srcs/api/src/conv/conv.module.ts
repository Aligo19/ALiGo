import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conv } from './conv.entity';
import { ConvService } from './conv.service';
import { ConvController } from './conv.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Conv])],
	controllers: [ConvController],
  	providers: [ConvService],
})
export class ConvModule {
	constructor (
		@Inject(ConvService)
		private ConvService: ConvService,
	) {}
}