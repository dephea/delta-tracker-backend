import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log(process.env.PORT);
  console.log("MY KEY:" + process.env.JWT_SECRET_KEY);
  await app.listen(process.env.PORT ?? 2999);
}
bootstrap();
