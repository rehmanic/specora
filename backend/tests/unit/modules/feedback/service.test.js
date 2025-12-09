import { describe, it, expect, vi, beforeEach } from 'vitest';

// vitest (like jest) hoists `vi.mock()` calls, so the module path must be a string literal.
vi.mock('../../../../src/modules/feedback/repository.js', () => ({
  create: vi.fn(),
  findAll: vi.fn(),
  findById: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
}));

import * as service from '../../../../src/modules/feedback/service.js';
import * as repo from '../../../../src/modules/feedback/repository.js';

describe('feedback service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('createFeedback calls repository.create and returns result', async () => {
    repo.create.mockResolvedValue({ id: '1', title: 't' });
    const payload = { title: 't' };
    const res = await service.createFeedback(payload);
    expect(repo.create).toHaveBeenCalledWith(payload);
    expect(res).toEqual({ id: '1', title: 't' });
  });

  it('getAllFeedback calls repository.findAll and returns result', async () => {
    repo.findAll.mockResolvedValue([{ id: '1' }]);
    const res = await service.getAllFeedback();
    expect(repo.findAll).toHaveBeenCalled();
    expect(res).toEqual([{ id: '1' }]);
  });

  it('getFeedbackById calls repository.findById and returns result', async () => {
    repo.findById.mockResolvedValue({ id: '1' });
    const res = await service.getFeedbackById('1');
    expect(repo.findById).toHaveBeenCalledWith('1');
    expect(res).toEqual({ id: '1' });
  });

  it('updateFeedback calls repository.update and returns result', async () => {
    repo.update.mockResolvedValue({ id: '1', title: 'updated' });
    const res = await service.updateFeedback('1', { title: 'updated' });
    expect(repo.update).toHaveBeenCalledWith('1', { title: 'updated' });
    expect(res).toEqual({ id: '1', title: 'updated' });
  });

  it('deleteFeedback calls repository.remove', async () => {
    repo.remove.mockResolvedValue({ id: '1' });
    const res = await service.deleteFeedback('1');
    expect(repo.remove).toHaveBeenCalledWith('1');
    expect(res).toEqual({ id: '1' });
  });
});
