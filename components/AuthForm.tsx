import React, { useState } from 'react';
import { Lock, User as UserIcon, Loader2, Mail, UserPlus, LogIn } from 'lucide-react';

interface AuthFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (email: string, password: string, displayName: string) => Promise<void>;
  onSettings: () => void;
  isLoading: boolean;
  error: string;
  isFirebaseMode: boolean;
}

export const AuthForm: React.FC<AuthFormProps> = ({ 
  onLogin, 
  onRegister, 
  onSettings, 
  isLoading, 
  error, 
  isFirebaseMode 
}) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoginMode) {
      await onLogin(formData.email, formData.password);
    } else {
      await onRegister(formData.email, formData.password, formData.displayName);
    }
  };

  const resetForm = () => {
    setFormData({ email: '', password: '', displayName: '' });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        <div className="text-center mb-8">
          <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Lock className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Company Expense Tracker</h1>
          <p className="text-slate-500 mt-2">
              {isFirebaseMode ? 'Firebase Cloud Mode' : 'Demo Mode (Offline)'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLoginMode && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Display Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                <input
                    type="text"
                    required={!isLoginMode}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter your name"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {isFirebaseMode ? 'Email' : 'Username'}
            </label>
            <div className="relative">
              {isFirebaseMode ? (
                <Mail className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
              ) : (
                <UserIcon className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
              )}
              <input
                  type={isFirebaseMode ? "email" : "text"}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder={isFirebaseMode ? "Enter email address" : "Enter username"}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
              <input
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-blue-700 transition-transform active:scale-95 shadow-md flex justify-center items-center"
          >
            {isLoading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              <>
                {isLoginMode ? <LogIn className="w-5 h-5 mr-2" /> : <UserPlus className="w-5 h-5 mr-2" />}
                {isLoginMode ? 'Login' : 'Create Account'}
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
          {isFirebaseMode && (
            <div className="text-center">
              <button 
                onClick={() => {
                  setIsLoginMode(!isLoginMode);
                  resetForm();
                }} 
                className="text-sm text-blue-600 hover:underline"
              >
                {isLoginMode ? "Don't have an account? Sign up" : "Already have an account? Login"}
              </button>
            </div>
          )}
          
          <div className="text-center">
            <button onClick={onSettings} className="text-sm text-slate-500 hover:underline">
                Configure Backend Connection
            </button>
          </div>
          
          {!isFirebaseMode && (
            <p className="text-xs text-slate-400 text-center">
                Default Credentials:<br/>
                User: <span className="font-mono text-slate-600">admin</span> | Pass: <span className="font-mono text-slate-600">admin123</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};