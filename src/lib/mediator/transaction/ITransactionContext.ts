import { getProp, prop } from '../../metadata';
import { constructor } from 'ts-ioc-container';
import { accessor } from '../../container/di';
import { PrismaClient } from '@prisma/client';

export interface ITransactionContext {
  dbClient: PrismaClient;
  execute: <Response>(fn: (context: ITransactionContext) => Promise<Response>) => Promise<Response>;
}

export const ITransactionContextKey = accessor<ITransactionContext>(Symbol('ITransactionContext'));

export const transaction: ClassDecorator = prop('transaction', true);

export function isTransaction(TargetAction: constructor<unknown>): boolean {
  return getProp<boolean>(TargetAction, 'transaction') || false;
}
