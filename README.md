# 📸 Unsplash Clone - Modern Photo Sharing Platform

A beautiful, modern, and responsive web application that recreates the Unsplash experience with stunning UI/UX, advanced search functionality, and seamless photo browsing.

![Unsplash Clone](https://img.shields.io/badge/Status-Active%20Development-brightgreen)
![React](https://img.shields.io/badge/React-18+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3+-blue)
![NestJS](https://img.shields.io/badge/NestJS-10+-red)

## ✨ Key Features

### 🎨 **Modern UI/UX Design**

- **Glass-morphism effects** with backdrop blur and transparency
- **Elegant gradient backgrounds** and sophisticated shadow system
- **Inter font typography** for professional look
- **Smooth animations** and micro-interactions throughout
- **Responsive design** - Perfect experience on mobile, tablet, and desktop
- **Modern color palette** with gray-based elegant design

### 🔍 **Advanced Search System**

- **Hero search bar** prominently displayed in homepage
- **Search history** with local storage (last 10 searches)
- **Trending searches** with automatic rotation animation
- **Real-time dropdown suggestions** with smooth animations
- **Category-based browsing** with beautiful gradient cards
- **Responsive search** - Compact header search + prominent hero search

### 📱 **Responsive Grid System**

- **Mobile-first approach** with adaptive layout:
  - **Mobile (< 768px)**: 2 columns
  - **Tablet (768px - 1024px)**: 3 columns
  - **Desktop (> 1024px)**: 4 columns
- **Aspect-ratio cards** for consistent visual hierarchy
- **Touch-friendly interactions** on mobile devices

### 🔐 **Authentication & Security**

- **Google OAuth 2.0** integration with beautiful success page
- **JWT token management** with automatic refresh
- **Protected routes** and user session handling
- **Secure API endpoints** with proper authorization
- **User profile management** and preferences

### 🖼️ **Photo Management**

- **Infinite scroll** photo grid with lazy loading
- **Photo detail modal** with fullscreen view capability
- **Download functionality** with high-resolution options
- **Favorites system** for bookmarking photos
- **Photo statistics** (views, downloads, likes, author info)
- **Optimized image loading** for better performance

## 🏗️ Tech Stack

### Frontend Stack

- **React 18+** - Latest React with Hooks, Suspense, and Concurrent Features
- **TypeScript 5+** - Full type safety and modern JS features
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS 3+** - Utility-first CSS with custom design system
- **React Router DOM** - Client-side routing with protected routes
- **React Query/TanStack Query** - Server state management and caching
- **Lucide React** - Modern, consistent icon library
- **React Hook Form** - Performant form validation

### Backend Stack

- **NestJS 10+** - Progressive Node.js framework with decorators
- **TypeScript** - End-to-end type safety
- **Prisma ORM** - Type-safe database toolkit with migrations
- **PostgreSQL** - Robust relational database
- **JWT & Passport.js** - Authentication and authorization
- **Google OAuth 2.0** - Social login integration
- **Swagger/OpenAPI** - API documentation

### Development Tools

## 🚀 Quick Start Guide

### Prerequisites

- **Node.js 18+** and npm/yarn
- **PostgreSQL** database (local or cloud)
- **Google OAuth credentials** for authentication

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/unsplash-clone.git
cd unsplash-clone
```

### 2. Backend Setup

```bash
cd BE
npm install

# Environment configuration
cp .env.example .env
# Configure your database URL, JWT secrets, and Google OAuth credentials

# Database setup
npx prisma migrate dev --name init
npx prisma generate

# Start development server
npm run start:dev
# Backend runs on http://localhost:3001
```

### 3. Frontend Setup

```bash
cd ../FE
npm install

# Start development server
npm run dev
# Frontend runs on http://localhost:5173
```

### 4. Environment Variables

#### Backend (.env)

```env
DATABASE_URL="postgresql://username:password@localhost:5432/unsplash_clone"
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
JWT_REFRESH_SECRET="your-refresh-secret-key-min-32-chars"
GOOGLE_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3001/api/auth/google/callback"
FRONTEND_URL="http://localhost:5173"
```

#### Frontend (.env)

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
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/      # JWT & Google OAuth strategies
│   │   │   └── guards/          # Auth guards
│   │   ├── photos/              # Photos management
│   │   │   ├── photos.controller.ts
│   │   │   ├── photos.service.ts
│   │   │   └── dto/             # Data transfer objects
│   │   ├── prisma/              # Database service
│   │   │   ├── prisma.module.ts
│   │   │   └── prisma.service.ts
│   │   └── main.ts              # Application entry point
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema
│   │   └── migrations/          # Database migrations
│   └── package.json
│
├── FE/                           # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   │   ├── layout/          # Layout components
│   │   │   │   ├── Header.tsx   # Main navigation with search
│   │   │   │   └── MainLayout.tsx
│   │   │   ├── photos/          # Photo-related components
│   │   │   │   ├── PhotoCard.tsx
│   │   │   │   ├── PhotoGrid.tsx
│   │   │   │   └── InfinitePhotoGrid.tsx
│   │   │   ├── ui/              # Shadcn/ui components
│   │   │   ├── SearchHero.tsx   # Main search component
│   │   │   └── LoadingSpinner.tsx
│   │   ├── pages/               # Page components
│   │   │   ├── HomePage.tsx     # Landing page with hero
│   │   │   ├── LoginPage.tsx    # Authentication
│   │   │   ├── PhotoDetailPage.tsx
│   │   │   └── GoogleAuthSuccessPage.tsx
│   │   ├── contexts/            # React contexts
│   │   │   └── AuthContext.tsx  # Authentication state
│   │   ├── hooks/               # Custom React hooks
│   │   ├── services/            # API services
│   │   │   ├── api.ts           # Axios configuration
│   │   │   └── auth.ts          # Auth service
│   │   └── styles/
│   │       └── index.css        # Global styles & Tailwind
│   ├── public/                  # Static assets
│   └── package.json
│
└── README.md                    # This comprehensive guide
```

## 🎨 Design System & UI

### Color Palette

- **Primary**: Sophisticated grays (50-900) for elegance
- **Accent**: Blue gradients (#3B82F6 to #8B5CF6) for interactions
- **Success**: Emerald tones for positive actions
- **Warning**: Amber tones for cautions
- **Error**: Red tones for errors and validation

### Typography

- **Font Family**: Inter (Google Fonts) - Modern, readable
- **Headings**: Font weight 600, tight letter spacing (-0.025em)
- **Body Text**: Font weight 400-500, comfortable line height (1.6)
- **Small Text**: Font weight 500, uppercase tracking for labels

### Component Library

- **Glass-morphism**: `backdrop-blur-xl`, `bg-white/95` for modern feel
- **Elegant Shadows**: Multi-layer shadows with `shadow-elegant` utility
- **Rounded Corners**: `rounded-2xl` (16px) for cards, `rounded-3xl` (24px) for search
- **Smooth Transitions**: 200-300ms ease curves for all interactions

### Grid System

- **Container**: `max-w-7xl mx-auto` for content width
- **Responsive Breakpoints**:
  - Mobile: `< 768px` - 2 columns
  - Tablet: `768px - 1024px` - 3 columns
  - Desktop: `> 1024px` - 4 columns
- **Aspect Ratios**: `aspect-square` for category cards, dynamic for photos

## 🧩 Key Components

### 🔍 SearchHero Component

```tsx
// Advanced search with trending suggestions and history
<SearchHero />
```

Features:

- Large, prominent search input with animations
- Trending searches that rotate automatically
- Search history stored locally
- Responsive dropdown with suggestions
- Gradient focus effects

### 🖼️ PhotoCard Component

```tsx
// Elegant photo display with hover effects
<PhotoCard photo={photoData} />
```

Features:

- Optimized image loading with lazy loading
- Hover effects with author info overlay
- Download and favorite buttons
- Responsive sizing with proper aspect ratios

### 🔐 GoogleAuthSuccessPage

```tsx
// Beautiful loading page for OAuth completion
<GoogleAuthSuccessPage />
```

Features:

- Animated loading indicators
- Gradient background with decorative elements
- Progress visualization
- Automatic redirect after authentication

## 🛠️ Development Scripts

### Frontend Commands

```bash
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint checks
npm run lint:fix     # Auto-fix ESLint issues
npm run type-check   # TypeScript type checking
```

### Backend Commands

```bash
npm run start:dev    # Development mode with hot reload
npm run build        # Build for production
npm run start:prod   # Production server
npm run test         # Run unit tests
npm run test:e2e     # End-to-end tests
npm run prisma:migrate    # Run database migrations
npm run prisma:studio     # Open Prisma Studio GUI
npm run prisma:generate   # Generate Prisma client
```

## 🚀 Production Deployment

### Frontend (Vercel/Netlify)

1. **Build**: `npm run build` in `/FE`
2. **Deploy**: Upload `dist/` folder or connect Git repo
3. **Environment**: Set `VITE_API_URL` and `VITE_GOOGLE_CLIENT_ID`
4. **Domain**: Configure custom domain if needed

### Backend (Railway/Heroku/DigitalOcean)

1. **Database**: Set up PostgreSQL instance
2. **Environment**: Configure all required environment variables
3. **Migrations**: Run `npx prisma migrate deploy`
4. **Build**: `npm run build`
5. **Start**: `npm run start:prod`

### Environment Setup Checklist

- [ ] PostgreSQL database URL
- [ ] JWT secret keys (32+ characters)
- [ ] Google OAuth credentials
- [ ] CORS settings for frontend domain
- [ ] SSL certificates for HTTPS

## 🤝 Contributing

### Development Workflow

1. **Fork** the repository
2. **Clone** your fork: `git clone <your-fork-url>`
3. **Branch**: `git checkout -b feature/amazing-feature`
4. **Code**: Follow TypeScript and ESLint rules
5. **Test**: Ensure all tests pass
6. **Commit**: `git commit -m 'feat: add amazing feature'`
7. **Push**: `git push origin feature/amazing-feature`
8. **PR**: Create Pull Request with description

### Code Standards

- **TypeScript**: Strict mode enabled, proper typing
- **ESLint**: Follow React and Node.js best practices
- **Prettier**: Consistent code formatting (2 spaces, single quotes)
- **Commits**: Use conventional commits (feat, fix, docs, etc.)
- **Testing**: Write tests for new features

### Design Guidelines

- **Mobile-first**: Design for mobile, enhance for desktop
- **Accessibility**: ARIA labels, keyboard navigation, screen readers
- **Performance**: Lazy loading, code splitting, image optimization
- **SEO**: Proper meta tags, semantic HTML, structured data

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Unsplash](https://unsplash.com)** - Inspiration for design and functionality
- **[Tailwind CSS](https://tailwindcss.com)** - Amazing utility-first CSS framework
- **[Shadcn/ui](https://ui.shadcn.com)** - Beautiful React component library
- **[Lucide](https://lucide.dev)** - Consistent and beautiful icon set
- **[Prisma](https://prisma.io)** - Next-generation ORM for TypeScript
- **[NestJS](https://nestjs.com)** - Progressive Node.js framework

## 📞 Support & Community

- **Issues**: [GitHub Issues](https://github.com/yourusername/unsplash-clone/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/unsplash-clone/discussions)
- **Documentation**: Check `/docs` folder for detailed guides
- **Examples**: See `/examples` for implementation examples

---

**✨ Built with love using React, TypeScript, Tailwind CSS, and NestJS ✨**

_Happy coding! 🚀 Let's build something amazing together!_

1. Start the backend:

```bash
cd BE
npm run start:dev
```

2. Start the frontend:

```bash
cd FE
npm run dev
```

3. Open http://localhost:5173 in your browser

## API Endpoints

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /photos` - Get all photos
- `POST /photos` - Upload new photo
- And more...

## License

This project is licensed under the UNLICENSED License.
