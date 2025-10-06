import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Meeting = sequelize.define(
  "Meeting",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    stakeholders: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    scheduled_by: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    meeting_link: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isUrl: true,
      },
    },
    recording_link: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    scheduled_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    is_completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    // Future AI/NLP integration fields
    transcript_summary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    requirement_extraction: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    tableName: "meetings",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ["is_completed"],
      },
      {
        fields: ["scheduled_at"],
      },
    ],
  }
);

export default Meeting;
