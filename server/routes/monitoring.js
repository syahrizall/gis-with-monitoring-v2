import express from 'express';
import { Op } from 'sequelize';
import { MonitoringLog, WiFiLocation } from '../models/index.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get monitoring logs
router.get('/logs', authenticate, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      location_id, 
      status, 
      start_date, 
      end_date 
    } = req.query;
    
    const offset = (page - 1) * limit;
    const whereClause = {};

    if (location_id) {
      whereClause.location_id = location_id;
    }

    if (status && ['online', 'offline'].includes(status)) {
      whereClause.status = status;
    }

    if (start_date || end_date) {
      whereClause.checked_at = {};
      if (start_date) {
        whereClause.checked_at[Op.gte] = new Date(start_date);
      }
      if (end_date) {
        whereClause.checked_at[Op.lte] = new Date(end_date);
      }
    }

    const { count, rows } = await MonitoringLog.findAndCountAll({
      where: whereClause,
      include: [{
        model: WiFiLocation,
        as: 'location',
        attributes: ['id', 'nama', 'alamat']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['checked_at', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        logs: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get monitoring logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get monitoring statistics
router.get('/stats', authenticate, async (req, res) => {
  try {
    const { period = '24h' } = req.query;
    
    let startDate;
    switch (period) {
      case '1h':
        startDate = new Date(Date.now() - 60 * 60 * 1000);
        break;
      case '24h':
        startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
    }

    // Get total locations
    const totalLocations = await WiFiLocation.count({
      where: { is_active: true }
    });

    // Get current status counts
    const onlineCount = await WiFiLocation.count({
      where: { status: 'online', is_active: true }
    });

    const offlineCount = await WiFiLocation.count({
      where: { status: 'offline', is_active: true }
    });

    const unknownCount = await WiFiLocation.count({
      where: { status: 'unknown', is_active: true }
    });

    // Get monitoring logs for the period
    const logsInPeriod = await MonitoringLog.count({
      where: {
        checked_at: { [Op.gte]: startDate }
      }
    });

    // Get average response time
    const avgResponseTime = await MonitoringLog.findOne({
      attributes: [
        [sequelize.fn('AVG', sequelize.col('response_time')), 'avg_response_time']
      ],
      where: {
        checked_at: { [Op.gte]: startDate },
        response_time: { [Op.not]: null }
      },
      raw: true
    });

    res.json({
      success: true,
      data: {
        period,
        total_locations: totalLocations,
        online_count: onlineCount,
        offline_count: offlineCount,
        unknown_count: unknownCount,
        logs_in_period: logsInPeriod,
        average_response_time: Math.round(avgResponseTime?.avg_response_time || 0)
      }
    });
  } catch (error) {
    console.error('Get monitoring stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;