'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Package, Mail } from 'lucide-react';
import Navigation from '@/components/Navigation';

interface Order {
  id: string;
  status: string;
  total: number;
  items: Array<{
    product: {
      name: string;
      price: number;
    };
    quantity: number;
  }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    city: string;
    state: string;
    postalCode: string;
  };
  createdAt: string;
}

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      // In a real app, fetch order details from API
      // For demo, create mock order data
      setOrder({
        id: orderId,
        status: 'confirmed',
        total: 299.97,
        items: [
          {
            product: { name: 'BPC-157', price: 89.99 },
            quantity: 1,
          },
          {
            product: { name: 'CJC-1295 + Ipamorelin', price: 129.99 },
            quantity: 1,
          },
          {
            product: { name: 'Semaglutide', price: 199.99 },
            quantity: 1,
          },
        ],
        shippingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          address1: '123 Main St',
          city: 'New York',
          state: 'NY',
          postalCode: '10001',
        },
        createdAt: new Date().toISOString(),
      });
      setLoading(false);
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600">Unable to find the specified order.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Thank you for your purchase. Your order has been successfully placed.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-600">Order ID:</span>
                <p className="font-mono text-sm">{order.id}</p>
              </div>
              
              <div>
                <span className="text-sm text-gray-600">Status:</span>
                <p className="text-green-600 font-medium">{order.status}</p>
              </div>
              
              <div>
                <span className="text-sm text-gray-600">Date:</span>
                <p>{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              
              <div>
                <span className="text-sm text-gray-600">Total:</span>
                <p className="text-xl font-bold">${order.total.toFixed(2)}</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-2">Items Ordered:</h3>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.product.name} (x{item.quantity})</span>
                    <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Package className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Shipping Information</h2>
            </div>
            
            <div className="space-y-2">
              <p className="font-medium">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              </p>
              <p>{order.shippingAddress.address1}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </p>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Confirmation Email Sent</p>
                  <p className="text-sm text-blue-700">
                    We've sent a confirmation email with your order details and tracking information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Order Processing</h3>
              <p className="text-sm text-gray-600">
                Your order will be processed within 24 hours and shipped within 2-3 business days.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Tracking Updates</h3>
              <p className="text-sm text-gray-600">
                You'll receive email updates with tracking information once your order ships.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Support</h3>
              <p className="text-sm text-gray-600">
                Need help? Contact our support team for any questions about your order.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/catalog"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            Continue Shopping
          </a>
          <a
            href="/"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
          >
            Back to Home
          </a>
        </div>
      </main>
    </div>
  );
} 