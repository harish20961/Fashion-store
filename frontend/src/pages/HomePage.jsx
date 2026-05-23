import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../api/api';
import ProductCard from '../components/ProductCard';
import { Shirt, Footprints, Gem } from 'lucide-react';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productAPI.getAvailableProducts();
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    { name: 'CLOTHES', icon: Shirt, color: 'bg-blue-500' },
    { name: 'SHOES', icon: Footprints, color: 'bg-green-500' },
    { name: 'ACCESSORIES', icon: Gem, color: 'bg-purple-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to FashionStore</h1>
          <p className="text-xl mb-8">Discover the latest trends in fashion</p>
          <Link
            to="/products/CLOTHES"
            className="bg-white text-primary-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* Categories */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.name}
                to={`/products/${category.name}`}
                className={`${category.color} text-white p-8 rounded-xl hover:opacity-90 transition`}
              >
                <Icon className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-center">{category.name}</h3>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Featured Products */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
