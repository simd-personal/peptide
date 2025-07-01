export interface Peptide {
  id: string;
  name: string;
  use_case: string;
  injection_site: string;
  description: string;
  tags: string[];
  price: number;
  dosage: string;
  cycle_length: string;
  image?: string; // URL or path to product image
}

export interface CartItem {
  peptide: Peptide;
  quantity: number;
}

export interface QuizAnswers {
  goals: string[];
  age: number;
  weight: number;
  gender: string;
  injectionExperience: string;
  healthConditions: string[];
  acknowledgedSideEffects: boolean;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
} 