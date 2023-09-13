import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conv } from './conv.entity';
import { ConvController } from './conv.controller';
import { ConvService } from './conv.service';
import { UserModule } from 'src/user/user.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Conv]),
    UserModule
  ],
  controllers: [ConvController],
  providers: [ConvService],
  exports: [ConvService]
})
export class ConvModule {}
