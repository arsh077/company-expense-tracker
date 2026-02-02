import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { Settings } from './components/Settings';
import { AuthForm } from './components/AuthForm';
import { Expense, ViewState, User, AppSettings } from './types';
import { ApiService } from './services/api';
import { Loader2, RefreshCw } from 'lucide-react';

// Initialize API Service
const api = new ApiService(false, '');

const App = () => {
  // Application State
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewState>(ViewState.LOGIN);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Settings State
  const [settings, setSettings] = useState<AppSettings>(() => {
    // Try to load from localStorage, otherwise default
    const saved = localStorage.getItem('appSettings');
    return saved ? JSON.parse(saved) : { useServer: false, serverUrl: '' };
  });

  // Update API service when settings change
  useEffect(() => {
    api.updateConfig(settings.useServer, settings.serverUrl);
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }, [settings]);

  // Data Fetching Function
  const fetchExpenses = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    const result = await api.getExpenses();
    setIsLoading(false);
    
    if (result.success && result.data) {
      setExpenses(result.data);
    } else {
      console.error(result.error);
      // Optional: show error toast
    }
  }, [user]);

  // Initial Load on Login
  useEffect(() => {
    if (user) {
      fetchExpenses();
    }
  }, [user, fetchExpenses]);

  // Handle Login
  const handleLogin = async (email: string, password: string) => {
    setError('');
    setIsLoading(true);
    
    const result = await api.login(email, password);
    
    setIsLoading(false);
    if (result.success && result.data) {
      setUser(result.data);
      setView(ViewState.DASHBOARD);
    } else {
      setError(result.error || 'Login failed');
    }
  };

  // Handle Registration (Firebase only)
  const handleRegister = async (email: string, password: string, displayName: string) => {
    setError('');
    setIsLoading(true);
    
    const result = await api.register(email, password, displayName);
    
    setIsLoading(false);
    if (result.success && result.data) {
      setUser(result.data);
      setView(ViewState.DASHBOARD);
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  const handleLogout = async () => {
    await api.logout();
    setUser(null);
    setView(ViewState.LOGIN);
    setExpenses([]);
  };

  const addExpense = async (newExpense: Omit<Expense, 'id'>) => {
    setIsLoading(true);
    const result = await api.addExpense(newExpense);
    
    if (result.success && result.data) {
      // Optimistic update or refetch
      await fetchExpenses();
      setView(ViewState.LIST_EXPENSES);
    } else {
      alert('Failed to save expense: ' + result.error);
    }
    setIsLoading(false);
  };

  const saveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    setView(ViewState.DASHBOARD);
    // If we switched to server mode, we might need to re-login or just re-fetch
    if (user) fetchExpenses();
  };

  // Render Login View
  if (view === ViewState.LOGIN || view === ViewState.SETTINGS) {
    return (
      <>
        <AuthForm
          onLogin={handleLogin}
          onRegister={handleRegister}
          onSettings={() => setView(ViewState.SETTINGS)}
          isLoading={isLoading}
          error={error}
          isFirebaseMode={settings.useServer}
        />
        
        {/* Settings Modal */}
        {view === ViewState.SETTINGS && (
           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl w-full max-w-2xl">
                    <div className="p-4 border-b">
                        <h3 className="text-lg font-bold">Connection Settings</h3>
                    </div>
                    <div className="p-4">
                        <Settings 
                            settings={settings} 
                            onSave={(s) => { setSettings(s); setView(ViewState.LOGIN); }}
                            onCancel={() => setView(ViewState.LOGIN)} 
                        />
                    </div>
                </div>
           </div>
        )}
      </>
    );
  }

  // Render Main App
  return (
    <Layout 
        currentView={view} 
        onChangeView={setView} 
        onLogout={handleLogout} 
        user={user}
        settings={settings}
    >
      {/* Global Loading Overlay */}
      {isLoading && (
        <div className="fixed top-4 right-4 z-50 bg-white px-4 py-2 rounded-lg shadow-lg flex items-center border border-blue-100">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600 mr-2" />
            <span className="text-sm font-medium text-slate-600">Syncing...</span>
        </div>
      )}

      {/* Sync Button */}
      {settings.useServer && (
          <div className="flex justify-end mb-4">
              <button 
                onClick={fetchExpenses}
                className="flex items-center text-sm text-slate-500 hover:text-blue-600 transition-colors"
              >
                  <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh Data
              </button>
          </div>
      )}

      {view === ViewState.DASHBOARD && (
        <Dashboard 
            expenses={expenses} 
            onAddClick={() => setView(ViewState.ADD_EXPENSE)} 
        />
      )}
      
      {view === ViewState.ADD_EXPENSE && (
        <ExpenseForm 
            onSave={addExpense} 
            onCancel={() => setView(ViewState.DASHBOARD)}
            currentUser={user?.username || 'Unknown'} 
        />
      )}
      
      {view === ViewState.LIST_EXPENSES && (
        <ExpenseList expenses={expenses} />
      )}

      {view === ViewState.SETTINGS && (
        <Settings 
            settings={settings}
            onSave={saveSettings}
            onCancel={() => setView(ViewState.DASHBOARD)}
        />
      )}
    </Layout>
  );
};

export default App;