import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../api/api';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_your_stripe_publishable_key');

const CheckoutForm = ({ cart, cartTotal, clearCart }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    shippingAddress: '',
  });

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await orderAPI.createPaymentIntent({
          amount: cartTotal,
          currency: 'usd',
        });
        setClientSecret(response.data.clientSecret);
      } catch (err) {
        setError('Failed to initialize payment. Please try again.');
      }
    };

    if (cartTotal > 0) {
      createPaymentIntent();
    }
  }, [cartTotal]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: formData.customerName,
          email: formData.customerEmail,
          address: {
            line1: formData.shippingAddress,
          },
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Create order
      try {
        const orderData = {
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          shippingAddress: formData.shippingAddress,
          paymentMethod: 'STRIPE',
          items: cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        };

        const orderResponse = await orderAPI.createOrder(orderData);
        await orderAPI.confirmPayment(orderResponse.data.id, paymentIntent.id);

        clearCart();
        navigate('/order-success', { state: { orderId: orderResponse.data.id } });
      } catch (err) {
        setError('Failed to create order. Please try again.');
        setLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-gray-700 font-medium mb-2">Full Name</label>
        <input
          type="text"
          required
          value={formData.customerName}
          onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="John Doe"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">Email</label>
        <input
          type="email"
          required
          value={formData.customerEmail}
          onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="john@example.com"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">Shipping Address</label>
        <textarea
          required
          value={formData.shippingAddress}
          onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          rows="3"
          placeholder="123 Main St, City, Country"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">Card Details</label>
        <div className="p-4 border rounded-lg bg-white">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : `Pay $${cartTotal.toFixed(2)}`}
      </button>
    </form>
  );
};

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">Your cart is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Payment Details</h2>
            <Elements stripe={stripePromise}>
              <CheckoutForm cart={cart} cartTotal={cartTotal} clearCart={clearCart} />
            </Elements>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg mr-4"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between text-xl font-bold text-gray-800">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
