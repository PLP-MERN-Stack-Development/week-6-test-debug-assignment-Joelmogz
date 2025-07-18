import React, { useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/Layout';
import { LoadingSpinner } from './components/LoadingSpinner';
import { PostCard } from './components/PostCard';
import { PostForm } from './components/PostForm';
import { AuthForm } from './components/AuthForm';
import { useAuth } from './hooks/useAuth';
import { usePosts } from './hooks/usePosts';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [editingPost, setEditingPost] = useState(null);
  const { user, loading: authLoading, login, register, isAuthenticated } = useAuth();
  const { posts, loading: postsLoading, createPost, updatePost, deletePost, fetchPosts } = usePosts();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const handleLogin = async (data) => {
    const result = await login(data.username, data.password);
    if (result.success) {
      setCurrentView('home');
      await fetchPosts();
    }
    return result;
  };

  const handleRegister = async (data) => {
    const result = await register(data.username, data.email, data.password);
    if (result.success) {
      setCurrentView('home');
      await fetchPosts();
    }
    return result;
  };

  const handleCreatePost = async (data) => {
    const result = await createPost(data);
    if (result.success) {
      setCurrentView('home');
    }
    return result;
  };

  const handleUpdatePost = async (data) => {
    if (!editingPost) return { success: false, error: 'No post selected' };
    
    const result = await updatePost(editingPost._id, data);
    if (result.success) {
      setCurrentView('home');
      setEditingPost(null);
    }
    return result;
  };

  const handleDeletePost = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await deletePost(id);
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setCurrentView('edit');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'login':
        return (
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6">Login</h2>
            <AuthForm type="login" onSubmit={handleLogin} />
            <p className="mt-4 text-center text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => setCurrentView('register')}
                className="text-blue-500 hover:text-blue-700"
              >
                Register
              </button>
            </p>
          </div>
        );

      case 'register':
        return (
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6">Register</h2>
            <AuthForm type="register" onSubmit={handleRegister} />
            <p className="mt-4 text-center text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => setCurrentView('login')}
                className="text-blue-500 hover:text-blue-700"
              >
                Login
              </button>
            </p>
          </div>
        );

      case 'create':
        return (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Create New Post</h2>
            <PostForm
              onSubmit={handleCreatePost}
              onCancel={() => setCurrentView('home')}
            />
          </div>
        );

      case 'edit':
        return (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Edit Post</h2>
            <PostForm
              post={editingPost}
              onSubmit={handleUpdatePost}
              onCancel={() => {
                setCurrentView('home');
                setEditingPost(null);
              }}
            />
          </div>
        );

      default:
        return (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Recent Posts</h2>
              {isAuthenticated && (
                <button
                  onClick={() => setCurrentView('create')}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Create New Post
                </button>
              )}
            </div>

            {postsLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="lg" />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No posts yet. Be the first to create one!</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map(post => (
                  <PostCard
                    key={post._id}
                    post={post}
                    onEdit={handleEditPost}
                    onDelete={handleDeletePost}
                  />
                ))}
              </div>
            )}
          </div>
        );
    }
  };

  // Handle navigation
  const handleNavigation = (view) => {
    if (view === 'create' && !isAuthenticated) {
      setCurrentView('login');
    } else {
      setCurrentView(view);
    }
  };

  // Override default navigation behavior
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (['home', 'login', 'register', 'create'].includes(hash)) {
        handleNavigation(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAuthenticated]);

  return (
    <ErrorBoundary>
      <Layout>
        {renderContent()}
      </Layout>
    </ErrorBoundary>
  );
}

export default App;