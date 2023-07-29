import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { seedConvs } from './conv/conv.seed';
import { seedMatches } from './match/match.seed';
import { seedUsers } from './user/user.seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await seedUsers();
  await seedMatches();
  await seedConvs();
  await app.listen(3000);
}
bootstrap();
