'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export default function Navigation() {
  const pathname = usePathname();
  const { toggleCart, getTotalItems } = useCart();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Peptide Therapeutics</span>
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              <Link
                href="/"
                className={`text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-blue-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Home
              </Link>
              <Link
                href="/catalog"
                className={`text-sm font-medium transition-colors ${
                  isActive('/catalog') 
                    ? 'text-blue-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Catalog
              </Link>
              <Link
                href="/quiz"
                className={`text-sm font-medium transition-colors ${
                  isActive('/quiz') 
                    ? 'text-blue-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Quiz
              </Link>
              <Link
                href="/legal"
                className={`text-sm font-medium transition-colors ${
                  isActive('/legal') 
                    ? 'text-blue-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Legal
              </Link>
            </nav>
          </div>

          <button
            onClick={toggleCart}
            className="relative flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden sm:inline">Cart</span>
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
} 