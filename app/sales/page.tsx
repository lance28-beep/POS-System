'use client';

import AdminLayout from '../components/layouts/AdminLayout';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  code: string;
  name: string;
  unitPrice: number;
  stocks: number;
}

interface SaleItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface Sale {
  id: string;
  invoiceNumber: string;
  customerName: string;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

export default function Sales() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [isNewSaleModalOpen, setIsNewSaleModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [newSale, setNewSale] = useState({
    customerName: '',
    paymentMethod: 'cash',
    items: [] as SaleItem[],
  });

  useEffect(() => {
    fetchProducts();
    fetchSales();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
    }
  };

  const fetchSales = async () => {
    try {
      const response = await fetch('/api/sales');
      if (!response.ok) {
        throw new Error('Failed to fetch sales');
      }
      const data = await response.json();
      setSales(data);
    } catch (error) {
      console.error('Error fetching sales:', error);
      setError('Failed to load sales');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = newSale.items.find(item => item.productId === productId);
    if (existingItem) {
      if (existingItem.quantity >= product.stocks) {
        alert('Not enough stock available');
        return;
      }
      setNewSale({
        ...newSale,
        items: newSale.items.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.unitPrice }
            : item
        ),
      });
    } else {
      setNewSale({
        ...newSale,
        items: [...newSale.items, {
          productId,
          quantity: 1,
          unitPrice: product.unitPrice,
          subtotal: product.unitPrice,
        }],
      });
    }
  };

  const handleRemoveItem = (productId: string) => {
    setNewSale({
      ...newSale,
      items: newSale.items.filter(item => item.productId !== productId),
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product || quantity < 1 || quantity > product.stocks) return;

    setNewSale({
      ...newSale,
      items: newSale.items.map(item =>
        item.productId === productId
          ? { ...item, quantity, subtotal: quantity * item.unitPrice }
          : item
      ),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSale),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create sale');
      }

      const sale = await response.json();
      setSales([sale, ...sales]);
      setIsNewSaleModalOpen(false);
      setNewSale({
        customerName: '',
        paymentMethod: 'cash',
        items: [],
      });
    } catch (error) {
      console.error('Error creating sale:', error);
      setError(error instanceof Error ? error.message : 'Failed to create sale');
    }
  };

  const handleCancelSale = async (saleId: string) => {
    if (!confirm('Are you sure you want to cancel this sale?')) return;

    try {
      const response = await fetch(`/api/sales/${saleId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel sale');
      }

      setSales(sales.map(sale =>
        sale.id === saleId ? { ...sale, status: 'cancelled' } : sale
      ));
    } catch (error) {
      console.error('Error cancelling sale:', error);
      setError('Failed to cancel sale');
    }
  };

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || sale.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalAmount = newSale.items.reduce((sum, item) => sum + item.subtotal, 0);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Sales Management</h1>
          <button
            onClick={() => setIsNewSaleModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            New Sale
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search sales..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="w-full md:w-48">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sales Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSales.map((sale) => (
                  <tr key={sale.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {sale.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sale.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₱{sale.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sale.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        sale.status === 'completed' ? 'bg-green-100 text-green-800' :
                        sale.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {sale.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(sale.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Link
                        href={`/sales/${sale.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View
                      </Link>
                      {sale.status === 'completed' && (
                        <button
                          onClick={() => handleCancelSale(sale.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* New Sale Modal */}
        {isNewSaleModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
              <h2 className="text-xl font-bold text-gray-900 mb-4">New Sale</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                    <input
                      type="text"
                      value={newSale.customerName}
                      onChange={(e) => setNewSale({ ...newSale, customerName: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                    <select
                      value={newSale.paymentMethod}
                      onChange={(e) => setNewSale({ ...newSale, paymentMethod: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="gcash">GCash</option>
                    </select>
                  </div>
                </div>

                {/* Product Selection */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Add Products</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="border rounded-lg p-4 flex justify-between items-center"
                      >
                        <div>
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="text-sm text-gray-500">₱{product.unitPrice.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">Stock: {product.stocks}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddItem(product.id)}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected Items */}
                {newSale.items.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Selected Items</h3>
                    <div className="space-y-2">
                      {newSale.items.map((item) => {
                        const product = products.find(p => p.id === item.productId);
                        if (!product) return null;

                        return (
                          <div key={item.productId} className="flex items-center justify-between border rounded-lg p-3">
                            <div>
                              <h4 className="font-medium">{product.name}</h4>
                              <p className="text-sm text-gray-500">₱{item.unitPrice.toLocaleString()} x {item.quantity}</p>
                              <p className="text-sm font-medium">₱{item.subtotal.toLocaleString()}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                min="1"
                                max={product.stocks}
                                value={item.quantity}
                                onChange={(e) => handleUpdateQuantity(item.productId, parseInt(e.target.value))}
                                className="w-20 px-2 py-1 border rounded"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(item.productId)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Total Amount */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">Total Amount:</span>
                    <span className="text-2xl font-bold">₱{totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsNewSaleModalOpen(false)}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Complete Sale
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
} 