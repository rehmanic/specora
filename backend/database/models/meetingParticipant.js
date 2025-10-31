import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

const MeetingParticipant = sequelize.define('MeetingParticipant', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'participant_id'
  },
  meetingId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'meeting_id',
    references: {
      model: 'meetings',
      key: 'meeting_id'
    },
    onDelete: 'CASCADE'
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'user_id'
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  roleInMeeting: {
    type: DataTypes.ENUM('organizer', 'attendee', 'presenter', 'moderator'),
    allowNull: false,
    defaultValue: 'attendee',
    field: 'role_in_meeting'
  },
  attendanceStatus: {
    type: DataTypes.ENUM('invited', 'accepted', 'declined', 'tentative', 'attended', 'absent'),
    allowNull: false,
    defaultValue: 'invited',
    field: 'attendance_status'
  },
  joinedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'joined_at'
  },
  leftAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'left_at'
  },
  responseMessage: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'response_message'
  },
  isRequired: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_required'
  }
}, {
  tableName: 'meeting_participants',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true,
  indexes: [
    { fields: ['meeting_id'] },
    { fields: ['user_id'] },
    { fields: ['email'] },
    { fields: ['attendance_status'] }
  ]
});

export default MeetingParticipant;
