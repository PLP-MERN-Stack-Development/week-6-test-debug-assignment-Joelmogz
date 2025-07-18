import React from 'react';
import { LogOut, User, PlusSquare, Home } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Layout = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-gray-900">BlogApp</h1>
              <div className="flex items-center space-x-4">
                <a href="/" className="text-gray-600 hover:text-gray-900 flex items-center space-x-1">
                  <Home size={16} />
                  <span>Home</span>
                </a>
                {isAuthenticated && (
                  <a href="/create" className="text-gray-600 hover:text-gray-900 flex items-center space-x-1">
                    <PlusSquare size={16} />
                    <span>New Post</span>
                  </a>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <User size={16} />
                    <span>{user?.username}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <a href="/login" className="text-gray-600 hover:text-gray-900">
                    Login
                  </a>
                  <a href="/register" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                    Register
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};