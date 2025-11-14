export const validateSignupInput = (req, res, next) => {
  try {
    const usernameRegex = /^(?=.*[A-Za-z]{3,})[A-Za-z\d]{5,20}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const { username, email, password } = req.body;

    if (!usernameRegex.test(username)) {
      return res
        .status(400)
        .json({
          message:
            "Username must be 5-20 characters, contain at least 3 letters, letters and numbers only.",
        });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    if (password.length < 6 || password.length > 32) {
      return res
        .status(400)
        .json({ message: "Password must be 6-32 characters long." });
    }

    next();
  } catch (error) {
    console.error("Validation error:", error);
    return res
      .status(500)
      .json({ message: "Validation error", error: error.message });
  }
};
