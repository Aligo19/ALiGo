import { ConfigService } from '@nestjs/config';
import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Field } from './field.entity';
import { FieldController } from './field.controller';
import { FieldService } from './field.service';

@Module({
    imports: [TypeOrmModule.forFeature([Field])],
	controllers: [FieldController],
  	providers: [FieldService],
})
export class FieldModule {
	constructor (
		@Inject(FieldService)
		private FieldService: FieldService,
	) {}
}