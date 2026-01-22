-- 1. ROLES & PERMISSIONS
INSERT INTO role (name) VALUES ('client'), ('manager'), ('requirements_engineer');

-- Basic permissions for the new roles
INSERT INTO permission (name) VALUES ('view_reports'), ('manage_requirements'), ('approve_scope'), ('edit_project');

-- Assign Permissions (Example Mapping)
INSERT INTO role_permission (role_id, permission_id)
SELECT r.id, p.id FROM role r, permission p 
WHERE (r.name = 'manager' AND p.name IN ('manage_requirements', 'edit_project'))
   OR (r.name = 'client' AND p.name = 'approve_scope')
   OR (r.name = 'requirements_engineer' AND p.name = 'manage_requirements');

-- 2. USERS (Mapped to your 3 new roles)
INSERT INTO app_user (username, display_name, password_hash, email, role_id)
VALUES 
('big_boss', 'Corporate Client', 'hash_1', 'client@corp.com', (SELECT id FROM role WHERE name = 'client')),
('pm_sarah', 'Sarah Manager', 'hash_2', 'sarah@agency.com', (SELECT id FROM role WHERE name = 'manager')),
('eng_dev', 'Dev Requirements', 'hash_3', 'dev@tech.com', (SELECT id FROM role WHERE name = 'requirements_engineer'));

-- 3. PROJECTS (Created by the Manager)
INSERT INTO project (name, slug, description, start_date, end_date, tags, created_by)
VALUES 
('Inventory System', 'inv-sys', 'Enterprise inventory tracking.', '2026-03-01', '2026-09-01', ARRAY['logistics', 'sql'], (SELECT id FROM app_user WHERE username = 'pm_sarah'));

-- 4. PROJECT MEMBERS
INSERT INTO project_member (project_id, member_id)
VALUES 
((SELECT id FROM project WHERE slug = 'inv-sys'), (SELECT id FROM app_user WHERE username = 'pm_sarah')),
((SELECT id FROM project WHERE slug = 'inv-sys'), (SELECT id FROM app_user WHERE username = 'eng_dev')),
((SELECT id FROM project WHERE slug = 'inv-sys'), (SELECT id FROM app_user WHERE username = 'big_boss'));

-- 5. CHATS
INSERT INTO group_chat (project_id) 
SELECT id FROM project WHERE slug = 'inv-sys';

INSERT INTO group_message (content, group_chat_id)
VALUES ('Requirement gathering starts today.', (SELECT id FROM group_chat LIMIT 1));

-- 6. FEEDBACK
INSERT INTO feedback (title, description, status, form_structure, project_id)
VALUES 
('Stakeholder Review', 'Client feedback on initial wireframes.', 'created', '{"fields": [{"name": "approved", "type": "boolean"}]}', (SELECT id FROM project WHERE slug = 'inv-sys'));

-- 7. REQUIREMENTS (Managed by Requirements Engineer)
INSERT INTO requirement (title, description, priority, status, project_id)
VALUES 
('Real-time Tracking', 'Track items with < 1s latency.', 'high', 'pending', (SELECT id FROM project WHERE slug = 'inv-sys'));