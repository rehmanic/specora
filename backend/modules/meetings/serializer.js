/**
 * Serializer to transform backend meeting data to frontend format
 */

/**
 * Transform a single meeting object to frontend format
 * @param {Object} meeting - Meeting object from database
 * @returns {Object} - Transformed meeting object
 */
export const serializeMeeting = (meeting) => {
  if (!meeting) return null;

  // Handle both plain object and Sequelize model instance
  const meetingData = meeting.toJSON ? meeting.toJSON() : meeting;

  // Extract participants emails for stakeholders array
  // Handle both 'participants' (alias) and 'MeetingParticipants' (model name)
  const participantsList = meetingData.participants || meetingData.MeetingParticipants || [];
  const stakeholders = participantsList
    .map(p => p.email || p.userId || p.name)
    .filter(Boolean);

  return {
    id: meetingData.meeting_id || meetingData.id,
    name: meetingData.title,
    description: meetingData.description,
    stakeholders,
    scheduled_by: meetingData.scheduledByName || meetingData.scheduled_by_name || "System",
    scheduled_at: meetingData.scheduled_at || meetingData.scheduledAt,
    meeting_link: meetingData.meeting_link || meetingData.meetingLink,
    room_id: meetingData.room_id || meetingData.roomId,
    recording_link: meetingData.recording_link || meetingData.recordingLink || null,
    is_completed: meetingData.status === 'completed',
    status: meetingData.status,
    meeting_type: meetingData.meeting_type || meetingData.meetingType,
    duration_minutes: meetingData.duration_minutes || meetingData.durationMinutes,
    location: meetingData.location,
    started_at: meetingData.started_at || meetingData.startedAt,
    ended_at: meetingData.ended_at || meetingData.endedAt,
    is_recurring: meetingData.is_recurring || meetingData.isRecurring,
    created_at: meetingData.created_at || meetingData.createdAt,
    updated_at: meetingData.updated_at || meetingData.updatedAt,
  };
};

/**
 * Transform array of meetings to frontend format
 * @param {Array} meetings - Array of meeting objects
 * @returns {Array} - Array of transformed meeting objects
 */
export const serializeMeetings = (meetings) => {
  if (!meetings || !Array.isArray(meetings)) return [];
  return meetings.map(serializeMeeting);
};

/**
 * Transform meeting data from frontend format to backend format
 * @param {Object} data - Meeting data from frontend
 * @param {String} userId - User ID of the creator
 * @returns {Object} - Transformed data for backend
 */
export const deserializeMeeting = (data, userId = "user-123") => {
  return {
    title: data.name || data.title,
    description: data.description,
    scheduled_at: data.scheduled_at,
    duration_minutes: data.duration_minutes || 60,
    meeting_type: data.meeting_type || 'virtual',
    location: data.location,
    created_by: userId,
    is_recurring: data.is_recurring || false,
    recurrence_pattern: data.recurrence_pattern,
    // Transform stakeholders array to participants
    participants: data.stakeholders
      ? data.stakeholders.map(email => ({
          email,
          role_in_meeting: 'attendee',
          is_required: true,
        }))
      : [],
  };
};
