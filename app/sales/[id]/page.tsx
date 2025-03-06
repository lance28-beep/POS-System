'use client';

import AdminLayout from '../../components/layouts/AdminLayout';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Receipt from '../../components/Receipt';

interface Product {
  id: string;
  code: string;
  name: string;
  unitPrice: number;
}

interface SaleItem {
  id: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  product: Product;
}

interface Sale {
  id: string;
  invoiceNumber: string;
  customerName: string;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  items: SaleItem[];
}

export default function SaleDetails({ params }: { params: { id: string } }) {
  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const router = useRouter();

  const fetchSale = useCallback(async () => {
    try {
      const response = await fetch(`/api/sales/${params.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch sale');
      }
      const data = await response.json();
      setSale(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sale:', error);
      setError('Failed to load sale details');
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchSale();
  }, [fetchSale]);

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this sale?')) return;

    try {
      const response = await fetch(`/api/sales/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel sale');
      }

      router.push('/sales');
    } catch (error) {
      console.error('Error cancelling sale:', error);
      setError('Failed to cancel sale');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!sale) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Sale not found</h2>
          <button
            onClick={() => router.push('/sales')}
            className="mt-4 text-blue-600 hover:text-blue-900"
          >
            Back to Sales
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sale Details</h1>
            <p className="text-sm text-gray-500">Invoice #{sale.invoiceNumber}</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowReceipt(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Print Receipt
            </button>
            <button
              onClick={() => router.push('/sales')}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Back to Sales
            </button>
            {sale.status === 'completed' && (
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Cancel Sale
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Sale Details */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h2>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Name:</span> {sale.customerName}
                  </p>
                  <p>
                    <span className="font-medium">Payment Method:</span>{' '}
                    {sale.paymentMethod.charAt(0).toUpperCase() + sale.paymentMethod.slice(1)}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{' '}
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      sale.status === 'completed' ? 'bg-green-100 text-green-800' :
                      sale.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Date:</span>{' '}
                    {new Date(sale.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Invoice Number:</span> {sale.invoiceNumber}
                  </p>
                  <p>
                    <span className="font-medium">Total Amount:</span>{' '}
                    ₱{sale.totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="border-t">
            <div className="px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">Order Items</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sale.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.product.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₱{item.unitPrice.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₱{item.subtotal.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                      Total Amount:
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      ₱{sale.totalAmount.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Receipt Modal */}
        {showReceipt && (
          <Receipt
            sale={sale}
            onClose={() => setShowReceipt(false)}
          />
        )}
      </div>
    </AdminLayout>
  );
} 