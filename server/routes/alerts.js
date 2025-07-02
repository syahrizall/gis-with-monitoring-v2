import express from 'express';
import { Op } from 'sequelize';
import { Alert, WiFiLocation } from '../models/index.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get alerts
router.get('/', authenticate, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      unread_only = false,
      type,
      location_id 
    } = req.query;
    
    const offset = (page - 1) * limit;
    const whereClause = {};

    if (unread_only === 'true') {
      whereClause.is_read = false;
    }

    if (type && ['status_change', 'connection_lost', 'connection_restored'].includes(type)) {
      whereClause.type = type;
    }

    if (location_id) {
      whereClause.location_id = location_id;
    }

    const { count, rows } = await Alert.findAndCountAll({
      where: whereClause,
      include: [{
        model: WiFiLocation,
        as: 'location',
        attributes: ['id', 'nama', 'alamat', 'ip_publik']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        alerts: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Mark alert as read
router.patch('/:id/read', authenticate, async (req, res) => {
  try {
    const alert = await Alert.findByPk(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    await alert.update({ is_read: true });

    res.json({
      success: true,
      message: 'Alert marked as read',
      data: { alert }
    });
  } catch (error) {
    console.error('Mark alert as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Mark all alerts as read
router.patch('/read-all', authenticate, async (req, res) => {
  try {
    const [updatedCount] = await Alert.update(
      { is_read: true },
      { where: { is_read: false } }
    );

    res.json({
      success: true,
      message: `${updatedCount} alerts marked as read`
    });
  } catch (error) {
    console.error('Mark all alerts as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get unread alerts count
router.get('/unread-count', authenticate, async (req, res) => {
  try {
    const count = await Alert.count({
      where: { is_read: false }
    });

    res.json({
      success: true,
      data: { unread_count: count }
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;