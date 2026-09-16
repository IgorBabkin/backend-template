import { IRepository } from './IRepository';
import { omitUndefined } from '../utils';
import { Brand } from '../brand';

export type ID = Brand<string, 'ID'>;

export interface IEntity {
  id: ID;
}

interface Persistable<Entity extends IEntity = IEntity> {
  persist(repo: IRepository): Promise<Entity>;
}

export class Entity<State extends IEntity = IEntity> implements Persistable<Entity<State>> {
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

  async persist(repo: IRepository<State>): Promise<Entity<State>> {
    if (this.isDeleted) {
      await repo.delete(this.value.id);
    } else if (this.hasChanged) {
      this.value = await repo.update(this.value.id, this.changes);
    }

    this.hasChanged = false;
    return this;
  }

  patch(fn: (state: State) => Partial<State>): void {
    this.hasChanged = true;
    this.changes = { ...this.changes, ...omitUndefined(fn(this.value)) };
  }

  markAsDeleted() {
    this.isDeleted = true;
  }
}

export class Value<State, E extends IEntity> implements Persistable<Entity<E>> {
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
