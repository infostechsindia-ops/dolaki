import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  status: 'Active' | 'Out of Stock' | 'Draft';
}

export default function VendorInventoryGrid() {
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Wireless Noise Buds', sku: 'SKU-AUDIO-01', price: 2999, stock: 45, status: 'Active' },
    { id: '2', name: 'Smart Watch Gen 3', sku: 'SKU-WEAR-03', price: 4999, stock: 0, status: 'Out of Stock' },
    { id: '3', name: 'Cotton Crew Neck T-Shirt', sku: 'SKU-APP-12', price: 699, stock: 120, status: 'Active' },
  ]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col w-full">
      <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 bg-gray-50">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Inventory Management</h2>
          <p className="text-sm text-gray-500">Manage your product catalog, pricing, and stock levels.</p>
        </div>
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name or SKU..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition whitespace-nowrap">
            <FiPlus /> <span>Add Product</span>
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 text-gray-600 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold">Product Info</th>
              <th className="px-6 py-4 font-semibold">SKU</th>
              <th className="px-6 py-4 font-semibold text-right">Price (₹)</th>
              <th className="px-6 py-4 font-semibold text-right">Stock</th>
              <th className="px-6 py-4 font-semibold text-center">Status</th>
              <th className="px-6 py-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0"></div>
                  <span className="font-medium text-gray-900">{product.name}</span>
                </td>
                <td className="px-6 py-4 text-gray-500">{product.sku}</td>
                <td className="px-6 py-4 text-right font-medium">₹{product.price.toLocaleString()}</td>
                <td className={`px-6 py-4 text-right font-bold ${product.stock > 10 ? 'text-green-600' : 'text-red-500'}`}>
                  {product.stock}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    product.status === 'Active' ? 'bg-green-100 text-green-700' : 
                    product.status === 'Out of Stock' ? 'bg-red-100 text-red-700' : 
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center space-x-3">
                    <button className="text-blue-600 hover:text-blue-800 transition" title="Edit">
                      <FiEdit2 size={18} />
                    </button>
                    <button className="text-red-600 hover:text-red-800 transition" title="Delete">
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Placeholder */}
      <div className="p-4 border-t border-gray-200 flex items-center justify-between bg-white">
        <span className="text-sm text-gray-500">Showing 1 to 3 of 3 entries</span>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50" disabled>Previous</button>
          <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50" disabled>Next</button>
        </div>
      </div>
    </div>
  );
}
