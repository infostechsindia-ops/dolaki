'use client';

import React, { useState } from 'react';

export default function NavigationManagerPage() {
  const [activeMenu, setActiveMenu] = useState<'header' | 'footer' | 'mega'>('header');
  const [saved, setSaved] = useState(false);

  const menuItems = [
    { id: '1', title: 'Categories', url: '/categories', icon: 'Grid', target: '_self' },
    { id: '2', title: 'Flado 10-Min', url: '/flado', icon: 'Zap', target: '_self' },
    { id: '3', title: 'Best Sellers', url: '/discover/best-sellers', icon: 'Sparkles', target: '_self' },
    { id: '4', title: 'Help Center', url: '/help', icon: 'HelpCircle', target: '_self' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Enterprise Navigation Manager</h1>
          <p className="text-sm text-slate-500 mt-1">Manage header menus, mega menus, and footer link hierarchies.</p>
        </div>
        <button
          onClick={() => setSaved(true)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm rounded-lg shadow"
        >
          {saved ? '✓ Saved & Published' : 'Save Changes'}
        </button>
      </div>

      <div className="flex border-b border-slate-200 gap-4">
        {(['header', 'footer', 'mega'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveMenu(tab)}
            className={`pb-3 px-4 text-sm font-medium border-b-2 capitalize transition-colors ${
              activeMenu === tab
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab} Navigation
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-4 text-slate-900 capitalize">{activeMenu} Menu Hierarchy</h2>
        <div className="space-y-3">
          {menuItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-4">
                <span className="cursor-move text-slate-400">⋮⋮</span>
                <div>
                  <div className="font-semibold text-slate-900">{item.title}</div>
                  <div className="text-xs text-slate-500">{item.url}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="px-2 py-1 bg-slate-200 text-slate-700 rounded font-mono">{item.target}</span>
                <button className="text-purple-600 font-medium hover:underline">Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
