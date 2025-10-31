INSERT INTO users (
    username,
    password_hash,
    role,
    permissions,
    email,
    profile_pic_url,
    display_name
)
VALUES (
    'rehman',
    '$2b$10$u9EJw2eJHkZbA8KjFJmU1u8z4Lz6kE0Yy3mvkSIRdYBq7YzvYwG8C', -- dummy bcrypt hash for "password123"
    'manager',
    '[]'::jsonb,
    'abdurrehman.swe@gmail.com',
    'https://cdn-icons-png.flaticon.com/128/1077/1077012.png',
    'Rehman'
);
