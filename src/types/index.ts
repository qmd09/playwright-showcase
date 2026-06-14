export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface User {
  username: string;
  password: string;
}

export interface CheckoutDetails {
  firstName: string;
  lastName: string;
  zip: string;
}

export interface ApiPost {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  username: string;
  address: {
    street: string;
    city: string;
    zipcode: string;
  };
}

export interface ApiTodo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export interface ApiComment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';
