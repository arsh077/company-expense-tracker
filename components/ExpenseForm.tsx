import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { Expense } from '../types';

interface ExpenseFormProps {
  onSave: (expense: Omit<Expense, 'id'>) => void;
  onCancel: () => void;
  currentUser: string;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSave, onCancel, currentUser }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].slice(0, 5),
    amount: '',
    description: '',
    category: 'General'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      date: formData.date,
      time: formData.time,
      amount: parseFloat(formData.amount),
      description: formData.description,
      category: formData.category,
      addedBy: currentUser
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-blue-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center">
                <Save className="w-5 h-5 mr-2" />
                Add New Expense
            </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Date</label>
              <input
                type="date"
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Time</label>
              <input
                type="time"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Amount (₹)</label>
            <div className="relative">
                <span className="absolute left-4 top-2 text-slate-500">₹</span>
                <input
                    type="number"
                    step="0.01"
                    required
                    min="0"
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
            <textarea
              required
              rows={4}
              placeholder="What was this expense for? (e.g., Client Lunch, Office Supplies)"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <p className="text-xs text-slate-400 mt-1 text-right">{formData.description.length}/500</p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
            >
              Save Expense
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-slate-100 text-slate-600 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};