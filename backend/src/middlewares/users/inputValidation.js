export const validateUserDataInput = (req, res, next) => {
  const user = req.body;

  const usernameRegex = /^(?=.*[A-Za-z]{3,})[A-Za-z\d]{5,20}$/;
  const displayNameRegex = /^[A-Za-z\d\s'.-]{3,50}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const urlRegex = /^https?:\/\/[^\s]+$/i;

  const rolesList = ["manager", "client", "requirements_engineer"];

  const permissionsList = [
    // User permissions
    "add_user",
    "view_users",
    "update_user",
    "delete_user",

    // Project permissions
    "create_project",
    "view_projects",
    "view_all_projects",
    "update_project",
    "delete_project",

    // Specbot permissions
    "create_new_chat_bot",
    "delete_chat_bot",
    "view_chat_bot",
    "view_all_chats_bot",
    "send_message_bot",
    "edit_message_bot",
    "view_all_messages_bot",
    "delete_message_bot",

    // Chat permissions
    "send_message_group",
    "edit_message_group",
    "view_all_messages_group",
    "delete_message_group",
  ];

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

  // PASSWORD
  if (user.password.length < 6 || user.password.length > 32) {
    return res
      .status(400)
      .json({ message: "Password must be 6-32 characters long." });
  }

  // ROLE
  if (!rolesList.includes(user.role)) {
    return res.status(400).json({
      message: `Invalid role. Allowed roles: ${rolesList.join(", ")}`,
    });
  }

  // PERMISSIONS (only if provided)
  if (user.permissions) {
    if (
      !Array.isArray(user.permissions) ||
      !user.permissions.every((p) => permissionsList.includes(p))
    ) {
      return res.status(400).json({
        message: `Invalid permissions. Allowed permissions: ${permissionsList.join(
          ", "
        )}`,
      });
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
