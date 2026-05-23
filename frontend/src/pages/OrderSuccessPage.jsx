import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Package } from 'lucide-react';

const OrderSuccessPage = () => {
  const location = useLocation();
  const { orderId } = location.state || {};

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
          {orderId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-gray-600">Order ID:</p>
              <p className="text-xl font-bold text-gray-800">{orderId}</p>
            </div>
          )}
          <div className="space-y-4">
            <Link
              to="/"
              className="block w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              Continue Shopping
            </Link>
            <Link
              to="/orders"
              className="block w-full border border-gray-300 text-gray-600 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              View Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
