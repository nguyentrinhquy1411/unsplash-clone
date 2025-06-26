import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import { MainLayout } from './components/layout/MainLayout'
import ErrorBoundary from './components/ErrorBoundary'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import TopicPage from './pages/TopicPage'
import PhotoDetailPage from './pages/PhotoDetailPage'
import RecentPage from './pages/RecentPage'
import FavoritesPage from './pages/FavoritesPage'
import DownloadHistoryPage from './pages/DownloadHistoryPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import GoogleAuthSuccessPage from './pages/GoogleAuthSuccessPage'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
})

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Auth routes without MainLayout */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/auth/google/success" element={<GoogleAuthSuccessPage />} />
              
              {/* Main app routes with MainLayout */}
              <Route path="/*" element={
                <MainLayout>
                  <ErrorBoundary>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/search" element={<SearchPage />} />
                      <Route path="/topic/:topic" element={<TopicPage />} />
                      <Route path="/photo/:id" element={<PhotoDetailPage />} />
                      <Route path="/recent" element={<RecentPage />} />
                      <Route path="/favorites" element={<FavoritesPage />} />
                      <Route path="/downloads" element={<DownloadHistoryPage />} />
                    </Routes>
                  </ErrorBoundary>
                </MainLayout>
              } />
            </Routes>
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
