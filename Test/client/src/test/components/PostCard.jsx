import React from 'react';
import { Calendar, User, Tag, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const PostCard = ({ post, onEdit, onDelete, showActions = true }) => {
  const { user } = useAuth();
  const isAuthor = user?._id === post.author._id;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">{post.title}</h3>
        {showActions && isAuthor && (
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit?.(post)}
              className="text-blue-500 hover:text-blue-700 transition-colors"
              aria-label="Edit post"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onDelete?.(post._id)}
              className="text-red-500 hover:text-red-700 transition-colors"
              aria-label="Delete post"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <User size={14} />
            <span>{post.author.username}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar size={14} />
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {post.tags.map((tag, index) => (
            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
              <Tag size={10} className="mr-1" />
              {tag}
            </span>
          ))}
          {!post.published && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
              Draft
            </span>
          )}
        </div>
      </div>
    </div>
  );
};