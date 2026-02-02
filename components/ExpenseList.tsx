import React, { useState, useMemo } from 'react';
import { Expense } from '../types';
import { Download, Search, Filter, ArrowDownUp } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ expenses }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });

  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      const matchesSearch = exp.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            exp.addedBy.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesDate = true;
      if (dateFilter.start) {
        matchesDate = matchesDate && exp.date >= dateFilter.start;
      }
      if (dateFilter.end) {
        matchesDate = matchesDate && exp.date <= dateFilter.end;
      }
      return matchesSearch && matchesDate;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, searchTerm, dateFilter]);

  const totalFiltered = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const downloadCSV = () => {
    const headers = ['Date', 'Time', 'Amount', 'Description', 'Added By'];
    const csvContent = [
      headers.join(','),
      ...filteredExpenses.map(e => 
        [`"${e.date}"`, `"${e.time}"`, e.amount, `"${e.description.replace(/"/g, '""')}"`, `"${e.addedBy}"`].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `expenses_export_${new Date().toISOString().slice(0,10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Expense Records</h2>
        <button
          onClick={downloadCSV}
          className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm text-sm font-medium"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5 relative">
                <Search className="absolute left-3 top-2.5 text-slate-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search description or user..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="md:col-span-3">
                <input
                    type="date"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-600"
                    value={dateFilter.start}
                    onChange={(e) => setDateFilter(prev => ({ ...prev, start: e.target.value }))}
                />
            </div>
            <div className="md:col-span-3">
                <input
                    type="date"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-600"
                    value={dateFilter.end}
                    onChange={(e) => setDateFilter(prev => ({ ...prev, end: e.target.value }))}
                />
            </div>
            <div className="md:col-span-1 flex items-center justify-center bg-slate-50 rounded-lg border border-slate-200">
                <Filter className="text-slate-500 w-5 h-5" />
            </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Time</th>
                <th className="p-4 font-semibold">Description</th>
                <th className="p-4 font-semibold">Added By</th>
                <th className="p-4 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-4 text-sm font-medium text-slate-800 whitespace-nowrap">{expense.date}</td>
                    <td className="p-4 text-sm text-slate-500">{expense.time}</td>
                    <td className="p-4 text-sm text-slate-700 font-medium">
                        {expense.description}
                    </td>
                    <td className="p-4 text-sm">
                        <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md text-xs font-semibold">
                            {expense.addedBy}
                        </span>
                    </td>
                    <td className="p-4 text-right">
                        <span className="text-emerald-600 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-full">
                            ₹{expense.amount.toFixed(2)}
                        </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                        No expenses found matching your filters.
                    </td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-slate-50 border-t border-slate-200">
                <tr>
                    <td colSpan={4} className="p-4 text-right font-bold text-slate-600">Total Filtered:</td>
                    <td className="p-4 text-right font-bold text-emerald-700 text-lg">₹{totalFiltered.toFixed(2)}</td>
                </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};