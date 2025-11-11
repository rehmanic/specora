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

SELECT * FROM users;


-- Step 1: Drop the old foreign key constraint
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_created_by_fkey;

-- Step 2: Change created_by column type from VARCHAR(100) → UUID
ALTER TABLE projects 
    ALTER COLUMN created_by TYPE UUID USING created_by::uuid;

-- Step 3: Add new FK referencing users.id
ALTER TABLE projects 
    ADD CONSTRAINT projects_created_by_fkey 
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE;
