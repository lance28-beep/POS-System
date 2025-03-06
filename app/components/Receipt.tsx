'use client';

import { useRef } from 'react';

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

interface ReceiptProps {
  sale: Sale;
  onClose: () => void;
}

export default function Receipt({ sale, onClose }: ReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (receiptRef.current) {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        {/* Receipt Content */}
        <div ref={receiptRef} className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">POS System</h1>
            <p className="text-sm text-gray-600">123 Business Street</p>
            <p className="text-sm text-gray-600">Manila, Philippines</p>
            <p className="text-sm text-gray-600">Tel: (123) 456-7890</p>
            <p className="text-sm text-gray-600">Email: info@possystem.com</p>
            <div className="border-t border-dashed my-4"></div>
          </div>

          {/* Sale Info */}
          <div className="mb-4">
            <p className="text-sm">
              <span className="font-medium">Invoice #:</span> {sale.invoiceNumber}
            </p>
            <p className="text-sm">
              <span className="font-medium">Date:</span>{' '}
              {new Date(sale.createdAt).toLocaleString()}
            </p>
            <p className="text-sm">
              <span className="font-medium">Customer:</span> {sale.customerName}
            </p>
            <p className="text-sm">
              <span className="font-medium">Payment:</span>{' '}
              {sale.paymentMethod.charAt(0).toUpperCase() + sale.paymentMethod.slice(1)}
            </p>
          </div>

          {/* Items */}
          <div className="mb-4">
            <div className="border-t border-b py-2">
              <div className="grid grid-cols-12 text-sm font-medium">
                <div className="col-span-6">Item</div>
                <div className="col-span-2 text-right">Qty</div>
                <div className="col-span-2 text-right">Price</div>
                <div className="col-span-2 text-right">Total</div>
              </div>
            </div>
            {sale.items.map((item) => (
              <div key={item.id} className="py-2">
                <div className="grid grid-cols-12 text-sm">
                  <div className="col-span-6">{item.product.name}</div>
                  <div className="col-span-2 text-right">{item.quantity}</div>
                  <div className="col-span-2 text-right">
                    ₱{item.unitPrice.toLocaleString()}
                  </div>
                  <div className="col-span-2 text-right">
                    ₱{item.subtotal.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
            <div className="border-t border-b py-2">
              <div className="grid grid-cols-12 text-sm font-medium">
                <div className="col-span-10 text-right">Total Amount:</div>
                <div className="col-span-2 text-right">
                  ₱{sale.totalAmount.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-sm text-gray-600">Thank you for your business!</p>
            <p className="text-sm text-gray-600">Please come again</p>
            <div className="border-t border-dashed my-4"></div>
            <p className="text-xs text-gray-500">
              This is a computer-generated receipt and does not require a signature.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t p-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
} 