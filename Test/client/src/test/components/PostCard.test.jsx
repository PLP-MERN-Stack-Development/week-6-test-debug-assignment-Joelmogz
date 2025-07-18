import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PostCard } from '../../components/PostCard';
import { useAuth } from '../../hooks/useAuth';

// Mock the useAuth hook
vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

const mockPost = {
  _id: '1',
  title: 'Test Post',
  content: 'This is a test post content',
  author: {
    _id: 'author1',
    username: 'testuser',
  },
  tags: ['test', 'post'],
  published: true,
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
};

describe('PostCard', () => {
  it('renders post information correctly', () => {
    useAuth.mockReturnValue({
      user: { _id: 'author1' },
    });

    render(<PostCard post={mockPost} />);

    expect(screen.getByText('Test Post')).toBeInTheDocument();
    expect(screen.getByText('This is a test post content')).toBeInTheDocument();
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('post')).toBeInTheDocument();
  });

  it('shows edit and delete buttons for post author', () => {
    useAuth.mockReturnValue({
      user: { _id: 'author1' },
    });

    render(<PostCard post={mockPost} />);

    expect(screen.getByLabelText('Edit post')).toBeInTheDocument();
    expect(screen.getByLabelText('Delete post')).toBeInTheDocument();
  });

  it('hides edit and delete buttons for non-author', () => {
    useAuth.mockReturnValue({
      user: { _id: 'different-user' },
    });

    render(<PostCard post={mockPost} />);

    expect(screen.queryByLabelText('Edit post')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Delete post')).not.toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const mockOnEdit = vi.fn();
    useAuth.mockReturnValue({
      user: { _id: 'author1' },
    });

    render(<PostCard post={mockPost} onEdit={mockOnEdit} />);

    fireEvent.click(screen.getByLabelText('Edit post'));
    expect(mockOnEdit).toHaveBeenCalledWith(mockPost);
  });

  it('calls onDelete when delete button is clicked', () => {
    const mockOnDelete = vi.fn();
    useAuth.mockReturnValue({
      user: { _id: 'author1' },
    });

    render(<PostCard post={mockPost} onDelete={mockOnDelete} />);

    fireEvent.click(screen.getByLabelText('Delete post'));
    expect(mockOnDelete).toHaveBeenCalledWith(mockPost._id);
  });

  it('shows draft badge for unpublished posts', () => {
    const draftPost = { ...mockPost, published: false };
    useAuth.mockReturnValue({
      user: { _id: 'author1' },
    });

    render(<PostCard post={draftPost} />);

    expect(screen.getByText('Draft')).toBeInTheDocument();
  });
});