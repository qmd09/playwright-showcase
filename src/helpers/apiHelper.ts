import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { API_BASE_URL } from './testData';

export class ApiHelper {
  constructor(private readonly request: APIRequestContext) {}

  async get(path: string, params?: Record<string, string | number | boolean>): Promise<APIResponse> {
    return this.request.get(`${API_BASE_URL}${path}`, { params });
  }

  async post(path: string, body: unknown): Promise<APIResponse> {
    return this.request.post(`${API_BASE_URL}${path}`, {
      data: body,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async put(path: string, body: unknown): Promise<APIResponse> {
    return this.request.put(`${API_BASE_URL}${path}`, {
      data: body,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async delete(path: string): Promise<APIResponse> {
    return this.request.delete(`${API_BASE_URL}${path}`);
  }

  assertStatus(response: APIResponse, expectedStatus: number): void {
    expect(response.status()).toBe(expectedStatus);
  }

  async assertSchema<T>(response: APIResponse, validator: (data: unknown) => data is T): Promise<T> {
    const json = await response.json();
    if (!validator(json)) {
      throw new Error(`Response schema validation failed: ${JSON.stringify(json)}`);
    }
    return json;
  }

  async getJson<T>(response: APIResponse): Promise<T> {
    return (await response.json()) as T;
  }
}
