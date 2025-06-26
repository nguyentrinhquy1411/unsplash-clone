import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const GoogleAuthSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const refreshToken = searchParams.get('refreshToken');

    if (token && refreshToken) {
      // Store tokens
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      
      // Set token in auth context
      setToken(token);

      // Fetch user profile
      fetch('http://localhost:3001/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(response => response.json())
        .then(userData => {
          setUser(userData);
          navigate('/', { replace: true });
        })
        .catch(error => {
          console.error('Failed to fetch user profile:', error);
          navigate('/login', { replace: true });
        });
    } else {
      // No tokens found, redirect to login
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate, setUser, setToken]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center space-y-6 p-8">
        {/* Loading Animation */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
            <LoadingSpinner />
          </div>
          
          {/* Animated rings */}
          <div className="absolute inset-0 w-24 h-24 mx-auto">
            <div className="w-full h-full rounded-full border-4 border-blue-200 animate-pulse"></div>
          </div>
          <div className="absolute inset-0 w-32 h-32 mx-auto -m-4">
            <div className="w-full h-full rounded-full border-2 border-purple-200 animate-ping"></div>
          </div>
        </div>

        {/* Success Content */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Almost there! 🎉
          </h1>
          <p className="text-xl text-gray-600 max-w-md mx-auto leading-relaxed">
            Completing your Google sign-in and setting up your account...
          </p>
          
          {/* Progress indicators */}
          <div className="flex justify-center items-center space-x-2 mt-8">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default GoogleAuthSuccessPage;
