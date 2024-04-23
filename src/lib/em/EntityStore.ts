import { Entity, ID, IEntity, Value } from './IEntity';

export class EntityStore<E extends IEntity, V> {
  entities = new Map<ID, Entity<E>>();
  values = new Set<Value<V, E>>();

  getEntity(id: ID) {
    return this.entities.get(id);
  }

  addEntity(entity: Entity<E>) {
    this.entities.set(entity.id, entity);
  }

  addValue(value: Value<V, E>) {
    this.values.add(value);
  }

  removeEntity(entity: IEntity) {
    this.entities.delete(entity.id);
  }

  removeValue(value: Value<V, E>) {
    this.values.delete(value);
  }

  getEntities() {
    return this.entities.values();
  }

  getValues() {
    return this.values.values();
  }
}
