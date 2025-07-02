import sequelize from '../config/database.js';
import User from './User.js';
import WiFiLocation from './WiFiLocation.js';
import MonitoringLog from './MonitoringLog.js';
import Alert from './Alert.js';

// Initialize all models
const models = {
  User,
  WiFiLocation,
  MonitoringLog,
  Alert
};

// Sync database
const syncDatabase = async (force = false) => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    await sequelize.sync({ force });
    console.log('✅ Database synchronized successfully.');
    
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    return false;
  }
};

export {
  sequelize,
  User,
  WiFiLocation,
  MonitoringLog,
  Alert,
  syncDatabase
};