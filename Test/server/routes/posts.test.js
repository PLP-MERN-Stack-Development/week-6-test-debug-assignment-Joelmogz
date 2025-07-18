import request from 'supertest';
import app from '../../index.js';
import { User } from '../../models/User.js';
import { Post } from '../../models/Post.js';

describe('Posts Routes', () => {
  let token;
  let userId;

  beforeEach(async () => {
    // Create and authenticate user
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    const user = new User(userData);
    await user.save();
    userId = user._id;

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ username: userData.username, password: userData.password });

    token = loginResponse.body.token;
  });

  describe('GET /api/posts', () => {
    test('should get all posts', async () => {
      // Create test posts
      const post1 = new Post({
        title: 'Test Post 1',
        content: 'This is test content 1',
        author: userId,
        published: true,
      });

      const post2 = new Post({
        title: 'Test Post 2',
        content: 'This is test content 2',
        author: userId,
        published: false,
      });

      await post1.save();
      await post2.save();

      const response = await request(app)
        .get('/api/posts')
        .expect(200);

      expect(response.body).toHaveProperty('posts');
      expect(response.body.posts).toHaveLength(2);
      expect(response.body).toHaveProperty('totalPages');
      expect(response.body).toHaveProperty('currentPage');
      expect(response.body).toHaveProperty('total');
    });

    test('should filter posts by published status', async () => {
      const post1 = new Post({
        title: 'Published Post',
        content: 'This is published content',
        author: userId,
        published: true,
      });

      const post2 = new Post({
        title: 'Draft Post',
        content: 'This is draft content',
        author: userId,
        published: false,
      });

      await post1.save();
      await post2.save();

      const response = await request(app)
        .get('/api/posts?published=true')
        .expect(200);

      expect(response.body.posts).toHaveLength(1);
      expect(response.body.posts[0].published).toBe(true);
    });
  });

  describe('GET /api/posts/:id', () => {
    test('should get single post', async () => {
      const post = new Post({
        title: 'Test Post',
        content: 'This is test content',
        author: userId,
      });

      await post.save();

      const response = await request(app)
        .get(`/api/posts/${post._id}`)
        .expect(200);

      expect(response.body.title).toBe(post.title);
      expect(response.body.content).toBe(post.content);
    });

    test('should return 404 for non-existent post', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .get(`/api/posts/${fakeId}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/posts', () => {
    test('should create a new post', async () => {
      const postData = {
        title: 'New Test Post',
        content: 'This is new test content',
        tags: ['test', 'new'],
      };

      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send(postData)
        .expect(201);

      expect(response.body.title).toBe(postData.title);
      expect(response.body.content).toBe(postData.content);
      expect(response.body.tags).toEqual(postData.tags);
      expect(response.body.author.username).toBe('testuser');
    });

    test('should fail to create post without authentication', async () => {
      const postData = {
        title: 'New Test Post',
        content: 'This is new test content',
      };

      const response = await request(app)
        .post('/api/posts')
        .send(postData)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    test('should fail to create post with invalid data', async () => {
      const postData = {
        title: 'ab', // Too short
        content: 'short', // Too short
      };

      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send(postData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('details');
    });
  });

  describe('PUT /api/posts/:id', () => {
    let post;

    beforeEach(async () => {
      post = new Post({
        title: 'Original Title',
        content: 'Original content',
        author: userId,
      });
      await post.save();
    });

    test('should update own post', async () => {
      const updateData = {
        title: 'Updated Title',
        content: 'Updated content',
      };

      const response = await request(app)
        .put(`/api/posts/${post._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body.title).toBe(updateData.title);
      expect(response.body.content).toBe(updateData.content);
    });

    test('should fail to update non-existent post', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const updateData = {
        title: 'Updated Title',
        content: 'Updated content',
      };

      const response = await request(app)
        .put(`/api/posts/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/posts/:id', () => {
    let post;

    beforeEach(async () => {
      post = new Post({
        title: 'Post to Delete',
        content: 'This post will be deleted',
        author: userId,
      });
      await post.save();
    });

    test('should delete own post', async () => {
      const response = await request(app)
        .delete(`/api/posts/${post._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');

      // Verify post is deleted
      const deletedPost = await Post.findById(post._id);
      expect(deletedPost).toBeNull();
    });

    test('should fail to delete non-existent post', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .delete(`/api/posts/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });
});