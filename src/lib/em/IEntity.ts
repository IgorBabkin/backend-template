import { IRepository } from './IRepository';

export type ID = string;

export interface IEntity {
  id: ID;
}

export class Entity<State extends IEntity> {
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

  async persist(repo: IRepository<State>): Promise<void> {
    if (this.isDeleted) {
      await repo.delete(this.value.id);
      return;
    }
    if (this.hasChanged) {
      this.value = await repo.update(this.changes);
      this.hasChanged = false;
    }
  }

  update(state: Partial<State>): void {
    this.hasChanged = true;
    this.changes = { ...this.changes, ...state };
  }

  delete() {
    this.isDeleted = true;
  }
}

export class Value<State, E extends IEntity> {
  entity?: Entity<E>;

  getEntity() {
    if (this.entity === undefined) {
      throw new Error('Entity not persisted');
    }
    return this.entity;
  }

  getResult() {
    return this.getEntity().getState();
  }

  async persist(repo: IRepository<E, State>) {
    this.entity = new Entity(await repo.create(this.value));
  }

  constructor(private value: State) {}
}
