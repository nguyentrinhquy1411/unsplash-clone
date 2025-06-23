# Unsplash Clone

A full-stack Unsplash clone application with NestJS backend and React frontend.

## Project Structure

```
├── BE/                 # Backend (NestJS + Prisma + PostgreSQL)
│   ├── src/
│   ├── prisma/
│   └── package.json
├── FE/                 # Frontend (React + Vite + TailwindCSS)
│   ├── src/
│   ├── public/
│   └── package.json
└── README.md
```

## Backend (BE/)

NestJS application with:
- **Authentication**: JWT-based auth with Passport
- **Database**: PostgreSQL with Prisma ORM
- **Photo Management**: Upload, list, and manage photos
- **API Documentation**: Swagger/OpenAPI

### Tech Stack
- NestJS
- Prisma
- PostgreSQL
- JWT Authentication
- TypeScript

### Setup
```bash
cd BE
npm install
# Setup your .env file
npm run start:dev
```

## Frontend (FE/)

React application with:
- **UI Framework**: TailwindCSS
- **Build Tool**: Vite
- **Type Safety**: TypeScript
- **Photo Gallery**: Grid layout with modal view

### Tech Stack
- React
- TypeScript
- Vite
- TailwindCSS

### Setup
```bash
cd FE
npm install
npm run dev
```

## Development

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
