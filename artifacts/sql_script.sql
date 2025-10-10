-- =====================================================
-- EXTENSIONS
-- =====================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =====================================================
-- ENUM TYPES
-- =====================================================
CREATE TYPE project_status AS ENUM ('draft','active','on_hold','completed','archived');

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    permissions TEXT[] DEFAULT '{}',
    email VARCHAR(100) UNIQUE,
    profile_pic_url TEXT,
    display_name VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================
-- PROJECTS TABLE
-- =====================================================
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(160) UNIQUE,
    description TEXT,
    cover_image_url TEXT,
    icon_url TEXT,
    status project_status NOT NULL DEFAULT 'draft',
    start_date DATE,
    end_date DATE CHECK (end_date IS NULL OR end_date >= start_date),
    tags JSONB,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    member_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_projects_status ON projects (status);
CREATE INDEX idx_projects_created_by ON projects (created_by);
CREATE INDEX idx_projects_tags ON projects USING GIN (tags);

-- =====================================================
-- SPECBOT CHATS TABLE
-- =====================================================
CREATE TABLE specbot_chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150),
    last_interaction_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- GROUP CHATS TABLE
-- =====================================================
CREATE TABLE group_chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    creator_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- GROUP CHAT MEMBERS TABLE (JOIN TABLE)
-- =====================================================
CREATE TABLE group_chat_members (
    group_chat_id UUID REFERENCES group_chats(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member',
    joined_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (group_chat_id, user_id)
);

-- =====================================================
-- MESSAGES TABLE (USED BY BOTH SPECBOT & GROUP CHATS)
-- =====================================================
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID NOT NULL,
    chat_type VARCHAR(20) NOT NULL CHECK (chat_type IN ('specbot', 'group')),
    sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
    message_text TEXT,
    is_edited BOOLEAN DEFAULT FALSE,
    starter_message BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_messages_chat_type ON messages (chat_type);
CREATE INDEX idx_messages_sender_id ON messages (sender_id);

-- =====================================================
-- TRIGGERS TO AUTO-UPDATE updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION trg_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all timestamped tables
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trg_set_updated_at();

CREATE TRIGGER trg_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE PROCEDURE trg_set_updated_at();

CREATE TRIGGER trg_specbot_chats_updated_at
BEFORE UPDATE ON specbot_chats
FOR EACH ROW
EXECUTE PROCEDURE trg_set_updated_at();

CREATE TRIGGER trg_group_chats_updated_at
BEFORE UPDATE ON group_chats
FOR EACH ROW
EXECUTE PROCEDURE trg_set_updated_at();

CREATE TRIGGER trg_messages_updated_at
BEFORE UPDATE ON messages
FOR EACH ROW
EXECUTE PROCEDURE trg_set_updated_at();

-- =====================================================
-- END OF SCRIPT
-- =====================================================
