import { describe, it, expect } from 'vitest';
import { validateEmail, validatePassword, validateUsername, validatePost } from '../../utils/validation';

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('should return true for valid emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('user+tag@example.org')).toBe(true);
    });

    it('should return false for invalid emails', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should return true for valid passwords', () => {
      expect(validatePassword('password123')).toBe(true);
      expect(validatePassword('123456')).toBe(true);
      expect(validatePassword('abcdef')).toBe(true);
    });

    it('should return false for invalid passwords', () => {
      expect(validatePassword('12345')).toBe(false);
      expect(validatePassword('abc')).toBe(false);
      expect(validatePassword('')).toBe(false);
    });
  });

  describe('validateUsername', () => {
    it('should return true for valid usernames', () => {
      expect(validateUsername('user')).toBe(true);
      expect(validateUsername('user123')).toBe(true);
      expect(validateUsername('testuser')).toBe(true);
    });

    it('should return false for invalid usernames', () => {
      expect(validateUsername('ab')).toBe(false);
      expect(validateUsername('a'.repeat(21))).toBe(false);
      expect(validateUsername('')).toBe(false);
    });
  });

  describe('validatePost', () => {
    it('should return valid for correct post data', () => {
      const result = validatePost('Valid Title', 'This is a valid post content with enough characters');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should return invalid for short title', () => {
      const result = validatePost('ab', 'This is a valid post content with enough characters');
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBe('Title must be at least 3 characters long');
    });

    it('should return invalid for short content', () => {
      const result = validatePost('Valid Title', 'short');
      expect(result.isValid).toBe(false);
      expect(result.errors.content).toBe('Content must be at least 10 characters long');
    });

    it('should return invalid for empty title and content', () => {
      const result = validatePost('', '');
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBe('Title must be at least 3 characters long');
      expect(result.errors.content).toBe('Content must be at least 10 characters long');
    });
  });
});