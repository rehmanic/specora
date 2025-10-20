------------------------------------------------------------
-- EXTENSIONS
------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto;

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
    profile_pic_url TEXT,
    display_name VARCHAR(150),
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

------------------------------------------------------------
-- PROJECTS TABLE
------------------------------------------------------------
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    icon_url TEXT,
    status VARCHAR(50) DEFAULT 'active',
    start_date DATE,
    end_date DATE,
    tags JSONB DEFAULT '[]', -- List of tags
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    is_archived BOOLEAN DEFAULT FALSE,
    member_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

------------------------------------------------------------
-- USERS_PROJECTS (JOIN TABLE for M:N relation)
------------------------------------------------------------
CREATE TABLE users_projects (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member', -- e.g., owner, contributor, viewer
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, project_id)
);

------------------------------------------------------------
-- SPECBOT CHATS TABLE
------------------------------------------------------------
CREATE TABLE specbot_chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255),
    members JSONB DEFAULT '[]', -- Store user IDs or metadata
    created_at TIMESTAMPTZ DEFAULT NOW()
);

------------------------------------------------------------
-- GROUP CHAT TABLE
------------------------------------------------------------
CREATE TABLE group_chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
    members JSONB DEFAULT '[]', -- Store user IDs or metadata
    created_at TIMESTAMPTZ DEFAULT NOW()
);

------------------------------------------------------------
-- FEEDBACKS TABLE
------------------------------------------------------------
CREATE TABLE feedbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255),
    description TEXT,
    status VARCHAR(50) DEFAULT 'open', -- e.g., open, in_review, resolved
    form_structure JSONB, -- Structure of feedback form
    response JSONB, -- Submitted feedback data
    created_at TIMESTAMPTZ DEFAULT NOW()
);

------------------------------------------------------------
-- MEETINGS TABLE
------------------------------------------------------------
CREATE TABLE meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255),
    description TEXT,
    type VARCHAR(50) DEFAULT 'online', -- online, offline, hybrid
    status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, ongoing, completed
    link TEXT, -- meeting link
    room_id VARCHAR(100), -- For integrated meeting rooms
    scheduled_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    is_recurring BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

------------------------------------------------------------
-- RECORDINGS TABLE
------------------------------------------------------------
CREATE TABLE recordings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
    title VARCHAR(255),
    participants JSONB DEFAULT '[]', -- Store list of participants or user info
    recording_url TEXT,
    transcript_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

------------------------------------------------------------
-- REQUIREMENTS TABLE
------------------------------------------------------------
CREATE TABLE requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(50) DEFAULT 'medium', -- low, medium, high
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, completed
    metadata JSONB DEFAULT '{}', -- Additional info (e.g., tags, attachments)
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

------------------------------------------------------------
-- MESSAGES TABLE
------------------------------------------------------------
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_type VARCHAR(50) NOT NULL CHECK (chat_type IN ('specbot', 'group')),
    chat_id UUID NOT NULL, -- references depends on chat_type
    sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}', -- For attachments, reactions, etc.
    created_at TIMESTAMPTZ DEFAULT NOW()
);