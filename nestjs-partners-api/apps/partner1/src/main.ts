import { NestFactory } from '@nestjs/core';
import { Partner1Module } from './partner1.module';
import {UnprocessableEntityException, ValidationPipe} from "@nestjs/common";
import {PrismaTransactionExceptionFilter} from "@app/core/filters/prisma-transaction-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(Partner1Module);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (errors) => {
      const validationErrors = errors.map(error => ({
        property: error.property,
        constraints: error.constraints,
      }));
      return new UnprocessableEntityException(validationErrors);
    },
  }));

  app.useGlobalFilters(new PrismaTransactionExceptionFilter());

  await app.listen(3000);
}
bootstrap();
