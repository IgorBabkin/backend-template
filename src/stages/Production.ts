import { appendArgs, IContainer, IContainerModule, Registration as R } from 'ts-ioc-container';
import { IEnv } from '../env/IEnv';
import { PrismaTransactionContext } from '../lib/prisma/PrismaTransactionContext';
import { WinstonLogger } from '../domains/logger/WinstonLogger';
import { PrismaClient } from '@prisma/client';
import { ProdErrorHandleStrategy } from '../lib/express/errorHandler/ProdErrorHandleStrategy';
import { createLogger, format, transports } from 'winston';

export class Production implements IContainerModule {
  private logger = createLogger({
    level: this.env.logLevel,
    format: format.combine(format.json()),
    transports: [new transports.Console()],
  });

  private prismaClient = new PrismaClient();

  constructor(private env: IEnv) {}

  applyTo(container: IContainer): void {
    container
      .addRegistration(R.fromClass(PrismaTransactionContext).pipe(appendArgs(this.prismaClient)))
      .addRegistration(R.fromClass(WinstonLogger).pipe(appendArgs(this.logger)))
      .addRegistration(R.fromClass(ProdErrorHandleStrategy));
  }
}
