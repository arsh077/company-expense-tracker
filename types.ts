export interface Expense {
  id: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  amount: number;
  description: string;
  category: string;
  addedBy: string;
}

export interface User {
  username: string;
  isAdmin: boolean;
  token?: string;
}

export interface AppSettings {
  useServer: boolean;
  serverUrl: string;
}

export enum ViewState {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  ADD_EXPENSE = 'ADD_EXPENSE',
  LIST_EXPENSES = 'LIST_EXPENSES',
  SETTINGS = 'SETTINGS'
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}