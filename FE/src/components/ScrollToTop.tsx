import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 group
                   w-14 h-14 bg-gradient-to-br from-gray-900 to-gray-700
                   hover:from-gray-800 hover:to-gray-600
                   text-white rounded-full shadow-2xl
                   flex items-center justify-center
                   transition-all duration-300 ease-out
                   hover:scale-110 hover:shadow-3xl
                   focus:outline-none focus:ring-4 focus:ring-gray-900/20
                   animate-in slide-in-from-bottom-8 fade-in"
          aria-label="Scroll to top"
        >
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
          
          {/* Icon */}
          <ChevronUp 
            className="h-6 w-6 relative z-10 transition-transform duration-300 group-hover:-translate-y-1" 
          />
          
          {/* Animated ring */}
          <div className="absolute inset-0 rounded-full border-2 border-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"></div>
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
