import { TodoRepo } from './TodoRepo';
import { ID } from '../../lib/em/Entity';

const record = { id: 7, title: 'title', description: 'description', createdAt: new Date() };

const prisma = {
  todo: {
    findUniqueOrThrow: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('TodoRepo', () => {
  beforeEach(() => jest.clearAllMocks());

  it('maps Prisma records to domain todos', () => {
    expect(TodoRepo.toDomain(record)).toEqual({ id: '7', title: 'title', description: 'description' });
  });

  it('finds a todo by numeric database id', async () => {
    prisma.todo.findUniqueOrThrow.mockResolvedValue(record);
    const repo = new TodoRepo(() => prisma as never);

    await expect(repo.findByIdOrFail('7')).resolves.toEqual({ id: '7', title: 'title', description: 'description' });
    expect(prisma.todo.findUniqueOrThrow).toHaveBeenCalledWith({ where: { id: 7 } });
  });

  it('creates, updates, deletes, and lists todos through Prisma', async () => {
    prisma.todo.create.mockResolvedValue(record);
    prisma.todo.update.mockResolvedValue({ ...record, title: 'updated' });
    prisma.todo.findMany.mockResolvedValue([record]);
    const repo = new TodoRepo(() => prisma as never);

    await expect(repo.create({ title: 'title', description: 'description' })).resolves.toEqual({
      id: '7' as ID,
      title: 'title',
      description: 'description',
    });
    await expect(repo.update('7', { title: 'updated' })).resolves.toEqual({
      id: '7' as ID,
      title: 'updated',
      description: 'description',
    });
    await expect(repo.findAll()).resolves.toHaveLength(1);
    await expect(repo.delete('7')).resolves.toBeUndefined();

    expect(prisma.todo.create).toHaveBeenCalledWith({ data: { title: 'title', description: 'description' } });
    expect(prisma.todo.update).toHaveBeenCalledWith({
      where: { id: 7 },
      data: { title: 'updated', description: undefined },
    });
    expect(prisma.todo.delete).toHaveBeenCalledWith({ where: { id: 7 } });
  });
});
