import { PrismaClient, Todo } from '@prisma/client';
import { ITodo, ITodoValue } from './ITodo';
import { prismaClient } from '../../lib/prisma/PrismaTransactionContext';
import { handlePrismaError } from '../../lib/prisma/handlePrismaError';
import { ITodoRepo, ITodoRepoKey } from './ITodoRepo';
import { inject, key } from 'ts-ioc-container';
import { asSingleton } from '../../lib/container/di';

@asSingleton
@key(ITodoRepoKey)
export class TodoRepo implements ITodoRepo {
  static toDomain(record: Todo): ITodo {
    return {
      id: record.id.toString(),
      title: record.title,
      description: record.description,
    };
  }

  static toPersistence(value: ITodoValue) {
    return {
      title: value.title,
      description: value.description,
    };
  }

  constructor(@inject(prismaClient) private dbClient: PrismaClient) {}

  @handlePrismaError
  async findByIdOrFail(id: string): Promise<ITodo> {
    const record = await this.dbClient.todo.findUniqueOrThrow({ where: { id: +id } });
    return TodoRepo.toDomain(record);
  }

  @handlePrismaError
  async create(value: ITodoValue): Promise<ITodo> {
    const record = await this.dbClient.todo.create({ data: TodoRepo.toPersistence(value) });
    return TodoRepo.toDomain(record);
  }
}
