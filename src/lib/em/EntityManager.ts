import { Entity, ID, IEntity, Value } from './IEntity';
import { IRepository } from './IRepository';
import { EntityStore } from './EntityStore';
import {
  argsFn,
  DependencyKey,
  IContainer,
  key,
  MultiCache,
  provider,
  register,
  scope,
  singleton,
} from 'ts-ioc-container';
import { Scope } from '../mediator/Scope';

export const IEntityKey = Symbol('IEntity');

const injectRepo = argsFn((s, ...args) => [s.resolve(args[0] as DependencyKey)]);
const singletonByRepo = singleton(() => new MultiCache((...args) => args[0] as DependencyKey));
export const entityManager = (repoKey: DependencyKey) => (s: IContainer) => s.resolve(IEntityKey, { args: [repoKey] });

@register(key(IEntityKey), scope((s) => s.hasTag(Scope.Request)))
@provider(injectRepo, singletonByRepo)
export class EntityManager<E extends IEntity = IEntity, V = unknown> {
  private entityStore: EntityStore<E, V> = new EntityStore();

  constructor(private repo: IRepository<E>) {}

  async findByIdOrFail(id: ID) {
    return this.entityStore.getEntity(id) ?? this.trackEntity(new Entity(await this.repo.findByIdOrFail(id)));
  }

  create(newValue: V): Value<V, E> {
    const value = new Value<V, E>(newValue);
    this.entityStore.addValue(value);
    return value;
  }

  async persistAll() {
    for (const entity of this.entityStore.getEntities()) {
      await this.persistEntity(entity);
    }

    for (const value of this.entityStore.getValues()) {
      await this.persistValue(value);
    }
  }

  async persist(value: Value<V, E> | Entity<E>): Promise<Entity<E>> {
    if (value instanceof Value) {
      return await this.persistValue(value);
    }

    return await this.persistEntity(value);
  }

  async track(fn: (r: IRepository<E>) => Promise<E>): Promise<Entity<E>> {
    return this.trackEntity(new Entity(await fn(this.repo)));
  }

  private trackEntity(entity: Entity<E>): Entity<E> {
    this.entityStore.addEntity(entity);
    return entity;
  }

  private async persistEntity(entity: Entity<E>): Promise<Entity<E>> {
    await entity.persist(this.repo);
    if (entity.isDeleted) {
      this.entityStore.removeEntity(entity);
    }
    return entity;
  }

  private async persistValue(value: Value<V, E>): Promise<Entity<E>> {
    await value.persist(this.repo);
    this.trackEntity(value.getEntity());
    this.entityStore.removeValue(value);
    return value.getEntity();
  }
}

export const isEntityManager = (value: unknown): value is EntityManager => {
  return value instanceof EntityManager;
};
