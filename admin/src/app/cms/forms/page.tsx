'use client';

import React, { useState } from 'react';

export default function FormsManagerPage() {
  const [activeForm, setActiveForm] = useState('contact');

  const forms = [
    { id: 'contact', title: 'Customer Support Inquiry', submissions: 142 },
    { id: 'seller', title: 'Become a Seller Application', submissions: 89 },
    { id: 'rider', title: 'Flado Rider Registration', submissions: 215 },
    { id: 'feedback', title: 'Product & UX Feedback', submissions: 54 },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">CMS Forms Builder</h1>
        <p className="text-sm text-slate-500 mt-1">Manage dynamic customer & partner submission forms, field validation, and email routing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {forms.map((form) => (
          <div
            key={form.id}
            onClick={() => setActiveForm(form.id)}
            className={`p-6 rounded-xl border cursor-pointer transition-all ${
              activeForm === form.id
                ? 'bg-purple-50 border-purple-600 shadow-sm'
                : 'bg-white border-slate-200 hover:border-purple-300'
            }`}
          >
            <h3 className="font-bold text-slate-900">{form.title}</h3>
            <p className="text-xs text-slate-500 mt-2">{form.submissions} total submissions</p>
          </div>
        ))}
      </div>
    </div>
  );
}
