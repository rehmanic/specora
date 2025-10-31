-- =====================================================
-- SPECORA MEETINGS MODULE - DATABASE SCHEMA
-- =====================================================
-- Version: 1.0.0
-- Created: October 9, 2025
-- Description: Complete database schema for meetings module
-- with all tables, relationships, indexes, and constraints
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- TABLE 1: MEETINGS (Main Table)
-- =====================================================
CREATE TABLE IF NOT EXISTS meetings (
    -- Primary Key
    meeting_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basic Information
    title VARCHAR(200) NOT NULL,
    description TEXT,
    
    -- Meeting Type & Status
    meeting_type VARCHAR(50) NOT NULL DEFAULT 'virtual' 
        CHECK (meeting_type IN ('virtual', 'in-person', 'hybrid')),
    status VARCHAR(30) NOT NULL DEFAULT 'scheduled' 
        CHECK (status IN ('scheduled', 'in-progress', 'completed', 'cancelled')),
    
    -- Links & Access
    meeting_link VARCHAR(500),
    room_id VARCHAR(100) UNIQUE,  -- For WebRTC video conferencing
    
    -- Scheduling
    scheduled_at TIMESTAMP NOT NULL,
    started_at TIMESTAMP,
    ended_at TIMESTAMP,
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    
    -- Location (for in-person/hybrid)
    location VARCHAR(255),
    
    -- Relationships
    created_by UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    project_id UUID,  -- Optional link to project
    
    -- Recurring Meetings
    is_recurring BOOLEAN NOT NULL DEFAULT false,
    recurrence_pattern JSONB,  -- Stores: {frequency: 'daily/weekly/monthly', interval: 1, until: '2025-12-31'}
    
    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_time_range CHECK (ended_at IS NULL OR ended_at >= started_at),
    CONSTRAINT valid_schedule CHECK (scheduled_at >= created_at)
);

-- Indexes for meetings table
CREATE INDEX idx_meetings_created_by ON meetings(created_by);
CREATE INDEX idx_meetings_scheduled_at ON meetings(scheduled_at);
CREATE INDEX idx_meetings_status ON meetings(status);
CREATE INDEX idx_meetings_room_id ON meetings(room_id);
CREATE INDEX idx_meetings_project_id ON meetings(project_id);
CREATE INDEX idx_meetings_created_at ON meetings(created_at DESC);

