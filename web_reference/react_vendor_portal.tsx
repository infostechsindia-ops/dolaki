import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { FiGrid, FiPackage, FiTruck, FiDollarSign, FiBell } from 'react-icons/fi';

const VendorLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <h2 className="text-xl font-black text-green-600">Vendor Central</h2>
          <p className="text-xs text-gray-500 mt-1">AuraMart Partner</p>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <Link to="/" className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-700 transition font-medium">
            <FiGrid /> <span>Dashboard</span>
          </Link>
          <Link to="/inventory" className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-700 transition font-medium">
            <FiPackage /> <span>Inventory & Products</span>
          </Link>
          <Link to="/orders" className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-700 transition font-medium">
            <FiTruck /> <span>Order Fulfillment</span>
          </Link>
          <Link to="/payments" className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-700 transition font-medium">
            <FiDollarSign /> <span>Payments & Settlements</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-6 space-x-4">
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
            <FiBell size={20} />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="flex items-center space-x-2">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-gray-800">TechNova Store</p>
              <p className="text-xs text-gray-500">Verified Seller</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-green-100 border border-green-200 flex items-center justify-center text-green-700 font-bold">
              T
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

const VendorDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Store Overview</h1>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition">
          + Add New Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-4 bg-orange-100 text-orange-600 rounded-full"><FiTruck size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Pending Orders</p>
            <p className="text-2xl font-bold">42</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-full"><FiPackage size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Low Stock Alerts</p>
            <p className="text-2xl font-bold">7</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-4 bg-green-100 text-green-600 rounded-full"><FiDollarSign size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Today's Sales</p>
            <p className="text-2xl font-bold">₹ 14,500</p>
          </div>
        </div>
      </div>

      {/* Inventory Grid & Order Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory Grid snippet */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-gray-800">Recent Inventory</h3>
            <Link to="/inventory" className="text-sm text-green-600 font-medium">View All</Link>
          </div>
          <div className="p-0 flex-1">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 border-b">
                <tr>
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">SKU</th>
                  <th className="px-4 py-3 font-medium text-right">Stock</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-3 flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-md"></div>
                    <span className="font-medium">Wireless Noise Buds</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">SKU-AUDIO-01</td>
                  <td className="px-4 py-3 text-right font-bold text-green-600">45</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-md"></div>
                    <span className="font-medium">Smart Watch Gen 3</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">SKU-WEAR-03</td>
                  <td className="px-4 py-3 text-right font-bold text-red-500">2 (Low)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Fulfillment Status */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-gray-800">Action Required Orders</h3>
            <Link to="/orders" className="text-sm text-green-600 font-medium">Manage</Link>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center p-3 border border-orange-200 bg-orange-50 rounded-lg">
              <div>
                <p className="font-bold text-gray-800">Order #ORD-8821</p>
                <p className="text-xs text-gray-500">Placed 15 mins ago • Standard Delivery</p>
              </div>
              <button className="bg-orange-500 text-white px-3 py-1.5 rounded text-sm font-medium">Pack Order</button>
            </div>
            <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="font-bold text-gray-800">Order #ORD-8819</p>
                <p className="text-xs text-gray-500">Packed • Waiting for Delivery Partner</p>
              </div>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">Ready to Ship</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function VendorPortalApp() {
  return (
    <Router>
      <VendorLayout>
        <Routes>
          <Route path="/" element={<VendorDashboard />} />
          {/* Other routes placeholder */}
        </Routes>
      </VendorLayout>
    </Router>
  );
}
