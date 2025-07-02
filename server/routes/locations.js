import express from 'express';
import { Op } from 'sequelize';
import { WiFiLocation, MonitoringLog } from '../models/index.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateWiFiLocation } from '../middleware/validation.js';
import pingService from '../services/pingService.js';

const router = express.Router();

// Get all locations
router.get('/', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 50, search, status } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { is_active: true };

    if (search) {
      whereClause[Op.or] = [
        { nama: { [Op.like]: `%${search}%` } },
        { alamat: { [Op.like]: `%${search}%` } },
        { ip_publik: { [Op.like]: `%${search}%` } }
      ];
    }

    if (status && ['online', 'offline', 'unknown'].includes(status)) {
      whereClause.status = status;
    }

    const { count, rows } = await WiFiLocation.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        locations: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get locations error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get single location
router.get('/:id', authenticate, async (req, res) => {
  try {
    const location = await WiFiLocation.findOne({
      where: { id: req.params.id, is_active: true },
      include: [{
        model: MonitoringLog,
        as: 'monitoring_logs',
        limit: 10,
        order: [['checked_at', 'DESC']]
      }]
    });

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    res.json({
      success: true,
      data: { location }
    });
  } catch (error) {
    console.error('Get location error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create location
router.post('/', authenticate, authorize('admin'), validateWiFiLocation, async (req, res) => {
  try {
    const { nama, alamat, latitude, longitude, ip_publik } = req.body;

    // Check if IP already exists
    const existingLocation = await WiFiLocation.findOne({
      where: { ip_publik, is_active: true }
    });

    if (existingLocation) {
      return res.status(400).json({
        success: false,
        message: 'IP address already exists'
      });
    }

    const location = await WiFiLocation.create({
      nama,
      alamat,
      latitude,
      longitude,
      ip_publik,
      status: 'unknown'
    });

    res.status(201).json({
      success: true,
      message: 'Location created successfully',
      data: { location }
    });
  } catch (error) {
    console.error('Create location error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update location
router.put('/:id', authenticate, authorize('admin'), validateWiFiLocation, async (req, res) => {
  try {
    const { nama, alamat, latitude, longitude, ip_publik } = req.body;

    const location = await WiFiLocation.findOne({
      where: { id: req.params.id, is_active: true }
    });

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    // Check if IP already exists (excluding current location)
    if (ip_publik !== location.ip_publik) {
      const existingLocation = await WiFiLocation.findOne({
        where: { 
          ip_publik, 
          is_active: true,
          id: { [Op.ne]: req.params.id }
        }
      });

      if (existingLocation) {
        return res.status(400).json({
          success: false,
          message: 'IP address already exists'
        });
      }
    }

    await location.update({
      nama,
      alamat,
      latitude,
      longitude,
      ip_publik
    });

    res.json({
      success: true,
      message: 'Location updated successfully',
      data: { location }
    });
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete location (soft delete)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const location = await WiFiLocation.findOne({
      where: { id: req.params.id, is_active: true }
    });

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    await location.update({ is_active: false });

    res.json({
      success: true,
      message: 'Location deleted successfully'
    });
  } catch (error) {
    console.error('Delete location error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Manual ping test
router.post('/:id/ping', authenticate, async (req, res) => {
  try {
    const location = await WiFiLocation.findOne({
      where: { id: req.params.id, is_active: true }
    });

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    const result = await pingService.monitorLocation(location);

    res.json({
      success: true,
      message: 'Ping test completed',
      data: result
    });
  } catch (error) {
    console.error('Ping test error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;