import { ITodo } from '../../domains/todo/ITodo';

export class Todo {
  getId(): string {
  }

  constructor(private readonly data: ITodo) {
  }

  commit(data: Partial<ITodo>): void {
  }

  getPatch(): Partial<ITodo> {
    throw new Error('Method not implemented.');
  }
}