-- =====================================================
-- TABLE 2: MEETING_PARTICIPANTS (Junction Table)
-- =====================================================
CREATE TABLE IF NOT EXISTS meeting_participants (
    -- Primary Key
    participant_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Foreign Keys
    meeting_id UUID NOT NULL REFERENCES meetings(meeting_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,  -- Internal users
    
    -- External Participants (guests not in Users table)
    email VARCHAR(100),
    name VARCHAR(100),
    
    -- Role & Status
    role_in_meeting VARCHAR(50) NOT NULL DEFAULT 'attendee' 
        CHECK (role_in_meeting IN ('organizer', 'attendee', 'presenter', 'moderator')),
    attendance_status VARCHAR(30) NOT NULL DEFAULT 'invited' 
        CHECK (attendance_status IN ('invited', 'accepted', 'declined', 'tentative', 'attended', 'absent')),
    
    -- Attendance Tracking
    joined_at TIMESTAMP,
    left_at TIMESTAMP,
    
    -- Response
    response_message TEXT,
    is_required BOOLEAN NOT NULL DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT participant_identity CHECK (
        (user_id IS NOT NULL) OR (email IS NOT NULL AND name IS NOT NULL)
    ),
    CONSTRAINT valid_attendance_time CHECK (left_at IS NULL OR left_at >= joined_at),
    CONSTRAINT unique_internal_participant UNIQUE(meeting_id, user_id),
    CONSTRAINT unique_external_participant UNIQUE(meeting_id, email)
);

-- Indexes for meeting_participants table
CREATE INDEX idx_participants_meeting_id ON meeting_participants(meeting_id);
CREATE INDEX idx_participants_user_id ON meeting_participants(user_id);
CREATE INDEX idx_participants_email ON meeting_participants(email);
CREATE INDEX idx_participants_status ON meeting_participants(attendance_status);

-- =====================================================
-- TABLE 3: MEETING_RECORDINGS
-- =====================================================
CREATE TABLE IF NOT EXISTS meeting_recordings (
    -- Primary Key
    recording_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Foreign Key
    meeting_id UUID NOT NULL REFERENCES meetings(meeting_id) ON DELETE CASCADE,
    
    -- Recording Information
    title VARCHAR(200) NOT NULL,
    file_url VARCHAR(1000) NOT NULL,  -- Cloud storage URL (Google Drive, S3, etc)
    file_size_mb NUMERIC(10,2),
    duration_seconds INTEGER,
    
    -- Video Properties
    format VARCHAR(20) NOT NULL DEFAULT 'mp4' 
        CHECK (format IN ('mp4', 'webm', 'avi', 'mkv')),
    quality VARCHAR(20) NOT NULL DEFAULT '720p' 
        CHECK (quality IN ('360p', '480p', '720p', '1080p', '4k')),
    
    -- Transcript
    transcript_url VARCHAR(1000),
    
    -- Processing Status
    is_processed BOOLEAN NOT NULL DEFAULT false,
    processing_status VARCHAR(50) NOT NULL DEFAULT 'pending' 
        CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
    
    -- Upload Information
    uploaded_by UUID REFERENCES users(user_id) ON DELETE SET NULL,
    recorded_at TIMESTAMP NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for meeting_recordings table
CREATE INDEX idx_recordings_meeting_id ON meeting_recordings(meeting_id);
CREATE INDEX idx_recordings_uploaded_by ON meeting_recordings(uploaded_by);
CREATE INDEX idx_recordings_status ON meeting_recordings(processing_status);
CREATE INDEX idx_recordings_recorded_at ON meeting_recordings(recorded_at DESC);

-- =====================================================
-- TABLE 4: MEETING_AGENDAS
-- =====================================================
CREATE TABLE IF NOT EXISTS meeting_agendas (
    -- Primary Key
    agenda_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Foreign Key
    meeting_id UUID NOT NULL REFERENCES meetings(meeting_id) ON DELETE CASCADE,
    
    -- Agenda Information
    title VARCHAR(200) NOT NULL,
    description TEXT,
    
    -- Ordering & Timing
    display_order INTEGER NOT NULL DEFAULT 0,
    allocated_minutes INTEGER,  -- Time allocated for this item
    
    -- Presenter
    presenter_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    
    -- Status
    status VARCHAR(30) NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'in-progress', 'completed', 'skipped')),
    
    -- Additional Information
    notes TEXT,
    attachments JSONB,  -- [{name: 'doc.pdf', url: 'https://...', size: 1024}]
    
    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for meeting_agendas table
CREATE INDEX idx_agendas_meeting_id ON meeting_agendas(meeting_id);
CREATE INDEX idx_agendas_presenter_id ON meeting_agendas(presenter_id);
CREATE INDEX idx_agendas_order ON meeting_agendas(meeting_id, display_order);
CREATE INDEX idx_agendas_status ON meeting_agendas(status);

-- =====================================================
-- TABLE 5: MEETING_ACTION_ITEMS
-- =====================================================
CREATE TABLE IF NOT EXISTS meeting_action_items (
    -- Primary Key
    action_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Foreign Key
    meeting_id UUID NOT NULL REFERENCES meetings(meeting_id) ON DELETE CASCADE,
    
    -- Action Information
    title VARCHAR(200) NOT NULL,
    description TEXT,
    
    -- Assignment
    assigned_to UUID REFERENCES users(user_id) ON DELETE SET NULL,
    created_by UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    
    -- Priority & Status
    priority VARCHAR(20) NOT NULL DEFAULT 'medium' 
        CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(30) NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'in-progress', 'completed', 'cancelled')),
    
    -- Deadlines
    due_date TIMESTAMP,
    completed_at TIMESTAMP,
    
    -- Tags for categorization
    tags TEXT[],  -- ['frontend', 'backend', 'urgent']
    
    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_completion CHECK (completed_at IS NULL OR completed_at >= created_at)
);

