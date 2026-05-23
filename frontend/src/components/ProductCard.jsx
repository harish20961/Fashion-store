import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-64 bg-gray-200">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {!product.available && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
              Out of Stock
            </div>
          )}
        </div>
        <div className="p-4">
          <p className="text-sm text-primary-600 font-medium mb-1">{product.category}</p>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-gray-900">${product.price}</span>
            <button
              onClick={handleAddToCart}
              disabled={!product.available}
              className={`p-2 rounded-full ${
                product.available
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              } transition`}
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
