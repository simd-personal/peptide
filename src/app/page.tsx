'use client';

import Link from 'next/link';
import { ShoppingCart, Brain, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Peptide Therapeutics</span>
            </div>
            <Link 
              href="/catalog" 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Catalog</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Discover the Power of
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}Therapeutic Peptides
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Premium quality peptides for healing, muscle growth, weight loss, and enhanced performance. 
            Backed by science, trusted by professionals.
          </p>
        </div>

        {/* Dual Onboarding Flow */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* I Know What I Want */}
          <Link href="/catalog">
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 cursor-pointer">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-xl mb-6 group-hover:bg-blue-200 transition-colors">
                <ShoppingCart className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">I Know What I Want</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Browse our complete catalog of therapeutic peptides. Find exactly what you need with detailed information about each product.
              </p>
              <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                <span>Browse Catalog</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Guide Me */}
          <Link href="/quiz">
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-purple-300 cursor-pointer">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-xl mb-6 group-hover:bg-purple-200 transition-colors">
                <Brain className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Guide Me</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Not sure where to start? Take our personalized quiz and get recommendations based on your goals and needs.
              </p>
              <div className="flex items-center text-purple-600 font-semibold group-hover:text-purple-700 transition-colors">
                <span>Take Quiz</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 font-bold">✓</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Quality</h3>
            <p className="text-gray-600">Pharmaceutical-grade peptides with third-party testing</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 font-bold">⚡</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Shipping</h3>
            <p className="text-gray-600">Discrete packaging with expedited delivery options</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-600 font-bold">💬</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Support</h3>
            <p className="text-gray-600">24/7 customer support and consultation services</p>
          </div>
        </div>
      </main>
    </div>
  );
}
