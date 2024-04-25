import { IQueryHandler } from '../../lib/mediator/IQueryHandler';
import { ITodoRepo, ITodoRepoKey } from '../../domains/todo/TodoRepo';
import { by, inject, provider, register, scope } from 'ts-ioc-container';
import { transaction } from '../../lib/mediator/transaction/ITransactionContext';
import { accessor } from '../../lib/container/di';
import { perScope } from '../../lib/mediator/Scope';
import { service } from '../../lib/mediator/ServiceProvider';

export interface IGenerateSubTodos extends IQueryHandler<Query, void> {}

export const IGenerateSubTodosKey = accessor<IGenerateSubTodos>(Symbol('IGenerateSubTodos'));

interface Query {}

@transaction
@provider(service)
@register(IGenerateSubTodosKey.register, scope(perScope.Request))
export class GenerateSubTodos implements IQueryHandler<Query, void> {
  constructor(@inject(by.key(ITodoRepoKey)) private todoRepo: ITodoRepo) {}

  async handle(): Promise<void> {
    for (let i = 0; i < 10; i++) {
      await this.todoRepo.create({ title: `Sub Todo ${i}`, description: 'Sub Todo' });
    }
  }
}
