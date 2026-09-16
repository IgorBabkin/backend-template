import { PrismaClient, Todo } from '@prisma/client';
import { ITodo, ITodoValue } from './ITodo';
import { prismaClient } from '../../lib/prisma/PrismaTransactionContext';
import { bindTo, inject, register, scope, singleton, SingleToken } from 'ts-ioc-container';
import { IRepository } from '../../lib/em/IRepository';
import { perScope } from '../../lib/components/Scope';
import { repository } from '../../lib/components/Repository';
import { ID } from '../../lib/em/Entity';

export interface ITodoRepo extends IRepository<ITodo, ITodoValue> {
  findAll(): Promise<ITodo[]>;
}

export const ITodoRepoKey = new SingleToken<ITodoRepo>('ITodoRepo');

@register(bindTo(ITodoRepoKey), scope(perScope.Request), repository, singleton())
export class TodoRepo implements ITodoRepo {
  static toDomain(record: Todo): ITodo {
    return {
      id: record.id.toString() as ID,
      title: record.title,
      description: record.description,
    };
  }

  constructor(@inject(prismaClient) private dbClient: () => PrismaClient) {}

  async findByIdOrFail(id: string): Promise<ITodo> {
    const record = await this.dbClient().todo.findUniqueOrThrow({ where: { id: +id } });
    return TodoRepo.toDomain(record);
  }

  async create(value: ITodoValue): Promise<ITodo> {
    const record = await this.dbClient().todo.create({
      data: {
        title: value.title,
        description: value.description,
      },
    });
    return TodoRepo.toDomain(record);
  }

  async delete(id: string): Promise<void> {
    await this.dbClient().todo.delete({ where: { id: +id } });
  }

  async update(id: string, entity: Partial<ITodoValue>): Promise<ITodo> {
    const updated = await this.dbClient().todo.update({
      where: { id: +id },
      data: {
        title: entity.title,
        description: entity.description,
      },
    });
    return TodoRepo.toDomain(updated);
  }

  async findAll(): Promise<ITodo[]> {
    const records = await this.dbClient().todo.findMany();
    return records.map(TodoRepo.toDomain);
  }
}
