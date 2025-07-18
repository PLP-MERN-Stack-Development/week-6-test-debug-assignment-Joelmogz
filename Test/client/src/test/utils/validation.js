export const validateEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateUsername = (username) => {
  return username.length >= 3 && username.length <= 20;
};

export const validatePost = (title, content) => {
  const errors = {};

  if (!title.trim() || title.length < 3) {
    errors.title = 'Title must be at least 3 characters long';
  }

  if (!content.trim() || content.length < 10) {
    errors.content = 'Content must be at least 10 characters long';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};