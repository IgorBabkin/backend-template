import { ITodo } from '../../domains/todo/ITodo';
import { IQueryHandler } from '../../lib/mediator/IQueryHandler';
import { by, inject } from 'ts-ioc-container';
import { ITodoRepo, ITodoRepoKey } from '../../domains/todo/TodoRepo';
import { IAppQuery } from '../middleware/IAppQuery';
import { IGenerateSubTodos, IGenerateSubTodosKey } from './GenerateSubTodos';
import { transaction } from '../../lib/mediator/transaction/ITransactionContext';

interface Query {
  title: string;
  description: string;
}

export interface IAddTodo extends IQueryHandler<Query, ITodo> {}

@transaction
export class AddTodo implements IAddTodo {
  constructor(
    @inject(by.key(ITodoRepoKey)) private todoRepo: ITodoRepo,
    @inject(IGenerateSubTodosKey.resolve) private generateSubTodos: IGenerateSubTodos,
  ) {}

  async handle(query: IAppQuery<Query>): Promise<ITodo> {
    const todo = await this.todoRepo.create({ title: query.title, description: query.description });
    await this.generateSubTodos.handle({});
    return todo;
  }
}
