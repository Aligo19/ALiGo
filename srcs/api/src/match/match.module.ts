import { ConfigService } from '@nestjs/config';
import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { Match } from './match.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Match])],
	controllers: [MatchController],
  	providers: [MatchService],
})
export class MatchModule {
	constructor (
		@Inject(MatchService)
		private MatchService: MatchService,
	) {}
}