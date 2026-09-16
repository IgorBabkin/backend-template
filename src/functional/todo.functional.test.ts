const baseUrl = process.env.FUNCTIONAL_BASE_URL ?? 'http://localhost:3000';

describe('Todo HTTP API', () => {
  it('creates, reads, updates, lists, and deletes a todo', async () => {
    const createResponse = await fetch(`${baseUrl}/todo`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: 'functional title', description: 'functional description' }),
      redirect: 'manual',
    });

    expect(createResponse.status).toBe(302);
    const location = createResponse.headers.get('location');
    expect(location).toMatch(/^https?:\/\/[^/]+\/todo\/\d+$/);

    const todoResponse = await fetch(location!);
    expect(todoResponse.status).toBe(200);
    await expect(todoResponse.json()).resolves.toMatchObject({
      title: 'functional title',
      description: 'functional description',
    });

    const id = new URL(location!).pathname.split('/').pop();
    const updateResponse = await fetch(`${baseUrl}/todo/${id}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: 'updated title' }),
    });
    expect(updateResponse.status).toBe(200);
    await expect(updateResponse.json()).resolves.toMatchObject({
      title: 'updated title',
      description: 'functional description',
    });

    const listResponse = await fetch(`${baseUrl}/todo`);
    expect(listResponse.status).toBe(200);
    await expect(listResponse.json()).resolves.toEqual(
      expect.arrayContaining([expect.objectContaining({ title: 'updated title' })]),
    );

    const deleteResponse = await fetch(`${baseUrl}/todo/${id}`, { method: 'DELETE' });
    expect(deleteResponse.status).toBe(204);

    const deletedResponse = await fetch(`${baseUrl}/todo/${id}`);
    expect(deletedResponse.status).toBe(400);
  });

  it('rejects invalid create payloads', async () => {
    const response = await fetch(`${baseUrl}/todo`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: 'missing description' }),
    });

    expect(response.status).toBe(500);
  });
});
