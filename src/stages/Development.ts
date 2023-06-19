import { IContainer, IContainerModule, Registration, withArgs } from 'ts-ioc-container';
import { IEnv } from '../env/IEnv';
import { PrismaTransactionContext } from '../lib/prisma/PrismaTransactionContext';
import { PrismaClient } from '@prisma/client';
import { createWinstonLogger, WinstonLogger } from '../domains/logger/WinstonLogger';
import { format } from 'winston';
import { DevResponse } from '../domains/response/DevResponse';

export class Development implements IContainerModule {
  constructor(private env: IEnv) {}

  applyTo(container: IContainer): void {
    container
      .add(
        Registration.fromClass(PrismaTransactionContext).pipe(
          withArgs(
            new PrismaClient({
              log: ['info'],
            }),
          ),
        ),
      )
      .add(
        Registration.fromClass(WinstonLogger).pipe(
          withArgs(
            createWinstonLogger({
              level: this.env.logLevel,
              format: format.combine(format.timestamp(), format.json()),
            }),
          ),
        ),
      )
      .add(Registration.fromClass(DevResponse));
  }
}