-- Indexes for meeting_action_items table
CREATE INDEX idx_actions_meeting_id ON meeting_action_items(meeting_id);
CREATE INDEX idx_actions_assigned_to ON meeting_action_items(assigned_to);
CREATE INDEX idx_actions_created_by ON meeting_action_items(created_by);
CREATE INDEX idx_actions_status ON meeting_action_items(status);
CREATE INDEX idx_actions_priority ON meeting_action_items(priority);
CREATE INDEX idx_actions_due_date ON meeting_action_items(due_date);
CREATE INDEX idx_actions_tags ON meeting_action_items USING GIN(tags);

-- =====================================================
-- TRIGGERS FOR AUTO-UPDATE TIMESTAMPS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON meetings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_participants_updated_at BEFORE UPDATE ON meeting_participants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recordings_updated_at BEFORE UPDATE ON meeting_recordings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agendas_updated_at BEFORE UPDATE ON meeting_agendas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_actions_updated_at BEFORE UPDATE ON meeting_action_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View: Upcoming Meetings with Participant Count
CREATE OR REPLACE VIEW v_upcoming_meetings AS
SELECT 
    m.meeting_id,
    m.title,
    m.description,
    m.meeting_type,
    m.status,
    m.meeting_link,
    m.room_id,
    m.scheduled_at,
    m.duration_minutes,
    m.location,
    m.created_by,
    u.user_name as organizer_name,
    u.email as organizer_email,
    COUNT(DISTINCT mp.participant_id) as participant_count,
    COUNT(DISTINCT mp.participant_id) FILTER (WHERE mp.attendance_status = 'accepted') as accepted_count,
    m.created_at
FROM meetings m
JOIN users u ON m.created_by = u.user_id
LEFT JOIN meeting_participants mp ON m.meeting_id = mp.meeting_id
WHERE m.status IN ('scheduled', 'in-progress')
    AND m.scheduled_at >= CURRENT_TIMESTAMP
GROUP BY m.meeting_id, u.user_id
ORDER BY m.scheduled_at ASC;

-- View: Completed Meetings with Recordings
CREATE OR REPLACE VIEW v_completed_meetings AS
SELECT 
    m.meeting_id,
    m.title,
    m.description,
    m.scheduled_at,
    m.started_at,
    m.ended_at,
    m.duration_minutes,
    EXTRACT(EPOCH FROM (m.ended_at - m.started_at))/60 as actual_duration_minutes,
    COUNT(DISTINCT mp.participant_id) as total_participants,
    COUNT(DISTINCT mp.participant_id) FILTER (WHERE mp.attendance_status = 'attended') as attended_count,
    COUNT(DISTINCT mr.recording_id) as recording_count,
    m.created_at
FROM meetings m
LEFT JOIN meeting_participants mp ON m.meeting_id = mp.meeting_id
LEFT JOIN meeting_recordings mr ON m.meeting_id = mr.meeting_id
WHERE m.status = 'completed'
GROUP BY m.meeting_id
ORDER BY m.scheduled_at DESC;

-- View: Action Items Dashboard
CREATE OR REPLACE VIEW v_action_items_dashboard AS
SELECT 
    a.action_id,
    a.title,
    a.description,
    a.priority,
    a.status,
    a.due_date,
    a.assigned_to,
    u_assigned.user_name as assigned_to_name,
    u_assigned.email as assigned_to_email,
    a.created_by,
    u_creator.user_name as creator_name,
    m.meeting_id,
    m.title as meeting_title,
    m.scheduled_at as meeting_date,
    CASE 
        WHEN a.due_date < CURRENT_TIMESTAMP AND a.status NOT IN ('completed', 'cancelled') 
        THEN true 
        ELSE false 
    END as is_overdue,
    a.created_at,
    a.updated_at
FROM meeting_action_items a
LEFT JOIN users u_assigned ON a.assigned_to = u_assigned.user_id
JOIN users u_creator ON a.created_by = u_creator.user_id
JOIN meetings m ON a.meeting_id = m.meeting_id
ORDER BY 
    CASE a.priority 
        WHEN 'critical' THEN 1
        WHEN 'high' THEN 2
        WHEN 'medium' THEN 3
        WHEN 'low' THEN 4
    END,
    a.due_date ASC NULLS LAST;

-- =====================================================
-- SAMPLE DATA FOR TESTING (Optional)
-- =====================================================

