import { User } from '../../models/User.js';
import bcrypt from 'bcryptjs';

describe('User Model', () => {
  describe('User Creation', () => {
    test('should create a user with valid data', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser.username).toBe(userData.username);
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.password).not.toBe(userData.password); // Should be hashed
      expect(savedUser.role).toBe('user');
    });

    test('should fail to create user with invalid email', async () => {
      const userData = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'password123',
      };

      const user = new User(userData);
      await expect(user.save()).rejects.toThrow();
    });

    test('should fail to create user with short password', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: '123',
      };

      const user = new User(userData);
      await expect(user.save()).rejects.toThrow();
    });
  });

  describe('Password Hashing', () => {
    test('should hash password before saving', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      const user = new User(userData);
      await user.save();

      expect(user.password).not.toBe(userData.password);
      expect(await bcrypt.compare(userData.password, user.password)).toBe(true);
    });

    test('should not hash password if not modified', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

      await user.save();
      const originalPassword = user.password;

      user.username = 'updateduser';
      await user.save();

      expect(user.password).toBe(originalPassword);
    });
  });

  describe('Password Comparison', () => {
    test('should compare passwords correctly', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      const user = new User(userData);
      await user.save();

      expect(await user.comparePassword('password123')).toBe(true);
      expect(await user.comparePassword('wrongpassword')).toBe(false);
    });
  });

  describe('JSON Output', () => {
    test('should not include password in JSON output', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      const user = new User(userData);
      await user.save();

      const json = user.toJSON();
      expect(json).not.toHaveProperty('password');
      expect(json).toHaveProperty('username');
      expect(json).toHaveProperty('email');
    });
  });
});