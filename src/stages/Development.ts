import { IContainer, IContainerModule, Registration, withArgs } from '@ibabkin/ts-ioc-container';
import { IEnv } from '../env/IEnv';
import { DevErrorContext } from '../errors/context/DevErrorContext';
import { PrismaTransactionContext } from '../lib/prisma/PrismaTransactionContext';
import { PrismaClient } from '@prisma/client';

export class Development implements IContainerModule {
  constructor(env: IEnv) {}

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
      .add(Registration.fromClass(DevErrorContext));
  }
}
