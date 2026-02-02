import React from 'react';
import { Expense } from '../types';
import { TrendingUp, Calendar, CreditCard, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  expenses: Expense[];
  onAddClick: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ expenses, onAddClick }) => {
  const totalAmount = expenses.reduce((sum, item) => sum + item.amount, 0);
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  
  const monthTotal = monthExpenses.reduce((sum, item) => sum + item.amount, 0);

  // Prepare chart data (Last 7 days)
  const chartData = React.useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayTotal = expenses
        .filter(e => e.date === dateStr)
        .reduce((sum, e) => sum + e.amount, 0);
      
      data.push({
        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        amount: dayTotal,
        date: dateStr
      });
    }
    return data;
  }, [expenses]);

  const StatCard = ({ title, value, icon: Icon, color, subtext }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
          <p className="text-slate-500">Welcome back! Here's your financial summary.</p>
        </div>
        <button 
            onClick={onAddClick}
            className="hidden md:flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
            <TrendingUp className="w-4 h-4 mr-2" />
            Quick Add
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Today's Total" 
          value={`₹${chartData[chartData.length-1].amount.toLocaleString()}`} 
          icon={DollarSign} 
          color="bg-emerald-500"
          subtext="Daily spending"
        />
        <StatCard 
          title="This Month" 
          value={`₹${monthTotal.toLocaleString()}`} 
          icon={Calendar} 
          color="bg-blue-500"
          subtext={`${new Date().toLocaleString('default', { month: 'long' })} expenses`}
        />
        <StatCard 
          title="Total Entries" 
          value={expenses.length} 
          icon={CreditCard} 
          color="bg-indigo-500"
          subtext="All time records"
        />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Spending Trends (Last 7 Days)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} tickFormatter={(value) => `₹${value}`} />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#059669' : '#3b82f6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};