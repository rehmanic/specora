import Meeting from './meeting.js';
import MeetingParticipant from './meetingParticipant.js';
import MeetingAgenda from './meetingAgenda.js';
import MeetingActionItem from './meetingActionItem.js';

// Meeting has many Participants
Meeting.hasMany(MeetingParticipant, {
  foreignKey: 'meetingId',
  as: 'participants',
  onDelete: 'CASCADE'
});
MeetingParticipant.belongsTo(Meeting, {
  foreignKey: 'meetingId',
  as: 'meeting'
});

// Meeting has many Agendas
Meeting.hasMany(MeetingAgenda, {
  foreignKey: 'meetingId',
  as: 'agendas',
  onDelete: 'CASCADE'
});
MeetingAgenda.belongsTo(Meeting, {
  foreignKey: 'meetingId',
  as: 'meeting'
});

// Meeting has many Action Items
Meeting.hasMany(MeetingActionItem, {
  foreignKey: 'meetingId',
  as: 'actionItems',
  onDelete: 'CASCADE'
});
MeetingActionItem.belongsTo(Meeting, {
  foreignKey: 'meetingId',
  as: 'meeting'
});

export {
  Meeting,
  MeetingParticipant,
  MeetingAgenda,
  MeetingActionItem
};
