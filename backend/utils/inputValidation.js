
const validateSignup = ({ username, email, password }) => {
  const usernameRegex = /^(?=.*[A-Za-z]{3,})[A-Za-z\d]{5,20}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!username || !usernameRegex.test(username)) {
    return "Username must be 5-20 characters, contain at least 3 letters, letters and numbers only.";
  }

  if (!email || !emailRegex.test(email)) {
    return "Invalid email format.";
  }

  if (!password || password.length < 6 || password.length > 32) {
    return "Password must be 6-32 characters long.";
  }

  return null;
};

export { validateSignup };