import { Expense, User, ApiResponse } from '../types';
import { FirebaseService } from './firebaseService';

// Mock Data for Demo Mode
let MOCK_DATA: Expense[] = [
  { id: 1, date: new Date().toISOString().split('T')[0], time: '09:30', amount: 1500.00, description: 'Vendor Payment - Stationery', category: 'Supplies', addedBy: 'admin' },
  { id: 2, date: new Date(Date.now() - 86400000).toISOString().split('T')[0], time: '14:15', amount: 450.50, description: 'Team Lunch', category: 'Food', addedBy: 'admin' },
  { id: 3, date: new Date(Date.now() - 172800000).toISOString().split('T')[0], time: '11:00', amount: 2500.00, description: 'Cab Services - Client Visit', category: 'Travel', addedBy: 'staff1' },
  { id: 4, date: new Date(Date.now() - 259200000).toISOString().split('T')[0], time: '16:45', amount: 120.00, description: 'Pantry Supplies', category: 'Food', addedBy: 'admin' },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class ApiService {
  private useServer: boolean;
  private baseUrl: string;
  private firebaseService: FirebaseService;

  constructor(useServer: boolean, baseUrl: string) {
    this.useServer = useServer;
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    this.firebaseService = new FirebaseService();
  }

  updateConfig(useServer: boolean, baseUrl: string) {
    this.useServer = useServer;
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  }

  async login(username: string, password: string): Promise<ApiResponse<User>> {
    if (this.useServer) {
      // Firebase Authentication
      return await this.firebaseService.login(username, password);
    } else {
      // Demo Mode
      await delay(500);
      if (username === 'admin' && password === 'admin123') {
        return { success: true, data: { username: 'admin', isAdmin: true } };
      }
      return { success: false, error: 'Invalid credentials (Demo: admin/admin123)' };
    }
  }

  async register(email: string, password: string, displayName: string): Promise<ApiResponse<User>> {
    if (this.useServer) {
      return await this.firebaseService.register(email, password, displayName);
    } else {
      return { success: false, error: 'Registration only available in Firebase mode' };
    }
  }

  async logout(): Promise<void> {
    if (this.useServer) {
      await this.firebaseService.logout();
    }
  }

  async getExpenses(): Promise<ApiResponse<Expense[]>> {
    if (this.useServer) {
      // Firebase Firestore
      return await this.firebaseService.getExpenses();
    } else {
      // Demo Mode
      await delay(500);
      return { success: true, data: [...MOCK_DATA] };
    }
  }

  async addExpense(expense: Omit<Expense, 'id'>): Promise<ApiResponse<Expense>> {
    if (this.useServer) {
      // Firebase Firestore
      return await this.firebaseService.addExpense(expense);
    } else {
      // Demo Mode
      await delay(500);
      const newExpense = { ...expense, id: Date.now() };
      MOCK_DATA = [newExpense, ...MOCK_DATA];
      return { success: true, data: newExpense };
    }
  }

  isAuthenticated(): boolean {
    if (this.useServer) {
      return this.firebaseService.isAuthenticated();
    }
    return false; // Demo mode doesn't persist auth
  }
}