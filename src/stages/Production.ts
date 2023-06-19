import { IContainer, IContainerModule, Registration, withArgs } from 'ts-ioc-container';
import { IEnv } from '../env/IEnv';
import { PrismaTransactionContext } from '../lib/prisma/PrismaTransactionContext';
import { createWinstonLogger, WinstonLogger } from '../domains/logger/WinstonLogger';
import { ProdResponse } from '../domains/response/ProdResponse';

export class Production implements IContainerModule {
  constructor(private env: IEnv) {}

  applyTo(container: IContainer): void {
    container
      .add(Registration.fromClass(WinstonLogger).pipe(withArgs(createWinstonLogger({ level: this.env.logLevel }))))
      .add(Registration.fromClass(PrismaTransactionContext))
      .add(Registration.fromClass(ProdResponse));
  }
}
