import express from 'express';
import { Post } from '../models/Post.js';
import { authenticate } from '../middleware/auth.js';
import { validatePostData } from '../utils/validation.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Get all posts
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, published } = req.query;
    const filter = published !== undefined ? { published: published === 'true' } : {};
    
    const posts = await Post.find(filter)
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Post.countDocuments(filter);
    
    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    next(error);
  }
});

// Get single post
router.get('/:id', async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username');
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    next(error);
  }
});

// Create post
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { isValid, errors } = validatePostData(req.body);
    
    if (!isValid) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }

    const post = new Post({
      ...req.body,
      author: req.user._id,
    });

    await post.save();
    await post.populate('author', 'username');

    logger.info(`Post created: ${post.title} by ${req.user.username}`);
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
});

// Update post
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this post' });
    }

    const { isValid, errors } = validatePostData(req.body);
    
    if (!isValid) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }

    Object.assign(post, req.body);
    await post.save();
    await post.populate('author', 'username');

    logger.info(`Post updated: ${post.title} by ${req.user.username}`);
    res.json(post);
  } catch (error) {
    next(error);
  }
});

// Delete post
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);
    
    logger.info(`Post deleted: ${post.title} by ${req.user.username}`);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export { router as postRoutes };