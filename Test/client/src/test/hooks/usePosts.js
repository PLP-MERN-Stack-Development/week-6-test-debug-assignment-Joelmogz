import { useState, useEffect } from 'react';
import { postsApi } from '../utils/api';

export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async (params) => {
    try {
      setLoading(true);
      setError(null);
      const data = await postsApi.getAllPosts(params);
      setPosts(data.posts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const createPost = async (postData) => {
    try {
      const newPost = await postsApi.createPost(postData);
      setPosts(prev => [newPost, ...prev]);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updatePost = async (id, postData) => {
    try {
      const updatedPost = await postsApi.updatePost(id, postData);
      setPosts(prev => prev.map(post => post._id === id ? updatedPost : post));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deletePost = async (id) => {
    try {
      await postsApi.deletePost(id);
      setPosts(prev => prev.filter(post => post._id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
  };
};