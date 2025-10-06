-- Specora Database Schema - Meetings Module
-- PostgreSQL Migration Script

-- Create meetings table
CREATE TABLE IF NOT EXISTS meetings (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  stakeholders TEXT[] NOT NULL DEFAULT '{}',
  scheduled_by VARCHAR(100) NOT NULL,
  meeting_link TEXT NOT NULL,
  recording_link TEXT,
  scheduled_at TIMESTAMP NOT NULL DEFAULT NOW(),
  is_completed BOOLEAN NOT NULL DEFAULT false,
  
  -- Future AI/NLP integration fields
  transcript_summary TEXT,
  requirement_extraction JSONB,
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_meetings_is_completed ON meetings(is_completed);
CREATE INDEX IF NOT EXISTS idx_meetings_scheduled_at ON meetings(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_meetings_scheduled_by ON meetings(scheduled_by);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_meetings_updated_at
BEFORE UPDATE ON meetings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE meetings IS 'Stores meeting information for requirements engineering sessions';
COMMENT ON COLUMN meetings.name IS 'Meeting title/name';
COMMENT ON COLUMN meetings.description IS 'Meeting description and agenda';
COMMENT ON COLUMN meetings.stakeholders IS 'Array of stakeholder email addresses';
COMMENT ON COLUMN meetings.scheduled_by IS 'Name of the person who scheduled the meeting';
COMMENT ON COLUMN meetings.meeting_link IS 'Video conference link (Google Meet, Zoom, etc.)';
COMMENT ON COLUMN meetings.recording_link IS 'Link to meeting recording (for completed meetings)';
COMMENT ON COLUMN meetings.scheduled_at IS 'Scheduled date and time of the meeting';
COMMENT ON COLUMN meetings.is_completed IS 'Whether the meeting has been completed';
COMMENT ON COLUMN meetings.transcript_summary IS 'AI-generated summary of meeting transcript';
COMMENT ON COLUMN meetings.requirement_extraction IS 'JSON data containing extracted requirements from meeting';

-- Insert sample data (optional - for testing)
INSERT INTO meetings (name, description, stakeholders, scheduled_by, meeting_link, scheduled_at, is_completed) VALUES
('Sprint Planning - Q1 2025', 'Discuss requirements gathering strategies for the new e-commerce module', 
 ARRAY['alice@specora.com', 'bob@specora.com', 'charlie@specora.com'], 
 'John Doe', 'https://meet.google.com/abc-defg-hij', 
 NOW() + INTERVAL '1 day', false),

('Client Requirements Review', 'Review and validate requirements with stakeholders', 
 ARRAY['client@company.com', 'manager@specora.com'], 
 'Jane Smith', 'https://zoom.us/j/123456789', 
 NOW() + INTERVAL '2 days', false);

INSERT INTO meetings (name, description, stakeholders, scheduled_by, meeting_link, recording_link, scheduled_at, is_completed) VALUES
('Initial Requirements Workshop', 'Kickoff meeting to gather initial requirements from all stakeholders', 
 ARRAY['stakeholder1@company.com', 'stakeholder2@company.com'], 
 'John Doe', 'https://meet.google.com/past-meeting-1', 
 'https://drive.google.com/file/d/recording123',
 NOW() - INTERVAL '7 days', true);

-- Display success message
SELECT 'Meetings table created successfully!' AS message;
