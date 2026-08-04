import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { FiHome, FiBox, FiUsers, FiSettings, FiBarChart2, FiShoppingCart } from 'react-icons/fi';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-black text-purple-400 tracking-tighter">
          AuraMart Admin
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link to="/" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition">
            <FiHome /> <span>Dashboard</span>
          </Link>
          <Link to="/orders" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition">
            <FiShoppingCart /> <span>Orders</span>
          </Link>
          <Link to="/products" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition">
            <FiBox /> <span>Products & Catalog</span>
          </Link>
          <Link to="/users" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition">
            <FiUsers /> <span>Vendors & Users</span>
          </Link>
          <Link to="/analytics" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition">
            <FiBarChart2 /> <span>Analytics</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <Link to="/settings" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition">
            <FiSettings /> <span>Settings</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-gray-800">Overview</h1>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">A</div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

const DashboardHome = () => {
  return (
    <div className="space-y-6">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: '₹ 12,45,000', change: '+14%' },
          { label: 'Active Orders', value: '1,240', change: '+5%' },
          { label: 'Total Vendors', value: '342', change: '+12%' },
          { label: 'Active Users', value: '45,211', change: '+22%' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</h3>
            <span className="text-green-500 text-sm font-semibold">{stat.change} vs last month</span>
          </div>
        ))}
      </div>

      {/* Placeholder for Charts / Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
          <h3 className="text-lg font-bold mb-4">Sales Analytics</h3>
          <div className="h-full flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg border border-dashed">
            [ Sales Line Chart Placeholder ]
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
          <h3 className="text-lg font-bold mb-4">Recent Vendor Registrations</h3>
          <div className="h-full flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg border border-dashed">
            [ Vendors List Placeholder ]
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AdminDashboardApp() {
  return (
    <Router>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/orders" element={<div>Orders Management View</div>} />
          <Route path="/products" element={<div>Product Catalog View</div>} />
        </Routes>
      </AdminLayout>
    </Router>
  );
}
