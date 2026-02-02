import React, { useState } from 'react';
import { Save, Server, Shield, Smartphone, Laptop, Database } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsProps {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
  onCancel: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ settings, onSave, onCancel }) => {
  const [formData, setFormData] = useState(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center">
            <Database className="w-6 h-6 mr-2 text-blue-600" />
            Backend Configuration
        </h2>
        <p className="text-slate-500 mb-6">
            Choose your data storage method. Firebase provides real-time sync across all devices.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setFormData({...formData, useServer: false})}>
                <input 
                    type="radio" 
                    name="mode" 
                    checked={!formData.useServer}
                    onChange={() => setFormData({...formData, useServer: false})}
                    className="w-5 h-5 text-blue-600"
                />
                <div className="ml-4">
                    <p className="font-semibold text-slate-800">Demo Mode (Local Memory)</p>
                    <p className="text-sm text-slate-500">Data is lost on reload. Good for testing UI.</p>
                </div>
                <div className="ml-auto bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded">Offline</div>
            </div>

            <div className="flex items-center p-4 border border-orange-200 bg-orange-50 rounded-xl cursor-pointer" onClick={() => setFormData({...formData, useServer: true})}>
                <input 
                    type="radio" 
                    name="mode" 
                    checked={formData.useServer}
                    onChange={() => setFormData({...formData, useServer: true})}
                    className="w-5 h-5 text-orange-600"
                />
                <div className="ml-4">
                    <p className="font-semibold text-orange-900 flex items-center">
                        <Database className="w-4 h-4 mr-2" />
                        Firebase Mode (Cloud Database)
                    </p>
                    <p className="text-sm text-orange-700">Real-time sync with Firebase Firestore. Secure authentication.</p>
                </div>
                 <div className="ml-auto bg-green-500 text-white text-xs px-2 py-1 rounded flex items-center">
                    <Smartphone className="w-3 h-3 mr-1" />
                    <Laptop className="w-3 h-3" />
                 </div>
            </div>
          </div>

          {formData.useServer && (
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                <div className="flex items-center mb-3">
                    <Shield className="w-5 h-5 text-orange-600 mr-2" />
                    <h3 className="font-semibold text-orange-900">Firebase Configuration</h3>
                </div>
                <div className="space-y-3">
                    <div className="text-sm text-orange-700">
                        <p className="mb-2">✅ <strong>Authentication:</strong> Email/Password login</p>
                        <p className="mb-2">✅ <strong>Database:</strong> Firestore real-time sync</p>
                        <p className="mb-2">✅ <strong>Security:</strong> User-based data isolation</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-orange-200">
                        <p className="text-xs text-slate-600 mb-2">
                            <strong>Setup Required:</strong> Configure Firebase credentials in .env.local
                        </p>
                        <code className="text-xs text-slate-500 block">
                            VITE_FIREBASE_API_KEY=your_api_key<br/>
                            VITE_FIREBASE_PROJECT_ID=your_project_id
                        </code>
                    </div>
                </div>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Save className="w-4 h-4 inline mr-2" />
              Save Settings
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