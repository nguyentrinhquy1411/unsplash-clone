# Unsplash Clone Frontend

This is the frontend application for the Unsplash Clone project, built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- 🖼️ **Random Photos Demo**: Display random photos from Unsplash API
- 🔍 **Search Functionality**: Search photos by keywords
- 📱 **Responsive Design**: Works on all devices
- ⚡ **Fast Loading**: Built with Vite for optimal performance
- 🎨 **Modern UI**: Clean design with Tailwind CSS
- 🔄 **Caching**: Smart caching with React Query

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Data fetching and caching
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn package manager

### Installation

1. Install dependencies:

```bash
yarn install
```

2. Configure environment variables in `.env`:

```
VITE_API_URL=http://localhost:3001/api
```

### Development

Start the development server:

```bash
yarn dev
```

The app will be available at [http://localhost:5173](http://localhost:5173)

### Building for Production

Build the application:

```bash
yarn build
```

Preview the production build:

```bash
yarn preview
```

## Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn preview` - Preview production build
- `yarn lint` - Run ESLint

## Notes

- Make sure the backend server is running on port 3001
- The app includes error handling and loading states
- Photos are cached for 5 minutes to reduce API calls
- The design is fully responsive and mobile-friendly
