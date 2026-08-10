'use client';

import React, { useState } from 'react';

export default function SeoManagerPage() {
  const redirects = [
    { source: '/old-about', destination: '/company/about', type: 301, active: true },
    { source: '/help-faq', destination: '/help', type: 301, active: true },
    { source: '/seller-signup', destination: '/business/become-a-seller', type: 301, active: true },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">SEO & Redirect Manager</h1>
        <p className="text-sm text-slate-500 mt-1">Configure global meta tags, OpenGraph schemas, and 301/302 URL redirects.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Active 301/302 Redirect Rules</h2>
        <div className="space-y-3">
          {redirects.map((r, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-4 text-sm font-mono">
                <span className="text-slate-600">{r.source}</span>
                <span className="text-purple-600 font-bold">→</span>
                <span className="text-slate-900 font-bold">{r.destination}</span>
              </div>
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded">{r.type} Permanent</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
