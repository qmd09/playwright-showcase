import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../src/helpers/apiHelper';
import type { ApiTodo } from '../../src/types';

test.describe('Todos API', () => {
  let api: ApiHelper;

  test.beforeEach(({ request }) => {
    api = new ApiHelper(request);
  });

  test('GET /todos — should return 200 todos', async () => {
    const response = await api.get('/todos');
    api.assertStatus(response, 200);
    const todos = await api.getJson<ApiTodo[]>(response);
    expect(todos).toHaveLength(200);
  });

  test('GET /todos?completed=true — should return only completed todos', async () => {
    const response = await api.get('/todos', { completed: true });
    api.assertStatus(response, 200);
    const todos = await api.getJson<ApiTodo[]>(response);
    expect(todos.length).toBeGreaterThan(0);
    expect(todos.every((t) => t.completed === true)).toBe(true);
  });

  test('GET /todos?completed=false — should return only incomplete todos', async () => {
    const response = await api.get('/todos', { completed: false });
    api.assertStatus(response, 200);
    const todos = await api.getJson<ApiTodo[]>(response);
    expect(todos.length).toBeGreaterThan(0);
    expect(todos.every((t) => t.completed === false)).toBe(true);
  });
});
