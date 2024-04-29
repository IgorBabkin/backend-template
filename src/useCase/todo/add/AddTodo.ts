import { ITodo } from '../../../domains/todo/ITodo';
import { IQueryHandler } from '../../../lib/mediator/IQueryHandler';
import { by, IContainer, inject } from 'ts-ioc-container';
import { ITodoRepo, ITodoRepoKey } from '../../../domains/todo/TodoRepo';
import { IAppQuery, IAuthQuery, WithAuthUser } from '../../IAppQuery';
import { EntityManager, entityManager } from '../../../lib/em/EntityManager';
import { AdminHandler } from '../../AdminHandler';

interface Query extends IAuthQuery {
  title: string;
  description: string;
}

export interface IAddTodo extends IQueryHandler<Query, () => ITodo> {}

export class AddTodo extends AdminHandler<Query, () => ITodo> implements IAddTodo {
  constructor(
    @inject(entityManager(ITodoRepoKey)) private em: EntityManager<ITodoRepo>,
    @inject(by.scope.current) scope: IContainer,
  ) {
    super(scope);
  }

  async process(query: WithAuthUser<IAppQuery<Query>>): Promise<() => ITodo> {
    const todo = this.em.create({ title: query.title, description: query.description });
    return () => todo.getResult();
  }
}
