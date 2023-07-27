import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createInitialData } from './field/field.data';
import { createInitialDataUser } from './user/user.data';
import { createInitialDataMatch } from './match/match.data';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  createInitialData();
  createInitialDataUser();
  createInitialDataMatch();
  await app.listen(3000);
}
bootstrap();
