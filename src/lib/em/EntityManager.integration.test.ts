import { EntityManager } from './EntityManager';
import { Entity, ID } from './Entity';
import { IRepository } from './IRepository';

type State = { id: ID; title: string };

const state = (id: string, title = `todo-${id}`): State => ({ id: id as ID, title });

const repository = (items: State[]): jest.Mocked<IRepository<State, Omit<State, 'id'>>> => ({
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findByIdOrFail: jest.fn(async (id) => items.find((item) => item.id === id) as State),
});

describe('EntityManager', () => {
  it('loads and caches entities', async () => {
    const repo = repository([state('1')]);
    const manager = new EntityManager(repo);

    const first = await manager.findByIdOrFail('1' as ID);
    const second = await manager.findByIdOrFail('1' as ID);

    expect(first).toBe(second);
    expect(repo.findByIdOrFail).toHaveBeenCalledTimes(1);
  });

  it('tracks many entities and persists changes', async () => {
    const repo = repository([state('1'), state('2')]);
    const manager = new EntityManager(repo);
    const entities = await manager.trackMany(() => Promise.resolve([state('1'), state('2')]));
    entities[0].patch(() => ({ title: 'updated' }));
    repo.update.mockResolvedValue(state('1', 'updated'));

    await manager.persistAll();

    expect(repo.update).toHaveBeenCalledWith('1', { title: 'updated' });
  });

  it('removes deleted entities after persistence', async () => {
    const repo = repository([state('1')]);
    const manager = new EntityManager(repo);
    const entity = await manager.findByIdOrFail('1' as ID);
    entity.markAsDeleted();

    await manager.persistAll();

    expect(repo.delete).toHaveBeenCalledWith('1');
    expect(await manager.findByIdOrFail('1' as ID)).toBeInstanceOf(Entity);
  });
});
