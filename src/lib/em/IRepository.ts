import { ID, IEntity } from './IEntity';

export interface IRepository<Entity extends IEntity = IEntity, Value = unknown> {
  delete(id: ID): Promise<void>;

  create(value: Value): Promise<Entity>;

  update(id: string, value: Partial<Value>): Promise<Entity>;

  findByIdOrFail(id: string): Promise<Entity>;
}
