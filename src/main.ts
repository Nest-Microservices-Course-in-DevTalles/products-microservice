import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('Main');

  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {// configuraciones del microservicio
      transport: Transport.TCP, // para no usarlo con el transporte HTTP
      options: {
        port: envs.port
      }
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // await app.listen( envs.port ); // Esto ya no funcionaría, porque el puerto ya fue definido mas arriba
  await app.listen();

  // app.startAllMicroservices(); // Esto sería si quisieramos que funcione como híbrido (HTTP + TCP)

  logger.log(`Products Microservice running on port ${envs.port}`);
}
bootstrap();
