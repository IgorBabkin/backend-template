import { getProp, prop } from '../../metadata';
import { constructor, SingleToken } from 'ts-ioc-container';
import { PrismaClient } from '@prisma/client';

export interface ITransactionContext {
  dbClient: PrismaClient;
  execute: <Response>(fn: (context: ITransactionContext) => Promise<Response>) => Promise<Response>;
}

export const ITransactionContextKey = new SingleToken<ITransactionContext>('ITransactionContext');

export const transaction: ClassDecorator = prop('transaction', true);

export function isTransaction(TargetAction: constructor<unknown>): boolean {
  return getProp<boolean>(TargetAction, 'transaction') || false;
}
