export const validateEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateUsername = (username) => {
  return username && username.length >= 3 && username.length <= 20;
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

export const validatePostData = (data) => {
  const errors = {};
  
  if (!data.title || data.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters long';
  }
  
  if (!data.content || data.content.trim().length < 10) {
    errors.content = 'Content must be at least 10 characters long';
  }
  
  if (data.tags && !Array.isArray(data.tags)) {
    errors.tags = 'Tags must be an array';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};