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


SELECT * FROM projects WHERE created_by = '8a35da11-12ca-419d-bb85-111c025e6777';


ALTER TABLE projects
ALTER COLUMN cover_image_url SET DEFAULT 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHNvZnR3YXJlfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600',
ALTER COLUMN icon_url SET DEFAULT 'https://cdn-icons-png.flaticon.com/128/1383/1383970.png';

ALTER TABLE projects
ADD CONSTRAINT projects_name_key UNIQUE (name);

UPDATE projects
SET start_date = CURRENT_DATE
WHERE start_date IS NULL;

UPDATE projects
SET end_date = CURRENT_DATE
WHERE end_date IS NULL;

ALTER TABLE projects
ALTER COLUMN start_date SET NOT NULL,
ALTER COLUMN end_date SET NOT NULL;
