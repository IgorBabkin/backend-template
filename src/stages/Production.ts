import { IContainer, IContainerModule, Registration } from '@ibabkin/ts-ioc-container';
import { IEnv } from '../env/IEnv';
import { ProdErrorContext } from '../errors/context/ProdErrorContext';
import { PrismaTransactionContext } from '../lib/prisma/PrismaTransactionContext';

export class Production implements IContainerModule {
  constructor(env: IEnv) {}

  applyTo(container: IContainer): void {
    container.add(Registration.fromClass(PrismaTransactionContext)).add(Registration.fromClass(ProdErrorContext));
  }
}
