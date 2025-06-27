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

## 🎨 UI Components

### Key Features
- **🔍 SearchHero** - Large search bar with trending suggestions (nature, mountains, ocean, sunset, city, flowers, architecture, space)
- **🖼️ PhotoCard** - Elegant masonry grid with hover effects and author overlays
- **⬆️ ScrollToTop** - Floating button with smooth animations (visible in bottom right)
- **🔐 GoogleAuthPage** - Clean "Welcome back" interface with Google OAuth
- **📱 Responsive Grid** - Adaptive 2-3-4 column layout system
- **👤 Author Cards** - Profile pictures, stats (130 Photos, 38 Likes), and "View Profile" buttons
- **📊 Statistics Panel** - Detailed photo metrics (Views, Downloads, Likes, Published date)

### Design System
- **Colors**: Sophisticated grays with blue gradient accents (#6366F1 to #8B5CF6)
- **Typography**: Inter font with elegant spacing and proper hierarchy
- **Animations**: Smooth 200-300ms transitions for all interactions
- **Shadows**: Multi-layer elegant shadows with subtle depth
- **Glass-morphism**: Backdrop blur effects with transparency
- **Grid Layout**: Masonry system that adapts to image aspect ratios
- **Category Cards**: Colorful gradient backgrounds (green, gray, blue, orange)

## 📸 Screenshots

### Homepage - Hero Section with Search
![Homepage](https://i.imgur.com/homepage-hero.png)
*Beautiful hero section with large search bar, trending suggestions, and elegant gradient backgrounds*

### Photo Grid - Masonry Layout
![Photo Grid](https://i.imgur.com/photo-grid.png)
*Responsive masonry grid layout with smooth hover effects and infinite scroll*

### Photo Detail - Fullscreen View
![Photo Detail](https://i.imgur.com/photo-detail.png)
*Immersive photo detail page with author info, statistics, and download options*

### Authentication - Login Page
![Login Page](https://i.imgur.com/login-page.png)
*Clean and modern login interface with Google OAuth integration*

### Key UI Features
- ✨ **Glass-morphism effects** with backdrop blur
- 🎨 **Elegant gradient backgrounds** and sophisticated shadows
- 📱 **Responsive design** - Perfect on mobile, tablet, and desktop
- 🔍 **Advanced search** with trending suggestions and history
- 🎯 **Smooth animations** and micro-interactions throughout

## 🌟 Main Pages & Features

#### 🏠 **Homepage**
- **Hero Section**: Large title "Beautiful Free Images & Pictures" with gradient text
- **Search Bar**: Prominent search with placeholder suggestions and trending searches
- **Category Grid**: 2-3-4 responsive layout with colorful gradient cards
- **Photo Feed**: Infinite scroll masonry layout with optimized loading

#### 📷 **Photo Grid**
- **Masonry Layout**: Dynamic grid that adapts to different image aspect ratios
- **Hover Effects**: Smooth overlay with author info and action buttons
- **Grid Controls**: Toggle between different column layouts (1-2-3-4 columns)
- **Infinite Scroll**: Seamless loading of more photos as user scrolls

#### 🖼️ **Photo Detail**
- **Fullscreen View**: Large photo display with immersive experience
- **Author Card**: Profile picture, name, follower count, and "View Profile" button
- **Statistics Panel**: Views (361,383), Downloads (3,557), Likes (199)
- **Metadata**: Publication date and photo information
- **Action Buttons**: Download, favorite, and share options

#### 🔐 **Authentication**
- **Clean Login Form**: Email and password fields with "Remember me" option
- **Google OAuth**: "Continue with Google" integration
- **Form Validation**: Real-time validation with helpful error messages
- **Responsive Design**: Works perfectly on all device sizes

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
