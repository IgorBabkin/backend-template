import { PrismaClient } from '@prisma/client';
import { IContainer, key } from 'ts-ioc-container';
import { ITransactionContext, ITransactionContextKey } from 'ts-request-mediator';
import { perApplication } from '../container/di';
import { onDispose } from '../../useCase/DisposeInstances';

@perApplication
@key(ITransactionContextKey)
export class PrismaTransactionContext implements ITransactionContext {
  constructor(public dbClient: PrismaClient = new PrismaClient()) {}

  execute<Response>(setContext: (context: ITransactionContext) => Promise<Response>): Promise<Response> {
    return this.dbClient.$transaction((transactionClient) =>
      setContext(new PrismaTransactionContext(transactionClient as any)),
    );
  }

  @onDispose
  disconnect(): Promise<void> {
    return this.dbClient.$disconnect();
  }
}

export const prismaClient = (l: IContainer) => l.resolve<PrismaTransactionContext>(ITransactionContextKey).dbClient;
