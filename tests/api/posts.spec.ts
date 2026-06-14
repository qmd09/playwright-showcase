import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../src/helpers/apiHelper';
import type { ApiPost } from '../../src/types';

function isApiPost(data: unknown): data is ApiPost {
  if (typeof data !== 'object' || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.id === 'number' &&
    typeof d.userId === 'number' &&
    typeof d.title === 'string' &&
    typeof d.body === 'string'
  );
}

test.describe('Posts API', () => {
  let api: ApiHelper;

  test.beforeEach(({ request }) => {
    api = new ApiHelper(request);
  });

  test('GET /posts — should return 100 posts', async () => {
    const response = await api.get('/posts');
    api.assertStatus(response, 200);
    const posts = await api.getJson<ApiPost[]>(response);
    expect(posts).toHaveLength(100);
  });

  test('GET /posts — should return correct schema (id, title, body, userId)', async () => {
    const response = await api.get('/posts');
    api.assertStatus(response, 200);
    const posts = await api.getJson<unknown[]>(response);
    expect(posts.every(isApiPost)).toBe(true);
  });

  test('GET /posts/1 — should return correct post', async () => {
    const response = await api.get('/posts/1');
    api.assertStatus(response, 200);
    const post = await api.getJson<ApiPost>(response);
    expect(post.id).toBe(1);
    expect(post.userId).toBe(1);
    expect(post.title).toBeTruthy();
    expect(post.body).toBeTruthy();
  });

  test('GET /posts/999 — should return 404', async () => {
    // JSONPlaceholder returns 404 for non-existent resources
    const response = await api.get('/posts/999');
    api.assertStatus(response, 404);
  });

  test('POST /posts — should create post and return 201', async () => {
    const newPost = { title: 'Test Post', body: 'Test body', userId: 1 };
    const response = await api.post('/posts', newPost);
    api.assertStatus(response, 201);
    const created = await api.getJson<ApiPost>(response);
    expect(created.title).toBe(newPost.title);
    expect(created.body).toBe(newPost.body);
    expect(created.userId).toBe(newPost.userId);
    expect(typeof created.id).toBe('number');
  });

  test('PUT /posts/1 — should update post and return 200', async () => {
    const updated = { id: 1, title: 'Updated Title', body: 'Updated body', userId: 1 };
    const response = await api.put('/posts/1', updated);
    api.assertStatus(response, 200);
    const result = await api.getJson<ApiPost>(response);
    expect(result.title).toBe(updated.title);
    expect(result.id).toBe(1);
  });

  test('DELETE /posts/1 — should delete post and return 200', async () => {
    const response = await api.delete('/posts/1');
    api.assertStatus(response, 200);
  });

  test('GET /posts?userId=1 — should filter posts by userId', async () => {
    const response = await api.get('/posts', { userId: 1 });
    api.assertStatus(response, 200);
    const posts = await api.getJson<ApiPost[]>(response);
    expect(posts.length).toBeGreaterThan(0);
    expect(posts.every((p) => p.userId === 1)).toBe(true);
  });
});
