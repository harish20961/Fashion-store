import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Shirt, Footprints } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Header = () => {
  const { cartCount } = useCart();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Shirt className="h-8 w-8 text-primary-600" />
            <span className="text-2xl font-bold text-gray-800">FashionStore</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-primary-600 transition">
              Home
            </Link>
            <Link to="/products/CLOTHES" className="text-gray-600 hover:text-primary-600 transition">
              Clothes
            </Link>
            <Link to="/products/SHOES" className="text-gray-600 hover:text-primary-600 transition">
              Shoes
            </Link>
            <Link to="/products/ACCESSORIES" className="text-gray-600 hover:text-primary-600 transition">
              Accessories
            </Link>
          </nav>

          <Link to="/cart" className="relative">
            <ShoppingCart className="h-6 w-6 text-gray-600 hover:text-primary-600 transition" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
