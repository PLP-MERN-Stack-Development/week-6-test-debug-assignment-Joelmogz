import { 
  validateEmail, 
  validatePassword, 
  validateUsername, 
  sanitizeInput, 
  validatePostData 
} from '../../utils/validation.js';

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    test('should return true for valid email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    test('should return false for invalid email', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    test('should return true for valid password', () => {
      expect(validatePassword('password123')).toBe(true);
      expect(validatePassword('123456')).toBe(true);
    });

    test('should return false for invalid password', () => {
      expect(validatePassword('12345')).toBe(false);
      expect(validatePassword('')).toBe(false);
      expect(validatePassword(null)).toBe(false);
    });
  });

  describe('validateUsername', () => {
    test('should return true for valid username', () => {
      expect(validateUsername('user123')).toBe(true);
      expect(validateUsername('testuser')).toBe(true);
    });

    test('should return false for invalid username', () => {
      expect(validateUsername('ab')).toBe(false);
      expect(validateUsername('a'.repeat(21))).toBe(false);
      expect(validateUsername('')).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    test('should remove dangerous characters', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
      expect(sanitizeInput('normal text')).toBe('normal text');
    });

    test('should trim whitespace', () => {
      expect(sanitizeInput('  text  ')).toBe('text');
    });
  });

  describe('validatePostData', () => {
    test('should return valid for correct post data', () => {
      const validData = {
        title: 'Test Post',
        content: 'This is a test post content',
        tags: ['test', 'post'],
      };

      const result = validatePostData(validData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    test('should return invalid for incorrect post data', () => {
      const invalidData = {
        title: 'ab',
        content: 'short',
        tags: 'not-array',
      };

      const result = validatePostData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty('title');
      expect(result.errors).toHaveProperty('content');
      expect(result.errors).toHaveProperty('tags');
    });
  });
});