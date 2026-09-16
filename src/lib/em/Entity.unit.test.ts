import { Entity, ID, Value } from './Entity';
import { IRepository } from './IRepository';

type State = { id: ID; title: string; description: string };

const state = { id: '1' as ID, title: 'old', description: 'description' };

const repository = (): jest.Mocked<IRepository<State, Omit<State, 'id'>>> => ({
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findByIdOrFail: jest.fn(),
});

describe('Entity', () => {
  it('returns state and applies defined patches', () => {
    const entity = new Entity(state);

    entity.patch((current) => ({ title: `${current.title} updated`, description: undefined }));

    expect(entity.getState()).toEqual({ ...state, title: 'old updated' });
  });

  it('updates changed entities', async () => {
    const repo = repository();
    const updated = { ...state, title: 'updated' };
    repo.update.mockResolvedValue(updated);
    const entity = new Entity(state);
    entity.patch(() => ({ title: 'updated' }));

    await entity.persist(repo);

    expect(repo.update).toHaveBeenCalledWith(state.id, { title: 'updated' });
    expect(entity.getState()).toEqual(updated);
  });

  it('deletes marked entities', async () => {
    const repo = repository();
    const entity = new Entity(state);
    entity.markAsDeleted();

    await entity.persist(repo);

    expect(repo.delete).toHaveBeenCalledWith(state.id);
  });

  it('persists values and exposes the created result', async () => {
    const repo = repository();
    repo.create.mockResolvedValue(state);
    const value = new Value({ title: state.title, description: state.description });

    await value.persist(repo);

    expect(repo.create).toHaveBeenCalledWith({ title: state.title, description: state.description });
    expect(value.getResult()).toEqual(state);
  });

  it('rejects reading an unpersisted value', () => {
    expect(() => new Value({ title: 'title', description: 'description' }).getEntity()).toThrow('Entity not persisted');
  });
});
