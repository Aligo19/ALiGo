import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { seedConvs } from './conv/conv.seed';
import { seedMatches } from './match/match.seed';
import { seedUsers } from './user/user.seed';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await seedUsers();
  await seedMatches();
  await seedConvs();
    // Configuration des options CORS
    const corsOptions: CorsOptions = {
      origin: 'http://127.0.0.1:3000', // L'URL de l'application React
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      optionsSuccessStatus: 204,
    };
  
    app.enableCors(corsOptions);
  await app.listen(3001);
}
bootstrap();
