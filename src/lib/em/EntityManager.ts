import { Entity, ID, IEntity, Value } from './Entity';
import { IRepository } from './IRepository';
import {
  appendArgsFn,
  bindTo,
  DependencyKey,
  IContainer,
  inject,
  arg,
  register,
  scope,
  singleton,
  SingleToken,
} from 'ts-ioc-container';
import { perScope } from '../components/Scope';

export const IEntityKey = new SingleToken('IEntity');

export const entityManager = (repoKey: SingleToken) => (s: IContainer) =>
  s.resolve(IEntityKey.token, { args: [repoKey.token] });

type GetValueFromRepo<IRepo> = IRepo extends IRepository<any, infer V> ? V : never;
type GetEntityFromRepo<IRepo> = IRepo extends IRepository<infer E, any> ? E : never;

@register(
  bindTo(IEntityKey.token),
  scope(perScope.Request),
  appendArgsFn((s, options) => [s.resolve((options?.args ?? [])[0] as DependencyKey)]),
  singleton((...args) => args[0] as string | symbol),
)
export class EntityManager<TRepo extends IRepository = IRepository> {
  private entities: Map<ID, Entity<GetEntityFromRepo<TRepo>>> = new Map();

  constructor(
    @inject(arg(1)) private repo: TRepo,
    private readonly createEntity: <V extends GetEntityFromRepo<TRepo>>(state: V) => Entity<V> = (state) =>
      new Entity(state),
  ) {}

  async findByIdOrFail(id: ID): Promise<Entity<GetEntityFromRepo<TRepo>>> {
    if (!this.entities.has(id)) {
      return this.trackOne((r) => r.findByIdOrFail(id) as Promise<GetEntityFromRepo<TRepo>>);
    }
    return this.entities.get(id) as Entity<GetEntityFromRepo<TRepo>>;
  }

  create(newValue: GetValueFromRepo<TRepo>): Value<GetValueFromRepo<TRepo>, GetEntityFromRepo<TRepo>> {
    return new Value<GetValueFromRepo<TRepo>, GetEntityFromRepo<TRepo>>(newValue);
  }

  async persistAll() {
    for (const entity of this.entities.values()) {
      await this.persistEntity(entity);
    }
  }

  persist(
    value: Value<GetValueFromRepo<TRepo>, GetEntityFromRepo<TRepo>> | Entity<GetEntityFromRepo<TRepo>>,
  ): Promise<Entity<GetEntityFromRepo<TRepo>>> {
    return (value instanceof Value ? this.persistValue(value) : this.persistEntity(value)) as Promise<
      Entity<GetEntityFromRepo<TRepo>>
    >;
  }

  async trackOne(fn: (r: TRepo) => Promise<GetEntityFromRepo<TRepo>>): Promise<Entity<GetEntityFromRepo<TRepo>>> {
    const entity = await fn(this.repo);
    return this.trackEntity(this.createEntity(entity));
  }

  async trackMany(fn: (r: TRepo) => Promise<GetEntityFromRepo<TRepo>[]>): Promise<Entity<GetEntityFromRepo<TRepo>>[]> {
    const entitiesStates = await fn(this.repo);
    const result: Entity<GetEntityFromRepo<TRepo>>[] = [];
    for (const state of entitiesStates) {
      result.push(this.trackEntity(this.createEntity(state)));
    }
    return result;
  }

  private trackEntity<V extends Entity<GetEntityFromRepo<TRepo>>>(entity: V): V {
    this.entities.set(entity.id, entity);
    return entity;
  }

  private untrackEntity(entity: Entity): Entity | undefined {
    this.entities.delete(entity.id);
    return entity;
  }

  private async persistEntity(entity: Entity): Promise<Entity> {
    await entity.persist(this.repo);
    if (entity.isDeleted) {
      return this.untrackEntity(entity) as Entity;
    }
    return entity;
  }

  private async persistValue(value: Value<unknown, IEntity>): Promise<Entity> {
    return this.trackEntity((await value.persist(this.repo)) as Entity<GetEntityFromRepo<TRepo>>);
  }
}

export const isEntityManager = (value: unknown): value is EntityManager<IRepository<IEntity, unknown>> => {
  return value instanceof EntityManager;
};
