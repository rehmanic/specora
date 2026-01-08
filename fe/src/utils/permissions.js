const permissionList = {
  users: [
    {
      id: "add_user",
      label: "Add User",
      description: "Can add new users",
      enabled: false,
    },
    {
      id: "view_users",
      label: "View Users",
      description: "Can view user list",
      enabled: false,
    },
    {
      id: "update_user",
      label: "Update User",
      description: "Can modify user details",
      enabled: false,
    },
    {
      id: "delete_user",
      label: "Delete User",
      description: "Can remove users",
      enabled: false,
    },
  ],
  projects: [
    {
      id: "create_project",
      label: "Create Project",
      description: "Can create new projects",
      enabled: false,
    },
    {
      id: "view_projects",
      label: "View Projects",
      description: "Can view assigned projects",
      enabled: false,
    },
    {
      id: "view_all_projects",
      label: "View All Projects",
      description: "Can view all projects",
      enabled: false,
    },
    {
      id: "update_project",
      label: "Update Project",
      description: "Can modify project details",
      enabled: false,
    },
    {
      id: "delete_project",
      label: "Delete Project",
      description: "Can remove projects",
      enabled: false,
    },
  ],
  specbot: [
    {
      id: "create_new_chat_bot",
      label: "Create Chat Bot",
      description: "Can create new chat bots",
      enabled: false,
    },
    {
      id: "delete_chat_bot",
      label: "Delete Chat Bot",
      description: "Can remove chat bots",
      enabled: false,
    },
    {
      id: "view_chat_bot",
      label: "View Chat Bot",
      description: "Can view chat bot details",
      enabled: false,
    },
    {
      id: "view_all_chats_bot",
      label: "View All Chats",
      description: "Can view all bot chats",
      enabled: false,
    },
    {
      id: "send_message_bot",
      label: "Send Bot Message",
      description: "Can send messages to bot",
      enabled: false,
    },
    {
      id: "edit_message_bot",
      label: "Edit Bot Message",
      description: "Can edit bot messages",
      enabled: false,
    },
    {
      id: "view_all_messages_bot",
      label: "View Bot Messages",
      description: "Can view all bot messages",
      enabled: false,
    },
    {
      id: "delete_message_bot",
      label: "Delete Bot Message",
      description: "Can delete bot messages",
      enabled: false,
    },
  ],
  chat: [
    {
      id: "send_message_group",
      label: "Send Group Message",
      description: "Can send messages in groups",
      enabled: false,
    },
    {
      id: "edit_message_group",
      label: "Edit Group Message",
      description: "Can edit group messages",
      enabled: false,
    },
    {
      id: "view_all_messages_group",
      label: "View Group Messages",
      description: "Can view all group messages",
      enabled: false,
    },
    {
      id: "delete_message_group",
      label: "Delete Group Message",
      description: "Can delete group messages",
      enabled: false,
    },
  ],
};

export default permissionList;
