'use client';

import { Peptide } from '@/types';
import { X, Plus, Tag } from 'lucide-react';

interface PeptideModalProps {
  peptide: Peptide;
  onClose: () => void;
  onAddToCart: () => void;
}

export default function PeptideModal({ peptide, onClose, onAddToCart }: PeptideModalProps) {
  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">{peptide.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Use Case */}
            <div className="mb-6">
              <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-4 py-2 rounded-full">
                {peptide.use_case}
              </span>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{peptide.description}</p>
            </div>

            {/* Injection Site */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Injection Site</h3>
              <p className="text-gray-700">{peptide.injection_site}</p>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Benefits</h3>
              <div className="flex flex-wrap gap-2">
                {peptide.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Dosage Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Dosage Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Recommended Dosage:</p>
                  <p className="text-sm text-gray-700 font-medium">{peptide.dosage}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Cycle Length:</p>
                  <p className="text-sm text-gray-700 font-medium">{peptide.cycle_length}</p>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Important Information</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Consult with a healthcare professional before use</li>
                <li>• Store in a cool, dry place</li>
                <li>• Follow proper injection protocols</li>
                <li>• Results may vary by individual</li>
                <li>• Keep out of reach of children</li>
              </ul>
            </div>

            {/* Price and Add to Cart */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div>
                <span className="text-3xl font-bold text-gray-900">${peptide.price}</span>
                <span className="text-sm text-gray-500 ml-2">per vial</span>
              </div>
              <button
                onClick={onAddToCart}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 