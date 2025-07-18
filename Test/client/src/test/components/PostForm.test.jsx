import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PostForm } from '../../components/PostForm';

describe('PostForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields correctly', () => {
    render(<PostForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Content')).toBeInTheDocument();
    expect(screen.getByLabelText('Tags (comma-separated)')).toBeInTheDocument();
    expect(screen.getByLabelText('Publish post')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<PostForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    fireEvent.click(screen.getByText('Create Post'));

    await waitFor(() => {
      expect(screen.getByText('Title must be at least 3 characters long')).toBeInTheDocument();
      expect(screen.getByText('Content must be at least 10 characters long')).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    mockOnSubmit.mockResolvedValue({ success: true });

    render(<PostForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Test Post Title' },
    });
    fireEvent.change(screen.getByLabelText('Content'), {
      target: { value: 'This is a test post content with more than 10 characters' },
    });
    fireEvent.change(screen.getByLabelText('Tags (comma-separated)'), {
      target: { value: 'test, post' },
    });
    fireEvent.click(screen.getByLabelText('Publish post'));

    fireEvent.click(screen.getByText('Create Post'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Post Title',
        content: 'This is a test post content with more than 10 characters',
        tags: ['test', 'post'],
        published: true,
      });
    });
  });

  it('pre-fills form when editing post', () => {
    const existingPost = {
      _id: '1',
      title: 'Existing Post',
      content: 'Existing content',
      tags: ['existing', 'post'],
      published: true,
      author: { _id: 'author1', username: 'testuser' },
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    };

    render(<PostForm post={existingPost} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByDisplayValue('Existing Post')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing content')).toBeInTheDocument();
    expect(screen.getByDisplayValue('existing, post')).toBeInTheDocument();
    expect(screen.getByLabelText('Publish post')).toBeChecked();
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(<PostForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnCancel).toHaveBeenCalled();
  });
});