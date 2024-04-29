import { args, IContainer, IContainerModule, Registration as R } from 'ts-ioc-container';
import { IEnv } from '../env/IEnv';
import { PrismaTransactionContext } from '../lib/prisma/PrismaTransactionContext';
import { PrismaClient } from '@prisma/client';
import { WinstonLogger } from '../domains/logger/WinstonLogger';
import { createLogger, format, transports } from 'winston';
import { DevErrorHandleStrategy } from '../lib/express/errorHandler/DevErrorHandleStrategy';

export class Development implements IContainerModule {
  private logger = createLogger({
    level: this.env.logLevel,
    format: format.combine(format.timestamp(), format.json()),
    transports: [new transports.Console()],
  });

  private prismaClient = new PrismaClient({ log: ['query'] });

  constructor(private env: IEnv) {}

  applyTo(container: IContainer): void {
    container
      .add(R.fromClass(PrismaTransactionContext).pipe(args(this.prismaClient)))
      .add(R.fromClass(WinstonLogger).pipe(args(this.logger)))
      .add(R.fromClass(DevErrorHandleStrategy));
  }
}
