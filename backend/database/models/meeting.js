import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Meeting = sequelize.define(
  "Meeting",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'meeting_id'
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    meetingType: {
      type: DataTypes.ENUM('virtual', 'in-person', 'hybrid'),
      allowNull: false,
      defaultValue: 'virtual',
      field: 'meeting_type'
    },
    status: {
      type: DataTypes.ENUM('scheduled', 'in-progress', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'scheduled'
    },
    meetingLink: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'meeting_link'
    },
    roomId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
      field: 'room_id'
    },
    scheduledAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'scheduled_at'
    },
    startedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'started_at'
    },
    endedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'ended_at'
    },
    durationMinutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 60,
      field: 'duration_minutes'
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'created_by'
    },
    scheduledByName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'scheduled_by_name'
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'project_id'
    },
    isRecurring: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_recurring'
    },
    recurrencePattern: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'recurrence_pattern'
    },
    // AI/NLP integration fields
    transcriptSummary: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'transcript_summary'
    },
    requirementExtraction: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'requirement_extraction'
    }
  },
  {
    tableName: "meetings",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
    indexes: [
      { fields: ['status'] },
      { fields: ['scheduled_at'] },
      { fields: ['created_by'] },
      { fields: ['room_id'] }
    ]
  }
);

export default Meeting;
