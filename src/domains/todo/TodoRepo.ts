import { PrismaClient, Todo } from '@prisma/client';
import { ITodo, ITodoValue } from './ITodo';
import { prismaClient } from '../../lib/prisma/PrismaTransactionContext';
import { handlePrismaError } from '../../lib/prisma/handlePrismaError';
import { inject, key, provider, register, scope, singleton } from 'ts-ioc-container';
import { IRepository } from '../../lib/em/IRepository';
import { perScope } from '../../lib/mediator/Scope';

export interface ITodoRepo extends IRepository<ITodo, ITodoValue> {}

export const ITodoRepoKey = Symbol('ITodoRepo');

@register(key(ITodoRepoKey), scope(perScope.Request))
@provider(singleton())
export class TodoRepo implements ITodoRepo {
  static toDomain(record: Todo): ITodo {
    return {
      id: record.id.toString(),
      title: record.title,
      description: record.description,
    };
  }

  constructor(@inject(prismaClient) private dbClient: () => PrismaClient) {}

  @handlePrismaError
  async findByIdOrFail(id: string): Promise<ITodo> {
    const record = await this.dbClient().todo.findUniqueOrThrow({ where: { id: +id } });
    return TodoRepo.toDomain(record);
  }

  @handlePrismaError
  async create(value: ITodoValue): Promise<ITodo> {
    const record = await this.dbClient().todo.create({
      data: {
        title: value.title,
        description: value.description,
      },
    });
    return TodoRepo.toDomain(record);
  }

  @handlePrismaError
  async delete(id: string): Promise<void> {
    await this.dbClient().todo.delete({ where: { id: +id } });
  }

  @handlePrismaError
  async update(entity: ITodo): Promise<ITodo> {
    const updated = await this.dbClient().todo.update({
      where: { id: +entity.id },
      data: {
        title: entity.title,
        description: entity.description,
      },
    });
    return TodoRepo.toDomain(updated);
  }
}
