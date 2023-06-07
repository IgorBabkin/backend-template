import { forKey } from '@ibabkin/ts-ioc-container';
import { IPayment, IPaymentValue } from './IPayment';
import { IPaymentRepo, IPaymentRepoKey } from './IPaymentRepo';
import { handlePrismaError } from '../errors/prismaErrors';
import { inject } from '@ibabkin/ts-constructor-injector';
import { PrismaClient } from '@prisma/client';
import { prismaClient } from '../../lib/prisma/PrismaTransactionContext';

@forKey(IPaymentRepoKey)
export class PaymentRepo implements IPaymentRepo {
  constructor(@inject(prismaClient) private dbClient: PrismaClient) {}
  @handlePrismaError
  async create(value: IPaymentValue): Promise<IPayment> {
    return Promise.resolve(undefined);
  }
}
