import { PrismaClient } from '@prisma/client';
import { Fn } from '@ibabkin/ts-constructor-injector';
import { forKey, Resolvable } from '@ibabkin/ts-ioc-container';
import { ITransactionContext, ITransactionContextKey } from '@ibabkin/ts-request-mediator';
import { perApplication } from '../container/di';

@perApplication
@forKey(ITransactionContextKey)
export class PrismaTransactionContext implements ITransactionContext {
  constructor(public dbClient: PrismaClient = new PrismaClient()) {}

  execute<Response>(setContext: (context: ITransactionContext) => Promise<Response>): Promise<Response> {
    return this.dbClient.$transaction((transactionClient) =>
      setContext(new PrismaTransactionContext(transactionClient as PrismaClient)),
    );
  }
}

export const prismaClient: Fn<Resolvable, PrismaClient> = (l) =>
  l.resolve<PrismaTransactionContext>(ITransactionContextKey).dbClient;
