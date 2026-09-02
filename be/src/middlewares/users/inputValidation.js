export const validateUserDataInput = (req, res, next) => {
  const user = req.body;

  const usernameRegex = /^(?=.*[A-Za-z]{3,})[A-Za-z\d]{5,20}$/;
  const displayNameRegex = /^[A-Za-z\d\s'.-]{3,50}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const urlRegex = /^https?:\/\/[^\s]+$/i;



  // USERNAME
  if (!usernameRegex.test(user.username)) {
    return res.status(400).json({
      message:
        "Username must be 5-20 characters, contain at least 3 letters, and use only letters/numbers.",
    });
  }

  // DISPLAY NAME
  if (!displayNameRegex.test(user.display_name)) {
    return res.status(400).json({
      message:
        "Display name must be 3-50 characters and may include letters, numbers, spaces, and punctuation.",
    });
  }

  // EMAIL
  if (!emailRegex.test(user.email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  // PASSWORD (only validate if provided - optional for updates)
  if (user.password !== undefined && user.password !== null && user.password !== "") {
    if (user.password.length < 6 || user.password.length > 32) {
      return res
        .status(400)
        .json({ message: "Password must be 6-32 characters long." });
    }
  }



  // PROFILE PIC URL (only if provided)
  if (user.profile_pic_url) {
    if (!urlRegex.test(user.profile_pic_url)) {
      return res.status(400).json({ message: "Invalid profile picture URL." });
    }
  }

  next();
};
