import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock prisma client (hoisted mocks require string literal paths)
vi.mock('../../../../prisma/prismaClient.js', () => ({
  default: {
    feedbacks: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import prisma from '../../../../prisma/prismaClient.js';
import * as repo from '../../../../src/modules/feedback/repository.js';

describe('feedback repository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('create calls prisma.feedbacks.create with { data }', async () => {
    prisma.feedbacks.create.mockResolvedValue({ id: '1', title: 't' });
    const payload = { title: 't' };
    const res = await repo.create(payload);
    expect(prisma.feedbacks.create).toHaveBeenCalledWith({ data: payload });
    expect(res).toEqual({ id: '1', title: 't' });
  });

  it('findAll calls prisma.feedbacks.findMany', async () => {
    prisma.feedbacks.findMany.mockResolvedValue([{ id: '1' }]);
    const res = await repo.findAll();
    expect(prisma.feedbacks.findMany).toHaveBeenCalled();
    expect(res).toEqual([{ id: '1' }]);
  });

  it('findById calls prisma.feedbacks.findUnique with where id', async () => {
    prisma.feedbacks.findUnique.mockResolvedValue({ id: '1' });
    const res = await repo.findById('1');
    expect(prisma.feedbacks.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
    expect(res).toEqual({ id: '1' });
  });

  it('update calls prisma.feedbacks.update with where and data', async () => {
    prisma.feedbacks.update.mockResolvedValue({ id: '1', title: 'u' });
    const res = await repo.update('1', { title: 'u' });
    expect(prisma.feedbacks.update).toHaveBeenCalledWith({ where: { id: '1' }, data: { title: 'u' } });
    expect(res).toEqual({ id: '1', title: 'u' });
  });

  it('remove calls prisma.feedbacks.delete with where id', async () => {
    prisma.feedbacks.delete.mockResolvedValue({ id: '1' });
    const res = await repo.remove('1');
    expect(prisma.feedbacks.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    expect(res).toEqual({ id: '1' });
  });
});
