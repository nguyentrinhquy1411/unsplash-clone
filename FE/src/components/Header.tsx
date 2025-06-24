import React from 'react'
import { Camera } from 'lucide-react'

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Camera className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              Unsplash Clone
            </h1>
          </div>
          <div className="text-sm text-gray-500">
            Demo App
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
