import { entityManager, EntityManager } from '../../lib/em/EntityManager';
import { ITodo, ITodoValue } from '../../domains/todo/ITodo';
import { IQueryHandler } from '../../lib/mediator/IQueryHandler';
import { inject } from 'ts-ioc-container';
import { ITodoRepoKey } from '../../domains/todo/TodoRepo';

interface Query {
  title: string;
  description: string;
}

export interface IAddTodo extends IQueryHandler<Query, () => ITodo> {}

export class AddTodo implements IAddTodo {
  constructor(@inject(entityManager(ITodoRepoKey)) private em: EntityManager<ITodo, ITodoValue>) {}

  async handle(query: Query): Promise<() => ITodo> {
    const todo = this.em.create({ title: query.title, description: query.description });
    return () => todo.getResult();
  }
}
