# 📸 Unsplash Clone - Modern Photo Sharing Platform

A beautiful, modern, and responsive web application that recreates the Unsplash experience with stunning UI/UX, advanced search functionality, and seamless photo browsing.

![React](https://img.shields.io/badge/React-18+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3+-blue)
![NestJS](https://img.shields.io/badge/NestJS-10+-red)

## ✨ Key Features

- **Modern UI/UX** - Glass-morphism effects, elegant gradients, smooth animations
- **Advanced Search** - Hero search bar, trending suggestions, search history
- **Responsive Design** - Mobile-first approach (2-3-4 column grid)
- **Google OAuth 2.0** - Secure authentication with beautiful success page
- **Photo Management** - Infinite scroll, fullscreen view, download & favorites
- **Scroll to Top** - Floating button with smooth animations

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

- **SearchHero** - Large search with trending suggestions
- **PhotoCard** - Elegant photo display with hover effects
- **ScrollToTop** - Floating button with smooth animations
- **GoogleAuthSuccessPage** - Beautiful OAuth completion page
- **Responsive Grid** - 2-3-4 column layout system

### Design System

- **Colors**: Sophisticated grays with blue accents
- **Typography**: Inter font with elegant spacing
- **Animations**: Smooth 200-300ms transitions
- **Shadows**: Multi-layer elegant shadows
- **Glass-morphism**: Backdrop blur effects

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
