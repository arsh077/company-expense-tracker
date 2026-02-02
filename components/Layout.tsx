import React from 'react';
import { LayoutDashboard, PlusCircle, List, LogOut, Menu, X, Wallet, Settings, Cloud, CloudOff } from 'lucide-react';
import { ViewState, User, AppSettings } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  onLogout: () => void;
  user: User | null;
  settings: AppSettings;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onChangeView, onLogout, user, settings }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const NavItem = ({ view, icon: Icon, label }: { view: ViewState; icon: any; label: string }) => (
    <button
      onClick={() => {
        onChangeView(view);
        setIsMobileMenuOpen(false);
      }}
      className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
        currentView === view
          ? 'bg-blue-600 text-white shadow-md'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200">
        <div className="p-6 border-b border-slate-200 flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-800">ExpenseTracker</span>
        </div>
        
        <div className="flex-1 px-4 py-6 space-y-2">
          <NavItem view={ViewState.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
          <NavItem view={ViewState.ADD_EXPENSE} icon={PlusCircle} label="Add Expense" />
          <NavItem view={ViewState.LIST_EXPENSES} icon={List} label="All Expenses" />
          <NavItem view={ViewState.SETTINGS} icon={Settings} label="Settings" />
        </div>

        <div className="p-4 border-t border-slate-200">
           {/* Connection Status Indicator */}
           <div className={`mb-4 px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between ${settings.useServer ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
                <span className="flex items-center">
                    {settings.useServer ? <Cloud className="w-3 h-3 mr-2" /> : <CloudOff className="w-3 h-3 mr-2" />}
                    {settings.useServer ? 'Online Sync' : 'Demo Mode'}
                </span>
           </div>

          <div className="flex items-center mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold mr-3">
              {user?.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">{user?.username}</p>
              <p className="text-xs text-slate-500">{user?.isAdmin ? 'Administrator' : 'Staff'}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-slate-800">ExpenseTracker</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="text-slate-600" /> : <Menu className="text-slate-600" />}
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-10 bg-slate-800 bg-opacity-50 pt-16">
            <div className="bg-white p-4 space-y-2 shadow-xl rounded-b-xl mx-2">
              <NavItem view={ViewState.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
              <NavItem view={ViewState.ADD_EXPENSE} icon={PlusCircle} label="Add Expense" />
              <NavItem view={ViewState.LIST_EXPENSES} icon={List} label="All Expenses" />
              <NavItem view={ViewState.SETTINGS} icon={Settings} label="Settings" />
              <hr className="my-2" />
              <button
                onClick={onLogout}
                className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};