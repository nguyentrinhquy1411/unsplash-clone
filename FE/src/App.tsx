import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './components/theme-provider'
import { MainLayout } from './components/layout/MainLayout'
import ErrorBoundary from './components/ErrorBoundary'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import TopicPage from './pages/TopicPage'
import PhotoDetailPage from './pages/PhotoDetailPage'
import RecentPage from './pages/RecentPage'
import FavoritesPage from './pages/FavoritesPage'

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
        <ThemeProvider defaultTheme="system" storageKey="photosplash-ui-theme">
          <Router>
            <MainLayout>
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/topic/:topic" element={<TopicPage />} />
                  <Route path="/photo/:id" element={<PhotoDetailPage />} />
                  <Route path="/recent" element={<RecentPage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                </Routes>
              </ErrorBoundary>
            </MainLayout>
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
