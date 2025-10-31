import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

const MeetingAgenda = sequelize.define('MeetingAgenda', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'agenda_id'
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
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'display_order'
  },
  allocatedMinutes: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'allocated_minutes'
  },
  presenterId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'presenter_id'
  },
  status: {
    type: DataTypes.ENUM('pending', 'in-progress', 'completed', 'skipped'),
    allowNull: false,
    defaultValue: 'pending'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  attachments: {
    type: DataTypes.JSONB,
    allowNull: true
  }
}, {
  tableName: 'meeting_agendas',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true,
  indexes: [
    { fields: ['meeting_id'] },
    { fields: ['presenter_id'] },
    { fields: ['display_order'] },
    { fields: ['status'] }
  ]
});

export default MeetingAgenda;
