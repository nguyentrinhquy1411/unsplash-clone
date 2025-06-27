# 📸 Unsplash Clone - Modern Photo Sharing Platform

A beautiful, modern, and responsive web application that recreates the Unsplash experience with stunning UI/UX, advanced search functionality, and seamless photo browsing.

![React](https://img.shields.io/badge/React-18+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3+-blue)
![NestJS](https://img.shields.io/badge/NestJS-10+-red)

## ✨ Key Features

- **🎨 Modern UI/UX** - Glass-morphism effects, elegant gradients, smooth animations
- **🔍 Advanced Search** - Hero search bar with trending suggestions (nature, mountains, ocean, city, etc.)
- **📱 Responsive Design** - Mobile-first approach with 2-3-4 column grid layout
- **🔐 Google OAuth 2.0** - Secure authentication with beautiful "Welcome back" interface
- **🖼️ Photo Management** - Infinite scroll masonry grid, fullscreen view, download & favorites
- **📊 Photo Statistics** - Views, downloads, likes, and detailed author information
- **⬆️ Scroll to Top** - Floating button with smooth animations
- **🎯 Category Navigation** - Organized browsing by themes (Nature, Architecture, Travel, etc.)
- **👤 User Profiles** - Author cards with photo count and follower statistics

## 🏗️ Tech Stack

### Frontend

- **React 18+** with TypeScript
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **React Router DOM** - Client-side routing
- **Lucide React** - Modern icons

### Backend

- **NestJS** with TypeScript
- **Prisma ORM** - Database toolkit
- **PostgreSQL** - Database
- **JWT & Passport.js** - Authentication
- **Google OAuth 2.0** - Social login

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Yarn package manager
- PostgreSQL database
- Google OAuth credentials

### Installation

1. **Clone Repository**

```bash
git clone https://github.com/yourusername/unsplash-clone.git
cd unsplash-clone
```

2. **Backend Setup**

```bash
cd BE
yarn install

# Environment setup
cp .env.example .env
# Configure your database URL, JWT secrets, and Google OAuth credentials

# Database setup
yarn prisma migrate dev
yarn prisma generate

# Start development server
yarn start:dev
```

3. **Frontend Setup**

```bash
cd ../FE
yarn install

# Start development server
yarn dev
```

4. **Open Application**

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## 🔧 Environment Variables

### Backend (.env)

```env
DATABASE_URL="postgresql://username:password@localhost:5432/unsplash_clone"
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
JWT_REFRESH_SECRET="your-refresh-secret-key-min-32-chars"
GOOGLE_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3001/api/auth/google/callback"
FRONTEND_URL="http://localhost:5173"
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3001/api
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id
```

## 📁 Project Structure

```
unsplash-clone/
├── BE/                           # Backend (NestJS)
│   ├── src/
│   │   ├── auth/                # Authentication module
│   │   ├── photos/              # Photos management
│   │   ├── prisma/              # Database service
│   │   └── main.ts              # Application entry
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema
│   │   └── migrations/          # Database migrations
│   └── package.json
│
├── FE/                           # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   │   ├── layout/          # Header, MainLayout
│   │   │   ├── photos/          # PhotoCard, PhotoGrid
│   │   │   ├── SearchHero.tsx   # Main search component
│   │   │   └── ScrollToTop.tsx  # Scroll to top button
│   │   ├── pages/               # Page components
│   │   ├── contexts/            # React contexts
│   │   ├── hooks/               # Custom hooks
│   │   └── services/            # API services
│   └── package.json
│
└── README.md
```

## 🛠️ Development Scripts

### Frontend

```bash
yarn dev          # Start dev server
yarn build        # Production build
yarn preview      # Preview build
yarn lint         # ESLint check
```

### Backend

```bash
yarn start:dev    # Development mode
yarn build        # Production build
yarn start:prod   # Production server
yarn prisma:migrate   # Database migrations
yarn prisma:studio    # Prisma Studio GUI
```

## 🎨 UI Components & Design System

### 🔧 **Core Components**
- **🔍 SearchHero** - Large search with real-time trending suggestions (nature, mountains, ocean, sunset, city, flowers, **architecture**, space)
- **🖼️ PhotoCard** - Masonry grid cards with diverse content (landscapes, wildlife, vehicles, portraits)
- **⬆️ ScrollToTop** - Elegant floating button (visible in bottom-right corner)
- **🔐 AuthPages** - "Welcome back" login with Google OAuth integration
- **📱 GridControls** - Layout toggle buttons (1x1, 2x2, 3x3) for user preference
- **👤 AuthorCards** - Profile cards showing "130 Photos, 38 Likes" with blue "View Profile" CTAs
- **📊 StatsPanel** - Detailed metrics (361,383 Views, 3,557 Downloads, 199 Likes, 13/09/2024)

### 🎨 **Visual Design Language**
- **Color Palette**: 
  - Primary: Sophisticated grays (#F8F9FA to #212529)
  - Accent: Blue gradient (#6366F1 to #8B5CF6) for "Images" text and buttons
  - Success: Emerald tones for positive actions
  - Backgrounds: Subtle gradients with blur effects
- **Typography**: 
  - Font: Inter with professional weight hierarchy
  - Hero: Bold 64px+ with tight letter spacing
  - Body: 16px with 1.6 line height for readability
- **Spacing**: Consistent 8px grid system with generous whitespace
- **Animations**: 
  - 200-300ms smooth transitions for all interactions
  - Hover states with subtle scale and shadow changes
  - Trending tag rotation every 3 seconds
- **Layout**:
  - Masonry grid system adapting to image aspect ratios
  - Responsive breakpoints: Mobile (1 col) → Tablet (2-3 cols) → Desktop (4+ cols)
  - Glass-morphism effects with backdrop-blur and transparency

## 📸 Screenshots

### 🏠 Homepage - Hero Section with Search
![Homepage Hero](https://github.com/user-attachments/assets/homepage-hero-section.png)
*Beautiful hero section featuring "Beautiful Free Images & Pictures" title, prominent search bar with trending suggestions (nature, mountains, ocean, sunset, city, flowers, architecture, space), and elegant gradient backgrounds with blur effects*

### 📷 Photo Grid - Masonry Layout  
![Photo Grid](https://github.com/user-attachments/assets/photo-grid-masonry.png)
*Responsive masonry grid layout showcasing diverse photos with smooth hover effects, infinite scroll, and grid view controls (1-2-3 column toggle) in the top right*

### 🖼️ Photo Detail - Fullscreen Experience
![Photo Detail](https://github.com/user-attachments/assets/photo-detail-fullscreen.png)
*Immersive photo detail page featuring "A mountain is in the distance with a body of water in front of it" by Sichen Xiang (@inseason), complete with author profile (130 Photos, 38 Likes), detailed statistics (361,383 Views, 3,557 Downloads, 199 Likes), publication date (13/09/2024), and prominent download button*

### 🔐 Authentication - Welcome Back
![Login Page](https://github.com/user-attachments/assets/login-welcome-back.png)
*Clean and modern "Welcome back" login interface with email/password fields, "Remember me" checkbox, "Continue with Google" OAuth button, and "Sign up for free" link for new users*

### ✨ Key UI Features Showcase
- 🎨 **Glass-morphism effects** with backdrop blur creating depth
- � **Elegant gradient backgrounds** and sophisticated shadow system  
- 📱 **Responsive design** - Perfect experience on mobile, tablet, and desktop
- 🔍 **Advanced search functionality** with trending suggestions and search history
- 🎯 **Smooth animations** and micro-interactions throughout the interface
- 📊 **Detailed statistics** showing real engagement metrics
- 👤 **Author profiles** with follower counts and portfolio links

## 🌟 Main Pages & Features

#### 🏠 **Homepage - Hero Experience**
- **Hero Title**: Large, bold "Beautiful Free Images & Pictures" with gradient blue accent on "Images"
- **Subtitle**: "The internet's source of freely-usable images. Powered by creators everywhere."
- **Search Bar**: Prominent search with dynamic placeholder "Try 'architecture' or search for anything..."
- **Trending Tags**: Interactive badges (nature, mountains, ocean, sunset, city, flowers, **architecture**, space)
- **Category Navigation**: Top navigation with emoji icons (🏠 Home, 🌿 Nature, 🏛️ Architecture, ✈️ Travel, 🍽️ Food, 💻 Technology, ⚽ Sports, 🎨 Art, 👥 People)

#### 📷 **Photo Grid - Dynamic Layout**
- **Masonry System**: Adaptive grid that perfectly fits different image aspect ratios
- **Photo Variety**: Mountains, penguins, cars, clouds, fashion - showcasing content diversity
- **View Controls**: Top-right grid toggle buttons (1x1, 2x2, 3x3) for layout customization
- **Hover States**: Smooth overlay effects revealing photo metadata
- **Infinite Scroll**: Seamless content loading with performance optimization

#### 🖼️ **Photo Detail - Complete Experience**
- **Hero Image**: Full-width landscape photo "A mountain is in the distance with a body of water in front of it"
- **Author Profile**: Sichen Xiang (@inseason) with avatar, "130 Photos", "38 Likes", and blue "View Profile" button
- **Engagement Stats**: 
  - 👁️ Views: **361,383**
  - ⬇️ Downloads: **3,557** 
  - ❤️ Likes: **199**
  - 📅 Published: **13/09/2024**
- **Actions**: Prominent black "Download" button and heart favorite icon

#### 🔐 **Authentication - User-Friendly**
- **Welcome Message**: "Welcome back" with "Sign in to continue your journey"
- **Form Fields**: Email address and password with clean styling
- **Convenience**: "Remember me" checkbox and "Forgot password?" link
- **OAuth Integration**: Google sign-in with recognizable branding
- **Registration**: "Don't have an account? Sign up for free" conversion prompt

## 🚀 Deployment

### Quick Deploy

1. **Frontend**: Build with `yarn build` and deploy to Vercel/Netlify
2. **Backend**: Deploy to Railway/Heroku with PostgreSQL
3. **Database**: Run `yarn prisma migrate deploy`
4. **Environment**: Set all required variables

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/name`
3. Commit changes: `git commit -m 'feat: add feature'`
4. Push to branch: `git push origin feature/name`
5. Open Pull Request

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Credits

- [Unsplash](https://unsplash.com) - Design inspiration
- [Tailwind CSS](https://tailwindcss.com) - Styling framework
- [Lucide](https://lucide.dev) - Icon library
- [Prisma](https://prisma.io) - Database toolkit

---

**Built with ❤️ using React, TypeScript, Tailwind CSS, and NestJS**
