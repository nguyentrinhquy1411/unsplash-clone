import { Route, BrowserRouter as Router, Routes, Link } from 'react-router-dom'
import PhotosDemoQuery from './components/PhotosDemoQuery'
import PhotosInfiniteScroll from './components/PhotosInfiniteScroll'
import { Button } from './components/ui/button'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <nav className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex gap-4 items-center">
              <h1 className="text-xl font-bold">Unsplash Clone</h1>
              <div className="flex gap-2">
                <Button variant="ghost" asChild>
                  <Link to="/">Basic Demo</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/infinite">Infinite Scroll</Link>
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<PhotosDemoQuery />} />
            <Route path="/infinite" element={<PhotosInfiniteScroll />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