-- Note: This section should only be run in development/testing environments
-- Comment out or remove in production

/*
-- Insert sample meeting
INSERT INTO meetings (title, description, meeting_type, status, meeting_link, room_id, scheduled_at, duration_minutes, created_by)
VALUES (
    'Sprint Planning - Week 1',
    'Planning meeting for the first sprint of Specora project',
    'virtual',
    'scheduled',
    'https://meet.google.com/abc-defg-hij',
    'room-' || gen_random_uuid(),
    CURRENT_TIMESTAMP + INTERVAL '2 days',
    90,
    (SELECT user_id FROM users LIMIT 1)
);

-- Insert sample participants
INSERT INTO meeting_participants (meeting_id, user_id, role_in_meeting, attendance_status)
SELECT 
    (SELECT meeting_id FROM meetings ORDER BY created_at DESC LIMIT 1),
    user_id,
    CASE 
        WHEN ROW_NUMBER() OVER () = 1 THEN 'organizer'
        ELSE 'attendee'
    END,
    'invited'
FROM users
LIMIT 5;

-- Insert sample agenda items
INSERT INTO meeting_agendas (meeting_id, title, description, display_order, allocated_minutes)
VALUES 
    (
        (SELECT meeting_id FROM meetings ORDER BY created_at DESC LIMIT 1),
        'Review Previous Sprint',
        'Discuss achievements and blockers from last sprint',
        1,
        15
    ),
    (
        (SELECT meeting_id FROM meetings ORDER BY created_at DESC LIMIT 1),
        'Sprint Goals Discussion',
        'Define goals and objectives for current sprint',
        2,
        30
    ),
    (
        (SELECT meeting_id FROM meetings ORDER BY created_at DESC LIMIT 1),
        'Task Assignment',
        'Assign tasks to team members',
        3,
        45
    );
*/

-- =====================================================
-- PERMISSIONS & SECURITY (Optional - Row Level Security)
-- =====================================================

-- Enable Row Level Security
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_agendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_action_items ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view meetings they created or are participants in
CREATE POLICY meeting_select_policy ON meetings
    FOR SELECT
    USING (
        created_by = current_setting('app.current_user_id')::uuid
        OR meeting_id IN (
            SELECT meeting_id FROM meeting_participants 
            WHERE user_id = current_setting('app.current_user_id')::uuid
        )
    );

-- Policy: Users can insert meetings they create
CREATE POLICY meeting_insert_policy ON meetings
    FOR INSERT
    WITH CHECK (created_by = current_setting('app.current_user_id')::uuid);

-- Policy: Users can update their own meetings
CREATE POLICY meeting_update_policy ON meetings
    FOR UPDATE
    USING (created_by = current_setting('app.current_user_id')::uuid);

-- Policy: Users can delete their own meetings
CREATE POLICY meeting_delete_policy ON meetings
    FOR DELETE
    USING (created_by = current_setting('app.current_user_id')::uuid);

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE meetings IS 'Main table storing all meeting information including scheduling, status, and links';
COMMENT ON TABLE meeting_participants IS 'Junction table tracking both internal users and external guests participating in meetings';
COMMENT ON TABLE meeting_recordings IS 'Stores meeting recording files, transcripts, and processing metadata';
COMMENT ON TABLE meeting_agendas IS 'Agenda items for meetings with ordering and time allocation';
COMMENT ON TABLE meeting_action_items IS 'Action items and tasks arising from meetings with assignment tracking';

COMMENT ON COLUMN meetings.room_id IS 'Unique identifier for WebRTC video conferencing room';
COMMENT ON COLUMN meetings.recurrence_pattern IS 'JSON object storing recurring meeting configuration';
COMMENT ON COLUMN meeting_participants.role_in_meeting IS 'Role of participant: organizer, attendee, presenter, or moderator';
COMMENT ON COLUMN meeting_participants.attendance_status IS 'Current attendance status: invited, accepted, declined, tentative, attended, or absent';
COMMENT ON COLUMN meeting_recordings.processing_status IS 'Video processing status: pending, processing, completed, or failed';
COMMENT ON COLUMN meeting_action_items.priority IS 'Priority level: low, medium, high, or critical';

-- =====================================================
-- END OF SCHEMA
-- =====================================================
