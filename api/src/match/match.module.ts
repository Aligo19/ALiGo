import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './match.entity';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { UserModule } from 'src/user/user.module';
import { ConvModule } from 'src/conv/conv.module';

@Module({
  imports: [TypeOrmModule.forFeature([Match]), 
            UserModule, ConvModule],
  providers: [MatchService],
  controllers: [MatchController],
})
export class MatchModule {}
