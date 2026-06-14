import type { User, CheckoutDetails } from '../types';

export const USERS: Record<string, User> = {
  standard: { username: 'standard_user', password: 'secret_sauce' },
  locked: { username: 'locked_out_user', password: 'secret_sauce' },
  problem: { username: 'problem_user', password: 'secret_sauce' },
  performance: { username: 'performance_glitch_user', password: 'secret_sauce' },
  error: { username: 'error_user', password: 'secret_sauce' },
  visual: { username: 'visual_user', password: 'secret_sauce' },
};

export const PRODUCTS: string[] = [
  'Sauce Labs Backpack',
  'Sauce Labs Bike Light',
  'Sauce Labs Bolt T-Shirt',
  'Sauce Labs Fleece Jacket',
  'Sauce Labs Onesie',
  'Test.allTheThings() T-Shirt (Red)',
];

export const CHECKOUT_DATA: {
  valid: CheckoutDetails;
  missingFirstName: CheckoutDetails;
  missingLastName: CheckoutDetails;
  missingZip: CheckoutDetails;
} = {
  valid: { firstName: 'John', lastName: 'Doe', zip: '12345' },
  missingFirstName: { firstName: '', lastName: 'Doe', zip: '12345' },
  missingLastName: { firstName: 'John', lastName: '', zip: '12345' },
  missingZip: { firstName: 'John', lastName: 'Doe', zip: '' },
};

export const API_BASE_URL = 'https://jsonplaceholder.typicode.com';
export const UI_BASE_URL = 'https://www.saucedemo.com';

export const AUTH_STATE_PATH = '.auth/user.json';
