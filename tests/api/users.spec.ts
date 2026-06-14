import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../src/helpers/apiHelper';
import type { ApiUser } from '../../src/types';

test.describe('Users API', () => {
  let api: ApiHelper;

  test.beforeEach(({ request }) => {
    api = new ApiHelper(request);
  });

  test('GET /users — should return 10 users', async () => {
    const response = await api.get('/users');
    api.assertStatus(response, 200);
    const users = await api.getJson<ApiUser[]>(response);
    expect(users).toHaveLength(10);
  });

  test('GET /users — each user should have name, email, address', async () => {
    const response = await api.get('/users');
    api.assertStatus(response, 200);
    const users = await api.getJson<ApiUser[]>(response);

    for (const user of users) {
      expect.soft(typeof user.name).toBe('string');
      expect.soft(user.name.length).toBeGreaterThan(0);
      expect.soft(typeof user.email).toBe('string');
      expect.soft(user.email).toContain('@');
      expect.soft(typeof user.address).toBe('object');
      expect.soft(typeof user.address.street).toBe('string');
      expect.soft(typeof user.address.city).toBe('string');
      expect.soft(typeof user.address.zipcode).toBe('string');
    }
  });

  test('GET /users/1 — should return correct user', async () => {
    const response = await api.get('/users/1');
    api.assertStatus(response, 200);
    const user = await api.getJson<ApiUser>(response);
    expect(user.id).toBe(1);
    expect(user.name).toBe('Leanne Graham');
    expect(user.username).toBe('Bret');
    expect(user.email).toBe('Sincere@april.biz');
  });
});
