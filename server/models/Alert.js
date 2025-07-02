import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import WiFiLocation from './WiFiLocation.js';

const Alert = sequelize.define('alerts', {
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
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('status_change', 'connection_lost', 'connection_restored'),
    allowNull: false
  },
  previous_status: {
    type: DataTypes.ENUM('online', 'offline', 'unknown'),
    allowNull: true
  },
  current_status: {
    type: DataTypes.ENUM('online', 'offline', 'unknown'),
    allowNull: false
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  email_sent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  email_sent_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

// Associations
Alert.belongsTo(WiFiLocation, {
  foreignKey: 'location_id',
  as: 'location'
});

WiFiLocation.hasMany(Alert, {
  foreignKey: 'location_id',
  as: 'alerts'
});

export default Alert;