import { Entity, ID, IEntity, Value } from './IEntity';
import { IRepository } from './IRepository';
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
import { perScope } from '../components/Scope';

export const IEntityKey = Symbol('IEntity');

const injectRepo = argsFn((s, ...args) => [s.resolve(args[0] as DependencyKey)]);
const singletonByRepo = singleton(() => new MultiCache((...args) => args[0] as DependencyKey));
export const entityManager = (repoKey: DependencyKey) => (s: IContainer) => s.resolve(IEntityKey, { args: [repoKey] });

type RepoValue<IRepo> = IRepo extends IRepository<any, infer V> ? V : never;
type RepoEntity<IRepo> = IRepo extends IRepository<infer E, any> ? E : never;

@register(key(IEntityKey), scope(perScope.Request))
@provider(injectRepo, singletonByRepo)
export class EntityManager<TRepo extends IRepository = IRepository> {
  private entities = new Map<ID, Entity>();
  private values = new Set<Value<unknown, IEntity>>();

  constructor(private repo: TRepo) {}

  async findByIdOrFail(id: ID): Promise<Entity<RepoEntity<TRepo>>> {
    return (this.entities.get(id) ?? this.trackEntity(new Entity(await this.repo.findByIdOrFail(id)))) as Entity<
      RepoEntity<TRepo>
    >;
  }

  create(newValue: RepoValue<TRepo>): Value<RepoValue<TRepo>, RepoEntity<TRepo>> {
    const value = new Value<RepoValue<TRepo>, RepoEntity<TRepo>>(newValue);
    this.values.add(value);
    return value;
  }

  async persistAll() {
    for (const entity of this.entities.values()) {
      await this.persistEntity(entity);
    }

    for (const value of this.values.values()) {
      await this.persistValue(value);
    }
  }

  async persist(
    value: Value<RepoValue<TRepo>, RepoEntity<TRepo>> | Entity<RepoEntity<TRepo>>,
  ): Promise<Entity<RepoEntity<TRepo>>> {
    if (value instanceof Value) {
      return (await this.persistValue(value)) as Entity<RepoEntity<TRepo>>;
    }

    return (await this.persistEntity(value)) as Entity<RepoEntity<TRepo>>;
  }

  async trackOne(fn: (r: TRepo) => Promise<RepoEntity<TRepo>>): Promise<Entity<RepoEntity<TRepo>>> {
    return this.trackEntity(new Entity(await fn(this.repo))) as Entity<RepoEntity<TRepo>>;
  }

  async trackMany(fn: (r: TRepo) => Promise<RepoEntity<TRepo>[]>): Promise<Entity<RepoEntity<TRepo>>[]> {
    const entities = await fn(this.repo);
    return entities.map((entity) => this.trackEntity(new Entity(entity))) as Entity<RepoEntity<TRepo>>[];
  }

  private trackEntity(entity: Entity): Entity {
    this.entities.set(entity.id, entity);
    return entity;
  }

  private async persistEntity(entity: Entity): Promise<Entity> {
    await entity.persist(this.repo);
    if (entity.isDeleted) {
      this.entities.delete(entity.id);
    }
    return entity;
  }

  private async persistValue(value: Value<unknown, IEntity>): Promise<Entity> {
    const entity = this.trackEntity(await value.persist(this.repo));
    this.values.delete(value);
    return entity;
  }
}

export const isEntityManager = (value: unknown): value is EntityManager<IRepository<IEntity, unknown>> => {
  return value instanceof EntityManager;
};
