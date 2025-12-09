------------------------------------------------------------
-- EXTENSIONS
------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto;

------------------------------------------------------------
-- ROLES TABLE
------------------------------------------------------------
CREATE TABLE Roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL
);

------------------------------------------------------------
-- PERMISSIONS TABLE
------------------------------------------------------------
CREATE TABLE Permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL
);

------------------------------------------------------------
-- ROLE-PERMISSION TABLE
------------------------------------------------------------
CREATE TABLE RolePermission (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL,
    permission_id UUID NOT NULL,
    FOREIGN KEY (role_id) REFERENCES Roles(id),
    FOREIGN KEY (permission_id) REFERENCES Permissions(id),
    UNIQUE (role_id, permission_id)
);

------------------------------------------------------------
-- USERS TABLE
------------------------------------------------------------
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'client',
    permissions JSONB DEFAULT '[]', -- Flexible JSON permissions
    email VARCHAR(255) UNIQUE NOT NULL,
    profile_pic_url TEXT DEFAULT 'https://cdn-icons-png.flaticon.com/128/1077/1077012.png',
    display_name VARCHAR(150),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

------------------------------------------------------------
-- PROJECTS TABLE
------------------------------------------------------------
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    cover_image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHNvZnR3YXJlfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600',
    icon_url TEXT DEFAULT 'https://cdn-icons-png.flaticon.com/128/1383/1383970.png',
    status VARCHAR(50) DEFAULT 'active',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    tags JSONB DEFAULT '[]',
	members JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(id) ON DELETE CASCADE
);

------------------------------------------------------------
-- SPECBOT CHATS TABLE
------------------------------------------------------------
CREATE TABLE specbot_chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
	updated_at TIMESTAMPTZ DEFAULT NOW();
	user_id UUID REFERENCES users(id) ON DELETE CASCADE,
	project_id UUID REFERENCES projects(id) ON DELETE CASCADE
);

------------------------------------------------------------
-- GROUP CHAT TABLE
------------------------------------------------------------
CREATE TABLE group_chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    members JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    project_id UUID UNIQUE REFERENCES projects(id) ON DELETE CASCADE
);

------------------------------------------------------------
-- MESSAGES TABLE
------------------------------------------------------------
-- Create enums
CREATE TYPE chat_type_enum AS ENUM ('specbot','group');
CREATE TYPE sender_type_enum AS ENUM ('user','bot');

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_type chat_type_enum NOT NULL,
    chat_id UUID NOT NULL, -- reference depends on chat_type
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}', -- For reactions, etc.
    created_at TIMESTAMPTZ DEFAULT NOW(),
    sender_type sender_type_enum NOT NULL,
	sender_id UUID REFERENCES users(id) ON DELETE SET NULL DEFAULT NULL
);

------------------------------------------------------------
-- FEEDBACKS TABLE
------------------------------------------------------------
CREATE TABLE feedbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255),
    description TEXT,
    status VARCHAR(50) DEFAULT 'open', -- e.g., open, submitted etc
    form_structure JSONB, -- Structure of feedback form
    response JSONB, -- Submitted feedback data
    created_at TIMESTAMPTZ DEFAULT NOW(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE
);

------------------------------------------------------------
-- MEETINGS TABLE
------------------------------------------------------------
CREATE TABLE meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255),
    description TEXT,
    type VARCHAR(50) DEFAULT 'online', -- online, offline, hybrid
    status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, ongoing, completed
    link TEXT, -- meeting link
    room_id VARCHAR(100), -- For integrated meeting rooms
    scheduled_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    is_recurring BOOLEAN DEFAULT FALSE,
    participants JSONB DEFAULT '[]', -- Store list of participant ids
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE
);

------------------------------------------------------------
-- RECORDINGS TABLE
------------------------------------------------------------
CREATE TABLE recordings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255),
    recording_url TEXT,
    transcript_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE
);

------------------------------------------------------------
-- REQUIREMENTS TABLE
------------------------------------------------------------
CREATE TABLE requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(50) DEFAULT 'medium', -- low, medium, high
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, completed
    metadata JSONB DEFAULT '{}', -- Additional info (e.g., tags, attachments)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE
);