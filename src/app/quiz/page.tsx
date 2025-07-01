'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Peptide, QuizAnswers } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { ArrowLeft, ArrowRight, Check, Plus } from 'lucide-react';
import ChatAssistant from '@/components/ChatAssistant';
import Navigation from '@/components/Navigation';

const GOALS = [
  { id: 'fat_loss', label: 'Fat Loss', icon: '🔥' },
  { id: 'muscle_growth', label: 'Muscle Growth', icon: '💪' },
  { id: 'healing', label: 'Healing & Recovery', icon: '🩹' },
  { id: 'libido', label: 'Libido Enhancement', icon: '❤️' },
  { id: 'anti_aging', label: 'Anti-Aging', icon: '⏰' },
  { id: 'energy', label: 'Energy & Performance', icon: '⚡' },
];

const GENDERS = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'other', label: 'Other' },
];

const EXPERIENCE_LEVELS = [
  { id: 'none', label: 'No experience' },
  { id: 'beginner', label: 'Beginner (1-6 months)' },
  { id: 'intermediate', label: 'Intermediate (6+ months)' },
  { id: 'advanced', label: 'Advanced (1+ years)' },
];

export default function QuizPage() {
  const router = useRouter();
  const { addItem } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [peptides, setPeptides] = useState<Peptide[]>([]);
  const [recommendations, setRecommendations] = useState<Peptide[]>([]);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswers>({
    goals: [],
    age: 0,
    weight: 0,
    gender: '',
    injectionExperience: '',
    healthConditions: [],
  });

  useEffect(() => {
    const loadPeptides = async () => {
      try {
        const response = await fetch('/data/peptides.json');
        const data = await response.json();
        setPeptides(data);
      } catch (error) {
        console.error('Error loading peptides:', error);
      }
    };

    loadPeptides();
  }, []);

  const handleGoalToggle = (goalId: string) => {
    setAnswers(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(g => g !== goalId)
        : [...prev.goals, goalId]
    }));
  };

  const handleInputChange = (field: keyof QuizAnswers, value: string | number | string[]) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = async () => {
    if (currentStep === 1 && answers.goals.length === 0) return;
    if (currentStep === 2 && (!answers.age || !answers.weight)) return;
    if (currentStep === 3 && !answers.gender) return;
    if (currentStep === 4 && !answers.injectionExperience) return;
    
    setIsNextLoading(true);
    
    // Add a small delay for visual feedback
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (currentStep === 4) {
      generateRecommendations();
    }
    
    setCurrentStep(prev => prev + 1);
    setIsNextLoading(false);
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const generateRecommendations = () => {
    const goalTags = answers.goals.map(goal => {
      switch (goal) {
        case 'fat_loss': return ['fat loss', 'weight loss', 'stubborn fat'];
        case 'muscle_growth': return ['muscle', 'gh', 'growth', 'strength'];
        case 'healing': return ['healing', 'recovery', 'injury', 'regeneration'];
        case 'libido': return ['libido', 'sexual health', 'arousal'];
        case 'anti_aging': return ['anti-aging', 'gh', 'longevity'];
        case 'energy': return ['gh', 'muscle', 'performance', 'strength'];
        default: return [];
      }
    }).flat();

    const matchedPeptides = peptides.filter(peptide =>
      peptide.tags.some(tag => goalTags.includes(tag))
    );

    // Sort by relevance (number of matching tags)
    const scoredPeptides = matchedPeptides.map(peptide => ({
      peptide,
      score: peptide.tags.filter(tag => goalTags.includes(tag)).length
    }));

    scoredPeptides.sort((a, b) => b.score - a.score);
    setRecommendations(scoredPeptides.slice(0, 3).map(item => item.peptide));
  };

  const handleAddToCart = (peptide: Peptide) => {
    addItem(peptide);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-black mb-4">What are your primary goals?</h2>
            <p className="text-base text-black mb-6">Select all that apply to help us recommend the best peptides for you.</p>
            <div className="grid md:grid-cols-2 gap-4">
              {GOALS.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => handleGoalToggle(goal.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    answers.goals.includes(goal.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{goal.icon}</span>
                    <span className="font-medium text-black">{goal.label}</span>
                    {answers.goals.includes(goal.id) && (
                      <Check className="w-5 h-5 text-blue-500 ml-auto" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-black mb-4">Basic Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2">Age</label>
                <input
                  type="number"
                  value={answers.age || ''}
                  onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  placeholder="Enter your age"
                  min="18"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Weight (lbs)</label>
                <input
                  type="number"
                  value={answers.weight || ''}
                  onChange={(e) => handleInputChange('weight', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  placeholder="Enter your weight"
                  min="80"
                  max="400"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-black mb-4">Gender</h2>
            <p className="text-base text-black mb-6">This helps us provide more personalized recommendations.</p>
            <div className="space-y-3">
              {GENDERS.map((gender) => (
                <button
                  key={gender.id}
                  onClick={() => handleInputChange('gender', gender.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    answers.gender === gender.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-black">{gender.label}</span>
                    {answers.gender === gender.id && (
                      <Check className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-black mb-4">Injection Experience</h2>
            <p className="text-base text-black mb-6">This helps us recommend appropriate peptides and provide proper guidance.</p>
            <div className="space-y-3">
              {EXPERIENCE_LEVELS.map((level) => (
                <button
                  key={level.id}
                  onClick={() => handleInputChange('injectionExperience', level.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    answers.injectionExperience === level.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-black">{level.label}</span>
                    {answers.injectionExperience === level.id && (
                      <Check className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-black mb-4">Your Personalized Recommendations</h2>
            <p className="text-base text-black mb-6">
              Based on your goals and profile, here are our top recommendations:
            </p>
            <div className="space-y-4">
              {recommendations.map((peptide) => (
                <div key={peptide.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-black">{peptide.name}</h3>
                      <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mt-2">
                        {peptide.use_case}
                      </span>
                    </div>
                    <button
                      onClick={() => handleAddToCart(peptide)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                                     <p className="text-base text-black mb-4">{peptide.description}</p>
                   <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-4">
                     <div>
                       <strong>Injection Site:</strong> {peptide.injection_site}
                     </div>
                     <div>
                       <strong>Dosage:</strong> {peptide.dosage}
                     </div>
                   </div>
                   <div className="text-lg font-bold text-black mb-4">
                     ${peptide.price}
                   </div>
                </div>
              ))}
            </div>
            <div className="text-center pt-6">
              <button
                onClick={() => router.push('/catalog')}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                Browse All Products
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep} of 5
              </span>
              <span className="text-sm text-gray-500">
                {Math.round((currentStep / 5) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderStep()}

        {/* Navigation */}
        {currentStep < 5 && (
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <button
              onClick={nextStep}
              disabled={isNextLoading}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 transform ${
                isNextLoading
                  ? 'bg-blue-500 text-white scale-95 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95'
              }`}
            >
              {isNextLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{currentStep === 4 ? 'Get Recommendations' : 'Next'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </main>

      {/* Chat Assistant */}
      <ChatAssistant />
    </div>
  );
} 