------------------------------------------------------------
-- EXTENSIONS
------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto;

------------------------------------------------------------
-- ROLE TABLE
------------------------------------------------------------
CREATE TABLE role (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL
);

------------------------------------------------------------
-- PERMISSION TABLE
------------------------------------------------------------
CREATE TABLE permission (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL
);

------------------------------------------------------------
-- ROLE_PERMISSION TABLE
------------------------------------------------------------
CREATE TABLE role_permission (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL,
    permission_id UUID NOT NULL,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (permission_id) REFERENCES permission(id)
);

------------------------------------------------------------
-- APP_USER TABLE
------------------------------------------------------------
CREATE TABLE app_user (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
	display_name VARCHAR(150),
    password_hash TEXT NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    profile_pic_url TEXT DEFAULT 'https://cdn-icons-png.flaticon.com/128/1077/1077012.png',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
	role_id UUID NOT NULL,
	FOREIGN KEY (role_id) REFERENCES role(id)
);

------------------------------------------------------------
-- PROJECT TABLE
------------------------------------------------------------
CREATE TABLE project (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    cover_image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHNvZnR3YXJlfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600',
    icon_url TEXT DEFAULT 'https://cdn-icons-png.flaticon.com/128/1383/1383970.png',
    status VARCHAR(50) DEFAULT 'active',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES app_user(id)
);

------------------------------------------------------------
-- PROJECT_MEMBER TABLE
------------------------------------------------------------
CREATE TABLE project_member (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	project_id UUID NOT NULL,
	member_id UUID NOT NULL,
	FOREIGN KEY (project_id) REFERENCES project(id),
	FOREIGN KEY (member_id) REFERENCES app_user(id)
);

------------------------------------------------------------
-- GROUP_CHAT TABLE
------------------------------------------------------------
CREATE TABLE group_chat (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	project_id UUID NOT NULL,
    attachments JSONB,
	FOREIGN KEY (project_id) REFERENCES project(id)
);

------------------------------------------------------------
-- GROUP_MESSAGE TABLE
------------------------------------------------------------
CREATE TABLE group_message(
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	content TEXT NOT NULL,
	metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
	group_chat_id UUID NOT NULL,
    sender_id UUID NOT NULL,
	FOREIGN KEY (group_chat_id) REFERENCES group_chat(id),
    FOREIGN KEY (sender_id) REFERENCES app_user(id)
);

------------------------------------------------------------
-- SPECBOT_CHAT TABLE
------------------------------------------------------------
CREATE TABLE specbot_chat (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
	updated_at TIMESTAMPTZ DEFAULT NOW(),
	project_id UUID NOT NULL,
	FOREIGN KEY (project_id) REFERENCES project(id)
);

------------------------------------------------------------
-- SPECBOT_MESSAGE TABLE
------------------------------------------------------------
CREATE TABLE specbot_message(
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	content TEXT NOT NULL,
	metadata JSONB,
	specbot_chat_id UUID NOT NULL,
	FOREIGN KEY (specbot_chat_id) REFERENCES specbot_chat(id)
);

------------------------------------------------------------
-- FEEDBACK TABLE
------------------------------------------------------------
CREATE TYPE feedback_status_enum AS ENUM ('created','sent','opened','submitted','closed','edited');

CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    status feedback_status_enum NOT NULL,
    form_structure JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
	updated_at TIMESTAMPTZ DEFAULT NOW(),
    project_id UUID NOT NULL,
	FOREIGN KEY (project_id) REFERENCES project(id)
);

------------------------------------------------------------
-- FEEDBACK_RESPONSE TABLE
------------------------------------------------------------
CREATE TABLE feedback_response (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
	updated_at TIMESTAMPTZ DEFAULT NOW(),
    feedback_id UUID NOT NULL,
	FOREIGN KEY (feedback_id) REFERENCES feedback(id)
);

------------------------------------------------------------
-- REQUIREMENTS TABLE
------------------------------------------------------------
CREATE TYPE requirement_status_enum AS ENUM ('approved','pending','rejected');
CREATE TYPE requirement_priority_enum AS ENUM ('low','mid','high');

CREATE TABLE requirement (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority requirement_priority_enum NOT NULL,
    status requirement_status_enum NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    project_id UUID NOT NULL,
	FOREIGN KEY (project_id) REFERENCES project(id)
);