import { ITodo, ITodoValue } from './ITodo';

export interface ITodoRepo {
  findByIdOrFail(id: string): Promise<ITodo>;

  create(value: ITodoValue): Promise<ITodo>;
}

export const ITodoRepoKey = Symbol('ITodoRepo');
