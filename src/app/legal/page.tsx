'use client';

import Navigation from '@/components/Navigation';
import { Shield, AlertTriangle, FileText, Scale } from 'lucide-react';

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Scale className="w-12 h-12 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Legal Information & Disclaimers</h1>
            <p className="text-gray-600">Important information about our services and your responsibilities</p>
          </div>

          {/* Medical Disclaimer */}
          <section className="mb-8 p-6 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-semibold text-red-800 mb-3">Medical Disclaimer</h2>
                <div className="text-red-700 space-y-3">
                  <p><strong>IMPORTANT:</strong> The information provided on this website is for educational purposes only and is not intended as medical advice.</p>
                  <p>Peptides are powerful compounds that can have significant effects on the body. We strongly recommend consulting with a qualified healthcare professional before using any peptide products.</p>
                  <p>Our products are sold for research purposes only. We do not guarantee any specific results, and individual responses may vary.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Liability Disclaimer */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="w-6 h-6 text-blue-600 mr-2" />
              Liability Disclaimer
            </h2>
            <div className="space-y-4 text-gray-700">
              <p><strong>LIMITATION OF LIABILITY:</strong> By purchasing and using our products, you acknowledge and agree that:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You are using these products at your own risk</li>
                <li>We are not responsible for any adverse effects, side effects, or health complications</li>
                <li>We do not provide medical advice or treatment</li>
                <li>You are responsible for proper storage, handling, and administration of products</li>
                <li>You will consult with healthcare professionals before use</li>
                <li>You understand that results may vary and are not guaranteed</li>
              </ul>
              <p><strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW:</strong> We shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from your use of our products or services.</p>
            </div>
          </section>

          {/* Terms of Service */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-6 h-6 text-blue-600 mr-2" />
              Terms of Service
            </h2>
            <div className="space-y-4 text-gray-700">
              <h3 className="text-lg font-semibold text-gray-900">1. Product Use</h3>
              <p>All products are sold for research purposes only. You must be 18 years or older to purchase.</p>
              
              <h3 className="text-lg font-semibold text-gray-900">2. Medical Consultation</h3>
              <p>We require you to consult with a healthcare professional before using any peptide products. We reserve the right to refuse service if we believe you are not following proper medical guidance.</p>
              
              <h3 className="text-lg font-semibold text-gray-900">3. Product Quality</h3>
              <p>While we strive to provide high-quality products, we cannot guarantee purity, potency, or effectiveness. Products are sold "as is" without warranties.</p>
              
              <h3 className="text-lg font-semibold text-gray-900">4. User Responsibility</h3>
              <p>You are responsible for:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Proper storage and handling of products</li>
                <li>Following dosage and administration guidelines</li>
                <li>Monitoring for adverse effects</li>
                <li>Seeking medical attention if needed</li>
                <li>Compliance with local laws and regulations</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-gray-900">5. Indemnification</h3>
              <p>You agree to indemnify and hold harmless our company, its officers, employees, and agents from any claims, damages, or expenses arising from your use of our products.</p>
            </div>
          </section>

          {/* Privacy Policy */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Privacy Policy</h2>
            <div className="space-y-4 text-gray-700">
              <p>We respect your privacy and are committed to protecting your personal information. We collect only necessary information for order processing and customer service.</p>
              <p>We do not share your personal information with third parties except as required by law or for order fulfillment.</p>
              <p>All medical information shared with our AI assistant is for educational purposes only and is not stored permanently.</p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="text-xl font-semibold text-blue-900 mb-3">Contact Information</h2>
            <div className="text-blue-800 space-y-2">
              <p><strong>For Medical Questions:</strong> Please consult with your healthcare provider</p>
              <p><strong>For Product Questions:</strong> Contact our customer service team</p>
              <p><strong>For Legal Inquiries:</strong> Contact our legal department</p>
            </div>
          </section>

          {/* Acknowledgment */}
          <section className="p-6 bg-gray-100 border border-gray-300 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Acknowledgment</h2>
            <p className="text-gray-700">
              By using our website and purchasing our products, you acknowledge that you have read, understood, and agree to all terms and conditions outlined in this legal document. 
              If you do not agree with any part of these terms, please do not use our services or purchase our products.
            </p>
          </section>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            <p>This document is subject to change without notice.</p>
          </div>
        </div>
      </main>
    </div>
  );
} 