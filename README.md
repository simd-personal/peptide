# Peptide Therapeutics Web App

A modern, fully functional web application for a peptide company built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

### Core Functionality
- **Dual Onboarding Flow**: Homepage with two main paths - direct catalog browsing or guided quiz
- **Peptide Catalog**: Complete product listing with detailed information and shopping cart
- **Interactive Quiz**: Multi-step questionnaire for personalized peptide recommendations
- **AI Chat Assistant**: OpenAI-powered chatbot for customer support and guidance
- **Shopping Cart**: Full cart functionality with quantity management and checkout

### Technical Features
- **Modern UI/UX**: Clean, responsive design with smooth animations
- **TypeScript**: Full type safety throughout the application
- **State Management**: React Context for cart state management
- **API Integration**: OpenAI API for intelligent chat assistance
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI**: OpenAI API
- **State Management**: React Context API

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # OpenAI chat API
│   │   ├── catalog/
│   │   │   └── page.tsx              # Product catalog page
│   │   ├── quiz/
│   │   │   └── page.tsx              # Quiz flow page
│   │   ├── data/
│   │   │   └── peptides.json         # Peptide product data
│   │   ├── globals.css               # Global styles
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Homepage
│   ├── components/
│   │   ├── CartDrawer.tsx            # Shopping cart component
│   │   ├── ChatAssistant.tsx         # AI chat component
│   │   └── PeptideModal.tsx          # Product detail modal
│   ├── contexts/
│   │   └── CartContext.tsx           # Cart state management
│   └── types/
│       └── index.ts                  # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd peptides
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with your OpenAI API key:
```
OPENAI_API_KEY=your_openai_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Pages & Features

### Homepage (`/`)
- Hero section with company branding
- Dual onboarding flow:
  - "I Know What I Want" → Direct to catalog
  - "Guide Me" → Start quiz flow
- Feature highlights section

### Catalog Page (`/catalog`)
- Grid layout of all peptide products
- Product cards with key information
- "More Info" modal with detailed product information
- Shopping cart integration
- Add to cart functionality

### Quiz Page (`/quiz`)
- Multi-step questionnaire:
  1. Goal selection (fat loss, muscle growth, healing, etc.)
  2. Basic information (age, weight)
  3. Gender selection
  4. Injection experience level
- AI-powered recommendations based on answers
- Direct "Add to Cart" from recommendations

### AI Chat Assistant
- Floating chat button (bottom-right)
- OpenAI GPT-3.5-turbo integration
- Pre-seeded with peptide knowledge
- Real-time conversation interface
- Available on quiz page and throughout the app

## 🛒 Shopping Cart Features

- **Add/Remove Items**: Full cart management
- **Quantity Control**: Increment/decrement quantities
- **Real-time Updates**: Live cart state across all pages
- **Cart Drawer**: Slide-out cart interface
- **Total Calculation**: Automatic price calculations

## 🧬 Peptide Data Structure

Each peptide in `peptides.json` includes:
- `id`: Unique identifier
- `name`: Product name
- `use_case`: Primary use case
- `injection_site`: Administration instructions
- `description`: Detailed product description
- `tags`: Array of benefit tags for matching

## 🔧 Customization

### Adding New Peptides
1. Add new entries to `src/app/data/peptides.json`
2. Follow the existing data structure
3. Include relevant tags for quiz matching

### Modifying Quiz Logic
- Update goal-to-tag mapping in `src/app/quiz/page.tsx`
- Modify recommendation algorithm as needed

### Styling Changes
- All styles use Tailwind CSS classes
- Global styles in `src/app/globals.css`
- Component-specific styles inline

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms
- Build: `npm run build`
- Start: `npm start`
- Ensure environment variables are set

## 🔒 Security Notes

- OpenAI API key is included in the code for demo purposes
- In production, use environment variables
- Consider rate limiting for chat API
- Implement proper authentication for admin features

## 📄 License

This project is for demonstration purposes. Please ensure compliance with local regulations regarding peptide sales and medical advice.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For questions or issues, please refer to the code comments or create an issue in the repository.
