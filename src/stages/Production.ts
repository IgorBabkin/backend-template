import { args, IContainer, IContainerModule, Registration } from 'ts-ioc-container';
import { IEnv } from '../env/IEnv';
import { PrismaTransactionContext } from '../lib/prisma/PrismaTransactionContext';
import { createWinstonLogger, WinstonLogger } from '../domains/logger/WinstonLogger';
import { PrismaClient } from '@prisma/client';
import { ProdErrorHandleStrategy } from '../useCase/errorHandler/ProdErrorHandleStrategy';

export class Production implements IContainerModule {
  private logger = createWinstonLogger({
    level: this.env.logLevel,
  });

  private prismaClient = new PrismaClient();

  constructor(private env: IEnv) {}

  applyTo(container: IContainer): void {
    container
      .use(Registration.fromClass(PrismaTransactionContext).pipe(args(this.prismaClient)))
      .use(Registration.fromClass(WinstonLogger).pipe(args(this.logger)))
      .use(Registration.fromClass(ProdErrorHandleStrategy));
  }
}
