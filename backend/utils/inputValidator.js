export const validateAuthInput = ({ username, email, password }) => {
  const usernameRegex = /^(?=.*[A-Za-z]{3,})[A-Za-z\d]{5,20}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (username) {
    if (!usernameRegex.test(username)) {
      return "Username must be 5-20 characters, contain at least 3 letters, letters and numbers only.";
    }
  }

  if (email) {
    if (!emailRegex.test(email)) {
      return "Invalid email format.";
    }
  }

  if (password) {
    if (password.length < 6 || password.length > 32) {
      return "Password must be 6-32 characters long.";
    }
  }

  return null;
};

export const validateUserInput = ({
  username,
  email,
  password,
  role,
  display_name,
  profile_pic_url,
  permissions,
}) => {
  const usernameRegex = /^(?=.*[A-Za-z]{3,})[A-Za-z\d]{5,20}$/;
  const displayNameRegex = /^[A-Za-z\d\s'.-]{3,20}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const urlRegex =
    /^(https?:\/\/)?([\w-])+\.{1}([a-zA-Z]{2,63})([\/\w\-.]*)*\/?$/;

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

  // Validate username
  if (!usernameRegex.test(username)) {
    return "Username must be 5-20 characters, contain at least 3 letters, letters and numbers only.";
  }

  // Validate display name
  if (!displayNameRegex.test(display_name)) {
    return "Display name must be 3-50 characters, letters, numbers, spaces, or basic punctuation only.";
  }

  // Validate email
  if (!emailRegex.test(email)) {
    return "Invalid email format.";
  }

  // Validate password length
  if (password.length < 6 || password.length > 32) {
    return "Password must be 6-32 characters long.";
  }

  // Validate role
  if (!rolesList.includes(role)) {
    return `Invalid role. Allowed roles are: ${rolesList.join(", ")}.`;
  }

  // Validate permissions: all items must be in allowed list
  if (
    !Array.isArray(permissions) ||
    !permissions.every((p) => permissionsList.includes(p))
  ) {
    return `Invalid permissions. Allowed permissions are: ${permissionsList.join(
      ", "
    )}.`;
  }

  // Validate profile picture URL if provided
  if (profile_pic_url) {
    if (!urlRegex.test(profile_pic_url)) {
      return "Invalid profile picture URL.";
    }
  }

  return null;
};
