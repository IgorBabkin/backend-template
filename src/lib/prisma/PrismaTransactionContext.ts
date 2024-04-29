import { PrismaClient } from '@prisma/client';
import { IContainer, provider, register, scope, singleton } from 'ts-ioc-container';
import { ITransactionContext, ITransactionContextKey } from '../mediator/transaction/ITransactionContext';
import { perScope } from '../components/Scope';
import { onDispose } from '../../useCase/middleware/DisposeInstances';

@register(ITransactionContextKey.register, scope(perScope.Application))
@provider(singleton())
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

export const prismaClient = (l: IContainer) => () => ITransactionContextKey.resolve(l).dbClient;
