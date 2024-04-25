import { entityManager, EntityManager } from '../../lib/em/EntityManager';
import { ITodo } from '../../domains/todo/ITodo';
import { IQueryHandler } from '../../lib/mediator/IQueryHandler';
import { inject } from 'ts-ioc-container';
import { ITodoRepo, ITodoRepoKey } from '../../domains/todo/TodoRepo';
import { IAppQuery } from '../middleware/IAppQuery';

interface Query {
  title: string;
  description: string;
}

export interface IAddTodo extends IQueryHandler<Query, () => ITodo> {}

export class AddTodo implements IAddTodo {
  constructor(@inject(entityManager(ITodoRepoKey)) private em: EntityManager<ITodoRepo>) {}

  async handle(query: IAppQuery<Query>): Promise<() => ITodo> {
    const todo = this.em.create({ title: query.title, description: query.description });
    return () => todo.getResult();
  }
}
