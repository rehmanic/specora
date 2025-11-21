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


CREATE TABLE Roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE Permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE RolePermission (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL,
    permission_id UUID NOT NULL,
    FOREIGN KEY (role_id) REFERENCES Roles(id),
    FOREIGN KEY (permission_id) REFERENCES Permissions(id),
    UNIQUE (role_id, permission_id)
);

ALTER TABLE specbot_chats
ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();


-- 1. Add the sender_type column with constraint
ALTER TABLE messages
ADD COLUMN sender_type VARCHAR(10) 
    CHECK (sender_type IN ('user','bot')) 
    NOT NULL;

-- 2. Modify sender_id to allow NULL and have default NULL
ALTER TABLE messages
ALTER COLUMN sender_id DROP NOT NULL,
ALTER COLUMN sender_id SET DEFAULT NULL;


-- Create enums
CREATE TYPE chat_type_enum AS ENUM ('specbot','group');
CREATE TYPE sender_type_enum AS ENUM ('user','bot');

-- Alter table columns to use enums
ALTER TABLE messages
  ALTER COLUMN chat_type TYPE chat_type_enum USING chat_type::chat_type_enum;

ALTER TABLE messages
  ALTER COLUMN sender_type TYPE sender_type_enum USING sender_type::sender_type_enum;

DROP TABLE messages

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_type chat_type_enum NOT NULL,
    chat_id UUID NOT NULL, -- references depends on chat_type
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}', -- For reactions, etc.
    created_at TIMESTAMPTZ DEFAULT NOW(),
    sender_type sender_type_enum NOT NULL,
	sender_id UUID REFERENCES users(id) ON DELETE SET NULL DEFAULT NULL
);


SELECT * FROM specbot_chats;

DELETE FROM specbot_chats
WHERE title = 'Test Specbot Chat 0';

-- Make the column NOT NULL
ALTER TABLE specbot_chats
ALTER COLUMN title SET NOT NULL;

-- Add a UNIQUE constraint
ALTER TABLE specbot_chats
ADD CONSTRAINT specbot_chats_title_unique UNIQUE (title);

