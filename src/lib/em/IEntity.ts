import { IRepository } from './IRepository';
import { omitUndefined } from '../utils';

export type ID = string;

export interface IEntity {
  id: ID;
}

export class Entity<State extends IEntity = IEntity> {
  isDeleted = false;
  private hasChanged = false;
  private changes: Partial<State> = {};

  constructor(private value: State) {}

  get id() {
    return this.value.id;
  }

  getState() {
    return { ...this.value, ...this.changes };
  }

  async persist(repo: IRepository<State, unknown>): Promise<void> {
    if (this.isDeleted) {
      await repo.delete(this.value.id);
      return;
    }
    if (this.hasChanged) {
      this.value = await repo.update(this.value.id, this.changes);
      this.hasChanged = false;
    }
  }

  map(fn: (state: State) => Partial<State>): void {
    this.hasChanged = true;
    this.changes = { ...this.changes, ...omitUndefined(fn(this.value)) };
  }

  delete() {
    this.isDeleted = true;
  }
}

export class Value<State, E extends IEntity> {
  entity?: Entity<E>;

  constructor(private value: State) {}

  getEntity() {
    if (this.entity === undefined) {
      throw new Error('Entity not persisted');
    }
    return this.entity;
  }

  getResult() {
    return this.getEntity().getState();
  }

  async persist(repo: IRepository<E, State>): Promise<Entity<E>> {
    this.entity = new Entity(await repo.create(this.value));
    return this.entity;
  }
}
