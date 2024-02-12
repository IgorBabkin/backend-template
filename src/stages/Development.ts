import { args, IContainer, IContainerModule, Registration } from 'ts-ioc-container';
import { IEnv } from '../env/IEnv';
import { PrismaTransactionContext } from '../lib/prisma/PrismaTransactionContext';
import { PrismaClient } from '@prisma/client';
import { createWinstonLogger, WinstonLogger } from '../domains/logger/WinstonLogger';
import { format } from 'winston';
import { DevErrorHandleStrategy } from '../useCase/errorHandler/DevErrorHandleStrategy';

export class Development implements IContainerModule {
  private logger = createWinstonLogger({
    level: this.env.logLevel,
    format: format.combine(format.timestamp(), format.json()),
  });

  private prismaClient = new PrismaClient({ log: ['info'] });

  constructor(private env: IEnv) {}

  applyTo(container: IContainer): void {
    container
      .use(Registration.fromClass(PrismaTransactionContext).pipe(args(this.prismaClient)))
      .use(Registration.fromClass(WinstonLogger).pipe(args(this.logger)))
      .use(Registration.fromClass(DevErrorHandleStrategy));
  }
}
