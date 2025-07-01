'use client';

import { useState, useEffect } from 'react';
import { Peptide } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { Info, X, Plus, Search, Filter } from 'lucide-react';
import CartDrawer from '@/components/CartDrawer';
import PeptideModal from '@/components/PeptideModal';
import Navigation from '@/components/Navigation';

export default function CatalogPage() {
  const [peptides, setPeptides] = useState<Peptide[]>([]);
  const [filteredPeptides, setFilteredPeptides] = useState<Peptide[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeptide, setSelectedPeptide] = useState<Peptide | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUseCase, setSelectedUseCase] = useState('');
  const { addItem } = useCart();

  const useCases = [
    'Healing & Recovery',
    'Growth Hormone / Muscle',
    'Weight Loss',
    'Libido Enhancement',
    'Growth Hormone / Appetite',
    'Growth Hormone',
    'Tanning & Libido',
    'Fat Loss',
    'Immune Support',
    'Anti-Aging'
  ];

  useEffect(() => {
    const loadPeptides = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        // Map DB fields to Peptide type for compatibility
        const peptides = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          use_case: p.useCase,
          injection_site: p.injectionSite,
          description: p.description,
          tags: Array.isArray(p.tags) ? p.tags : JSON.parse(p.tags),
          price: p.price,
          dosage: p.dosage,
          cycle_length: p.cycleLength,
          image: p.image,
        }));
        setPeptides(peptides);
        setFilteredPeptides(peptides);
      } catch (error) {
        console.error('Error loading peptides:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPeptides();
  }, []);

  useEffect(() => {
    let filtered = peptides;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(peptide =>
        peptide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        peptide.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        peptide.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by use case
    if (selectedUseCase) {
      filtered = filtered.filter(peptide => peptide.use_case === selectedUseCase);
    }

    setFilteredPeptides(filtered);
  }, [peptides, searchTerm, selectedUseCase]);

  const handleAddToCart = (peptide: Peptide) => {
    addItem(peptide);
  };

  const handleMoreInfo = (peptide: Peptide) => {
    setSelectedPeptide(peptide);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedUseCase('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading peptides...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Peptide Catalog</h1>
          <p className="text-gray-600">Browse our complete selection of therapeutic peptides</p>
        </div>

                  {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search peptides by name, description, or benefits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">Filter by:</span>
              </div>
              
              <select
                value={selectedUseCase}
                onChange={(e) => setSelectedUseCase(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
              >
                <option value="">All Use Cases</option>
                {useCases.map((useCase) => (
                  <option key={useCase} value={useCase}>
                    {useCase}
                  </option>
                ))}
              </select>

              {(searchTerm || selectedUseCase) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Clear filters</span>
                </button>
              )}
            </div>

            {/* Results count */}
            <div className="text-sm text-gray-700">
              Showing {filteredPeptides.length} of {peptides.length} peptides
            </div>
          </div>

        {/* Peptides Grid */}
        {filteredPeptides.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No peptides found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPeptides.map((peptide) => (
              <div key={peptide.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{peptide.name}</h3>
                    <button
                      onClick={() => handleMoreInfo(peptide)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Info className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="mb-4">
                    <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mb-2">
                      {peptide.use_case}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-3">{peptide.description}</p>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Injection Site:</p>
                    <p className="text-sm text-gray-700">{peptide.injection_site}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Dosage:</p>
                    <p className="text-sm text-gray-700 font-medium">{peptide.dosage}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">${peptide.price}</span>
                    <button
                      onClick={() => handleAddToCart(peptide)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Peptide Modal */}
      {selectedPeptide && (
        <PeptideModal
          peptide={selectedPeptide}
          onClose={() => setSelectedPeptide(null)}
          onAddToCart={() => {
            handleAddToCart(selectedPeptide);
            setSelectedPeptide(null);
          }}
        />
      )}
    </div>
  );
} 