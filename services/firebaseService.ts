import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  where,
  doc,
  setDoc,
  getDoc,
  Timestamp 
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { Expense, User, ApiResponse } from '../types';

export class FirebaseService {
  private currentUser: FirebaseUser | null = null;

  constructor() {
    // Listen to auth state changes
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
    });
  }

  // Authentication Methods
  async login(email: string, password: string): Promise<ApiResponse<User>> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Get user profile from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      const userData = userDoc.data();
      
      const user: User = {
        username: userData?.displayName || firebaseUser.email?.split('@')[0] || 'User',
        isAdmin: userData?.isAdmin || false,
        token: await firebaseUser.getIdToken()
      };

      return { success: true, data: user };
    } catch (error: any) {
      return { 
        success: false, 
        error: this.getErrorMessage(error.code) 
      };
    }
  }

  async register(email: string, password: string, displayName: string): Promise<ApiResponse<User>> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Create user profile in Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        displayName,
        email,
        isAdmin: false,
        createdAt: Timestamp.now()
      });

      const user: User = {
        username: displayName,
        isAdmin: false,
        token: await firebaseUser.getIdToken()
      };

      return { success: true, data: user };
    } catch (error: any) {
      return { 
        success: false, 
        error: this.getErrorMessage(error.code) 
      };
    }
  }

  async logout(): Promise<void> {
    await signOut(auth);
  }

  // Expense Methods
  async getExpenses(): Promise<ApiResponse<Expense[]>> {
    try {
      if (!this.currentUser) {
        return { success: false, error: 'User not authenticated' };
      }

      const expensesRef = collection(db, 'expenses');
      const q = query(
        expensesRef,
        where('userId', '==', this.currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const expenses: Expense[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        expenses.push({
          id: parseInt(doc.id.slice(-8), 16), // Convert doc ID to number
          date: data.date,
          time: data.time,
          amount: data.amount,
          description: data.description,
          category: data.category,
          addedBy: data.addedBy
        });
      });

      return { success: true, data: expenses };
    } catch (error: any) {
      return { 
        success: false, 
        error: 'Failed to fetch expenses: ' + error.message 
      };
    }
  }

  async addExpense(expense: Omit<Expense, 'id'>): Promise<ApiResponse<Expense>> {
    try {
      if (!this.currentUser) {
        return { success: false, error: 'User not authenticated' };
      }

      const expenseData = {
        ...expense,
        userId: this.currentUser.uid,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, 'expenses'), expenseData);
      
      const newExpense: Expense = {
        ...expense,
        id: parseInt(docRef.id.slice(-8), 16)
      };

      return { success: true, data: newExpense };
    } catch (error: any) {
      return { 
        success: false, 
        error: 'Failed to save expense: ' + error.message 
      };
    }
  }

  // Utility Methods
  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Invalid email or password';
      case 'auth/email-already-in-use':
        return 'Email already registered';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Try again later';
      default:
        return 'Authentication failed. Please try again';
    }
  }

  getCurrentUser(): FirebaseUser | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }
}