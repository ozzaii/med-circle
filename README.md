# MedAI Education Platform - POC

A revolutionary medical education platform powered by Gemini 2.5 Flash-Lite AI, featuring premium UI/UX design and intelligent learning capabilities.

## 🚀 Features

### 🧠 AI-Powered Learning
- **Context-aware AI Assistant**: Powered by Gemini 2.5 Flash-Lite for medical education
- **Smart Q&A**: Get instant explanations for complex medical concepts
- **Quiz Generation**: AI-generated practice questions based on your studies
- **Chapter Summaries**: Automated summaries of medical textbook chapters

### 📚 Medical Library
- **Comprehensive Book Collection**: Curated medical textbooks across all specialties
- **Interactive Reader**: Built-in PDF viewer with AI integration
- **Progress Tracking**: Monitor reading progress for each book
- **Smart Search**: Find books by title, author, or medical specialty

### 📊 Progress Analytics
- **Skill Radar Charts**: Visual representation of knowledge across medical fields
- **Study Streaks**: Gamified learning with achievement system
- **Weekly Analytics**: Track study hours and pages read
- **AI-Powered Insights**: Personalized study recommendations

### 🎨 Premium Design
- **Futuristic Medical Theme**: Dark mode with medical-inspired color palette
- **Glass Morphism UI**: Modern, translucent interface elements
- **Smooth Animations**: Framer Motion powered transitions
- **Responsive Design**: Optimized for all screen sizes

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS with custom medical theme
- **AI Integration**: Google Gemini 2.5 Flash-Lite API
- **State Management**: Zustand with persistence
- **Charts**: Recharts for data visualization
- **Routing**: React Router v7
- **Build Tool**: Vite
- **Deployment**: GitHub Pages

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn
- Gemini API key from [Google AI Studio](https://aistudio.google.com/)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/medai-poc.git
cd medai-poc
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file and add your Gemini API key:
```env
VITE_GEMINI_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

## 📦 Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## 🚀 Deployment

### GitHub Pages

1. Update `base` in `vite.config.ts` to match your repository name:
```ts
export default defineConfig({
  base: '/your-repo-name/',
  // ...
})
```

2. Deploy to GitHub Pages:
```bash
npm run deploy
```

### GitHub Actions (Automated)

The project includes a GitHub Actions workflow that automatically deploys to GitHub Pages on push to main branch.

Add your Gemini API key to GitHub Secrets:
1. Go to Settings → Secrets and variables → Actions
2. Add a new secret named `VITE_GEMINI_API_KEY`

## 🔧 Configuration

### Environment Variables
- `VITE_GEMINI_API_KEY`: Your Gemini 2.5 Flash-Lite API key

### Customization
- Theme colors: Edit `tailwind.config.js`
- Medical books data: Update `src/data/books.ts`
- AI system prompt: Modify `src/services/gemini.ts`

## 📱 Features Showcase

### Welcome Screen
- User onboarding with level selection (Student, Resident, Physician, Specialist)
- Premium glassmorphic design with animated background

### Dashboard
- Quick stats overview
- Weekly progress charts
- Recent books carousel
- AI insights panel

### Library
- Grid/List view toggle
- Category filtering
- Progress indicators
- Search functionality

### Reader
- Chapter navigation
- AI-powered text explanations
- Note-taking capabilities
- Zoom controls

### AI Chat
- Natural language queries
- Markdown-formatted responses
- Suggested prompts
- Chat history

### Progress Tracking
- Skill radar chart
- Weekly activity bar chart
- Achievement system
- Study streak tracking

## 🎯 POC Objectives Achieved

✅ Premium, futuristic UI design
✅ Gemini 2.5 Flash-Lite integration
✅ Medical content organization
✅ AI-powered learning features
✅ Progress tracking and analytics
✅ Responsive, production-ready code
✅ GitHub Pages deployment ready

## 🔮 Future Enhancements

- Real PDF integration with PDF.js
- User authentication system
- Backend API for data persistence
- Collaborative study features
- Mobile app version
- Offline mode support
- Multi-language support

## 📄 License

This project is a proof of concept for demonstration purposes.

---

Built with 💙 for revolutionizing medical education through AI