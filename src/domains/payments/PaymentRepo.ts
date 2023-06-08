import { forKey } from '@ibabkin/ts-ioc-container';
import { IPayment, IPaymentValue } from './IPayment';
import { IPaymentRepo, IPaymentRepoKey } from './IPaymentRepo';
import { handlePrismaError } from '../errors/prismaErrors';
import { inject } from '@ibabkin/ts-constructor-injector';
import { Payment, PrismaClient } from '@prisma/client';
import { prismaClient } from '../../lib/prisma/PrismaTransactionContext';
import { MethodNotImplementedError } from '../errors/MethodNotImplementedError';

@forKey(IPaymentRepoKey)
export class PaymentRepo implements IPaymentRepo {
  private static toDomain(record: Payment): IPayment {
    return { id: record.id.toString() };
  }

  constructor(@inject(prismaClient) private dbClient: PrismaClient) {}

  @handlePrismaError
  async create(value: IPaymentValue): Promise<IPayment> {
    throw new MethodNotImplementedError();
  }

  @handlePrismaError
  async findByIdOrFail(paymentId: string): Promise<IPayment> {
    const record = await this.dbClient.payment.findUniqueOrThrow({ where: { id: +paymentId } });
    return PaymentRepo.toDomain(record);
  }
}
