import express from 'express';
import { Op } from 'sequelize';
import { sequelize, WiFiLocation, MonitoringLog, Alert } from '../models/index.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard data
router.get('/', authenticate, async (req, res) => {
  try {
    // Get location statistics
    const totalLocations = await WiFiLocation.count({
      where: { is_active: true }
    });

    const onlineLocations = await WiFiLocation.count({
      where: { status: 'online', is_active: true }
    });

    const offlineLocations = await WiFiLocation.count({
      where: { status: 'offline', is_active: true }
    });

    // Get recent monitoring logs (last 10)
    const recentLogs = await MonitoringLog.findAll({
      include: [{
        model: WiFiLocation,
        as: 'location',
        attributes: ['id', 'nama', 'alamat']
      }],
      limit: 10,
      order: [['checked_at', 'DESC']]
    });

    // Get recent alerts (last 5)
    const recentAlerts = await Alert.findAll({
      include: [{
        model: WiFiLocation,
        as: 'location',
        attributes: ['id', 'nama', 'alamat']
      }],
      limit: 5,
      order: [['created_at', 'DESC']]
    });

    // Get unread alerts count
    const unreadAlertsCount = await Alert.count({
      where: { is_read: false }
    });

    // Get monitoring activity for last 24 hours
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const monitoringActivity = await MonitoringLog.count({
      where: {
        checked_at: { [Op.gte]: last24Hours }
      }
    });

    // Get average response time for online locations
    const avgResponseTime = await MonitoringLog.findOne({
      attributes: [
        [sequelize.fn('AVG', sequelize.col('response_time')), 'avg_response_time']
      ],
      where: {
        checked_at: { [Op.gte]: last24Hours },
        response_time: { [Op.not]: null },
        status: 'online'
      },
      raw: true
    });

    res.json({
      success: true,
      data: {
        statistics: {
          total_locations: totalLocations,
          online_locations: onlineLocations,
          offline_locations: offlineLocations,
          unread_alerts: unreadAlertsCount,
          monitoring_activity_24h: monitoringActivity,
          average_response_time: Math.round(avgResponseTime?.avg_response_time || 0)
        },
        recent_logs: recentLogs,
        recent_alerts: recentAlerts
      }
    });
  } catch (error) {
    console.error('Get dashboard data error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;