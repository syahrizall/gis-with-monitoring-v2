import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import WiFiLocation from './WiFiLocation.js';

const MonitoringLog = sequelize.define('monitoring_logs', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  location_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: WiFiLocation,
      key: 'id'
    }
  },
  ip_address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('online', 'offline'),
    allowNull: false
  },
  response_time: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Response time in milliseconds'
  },
  error_message: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  checked_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

// Associations
MonitoringLog.belongsTo(WiFiLocation, {
  foreignKey: 'location_id',
  as: 'location'
});

WiFiLocation.hasMany(MonitoringLog, {
  foreignKey: 'location_id',
  as: 'monitoring_logs'
});

export default MonitoringLog;