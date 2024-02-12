import { PrismaClient } from '@prisma/client';
import { key, Resolvable } from 'ts-ioc-container';
import { ITransactionContext, ITransactionContextKey } from 'ts-request-mediator';
import { onDispose, perApplication } from '../container/di';

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

export const prismaClient = (l: Resolvable) => l.resolve<PrismaTransactionContext>(ITransactionContextKey).dbClient;
