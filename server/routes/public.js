import express from 'express';
import { Op } from 'sequelize';
import { WiFiLocation } from '../models/index.js';

const router = express.Router();

// GET /api/public/locations - List lokasi aktif (publik)
router.get('/locations', async (req, res) => {
  try {
    const { page = 1, limit = 50, search, status } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { is_active: true };
    if (search) {
      whereClause[Op.or] = [
        { nama: { [Op.like]: `%${search}%` } },
        { alamat: { [Op.like]: `%${search}%` } }
      ];
    }
    if (status && ['online', 'offline', 'unknown'].includes(status)) {
      whereClause.status = status;
    }

    const { count, rows } = await WiFiLocation.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
      attributes: [
        'id', 'nama', 'alamat', 'latitude', 'longitude', 'status', 'last_checked', 'ip_publik'
      ]
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
    console.error('Get public locations error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/public/locations/:id - Detail lokasi (publik)
router.get('/locations/:id', async (req, res) => {
  try {
    const location = await WiFiLocation.findOne({
      where: { id: req.params.id, is_active: true },
      attributes: [
        'id', 'nama', 'alamat', 'latitude', 'longitude', 'status', 'last_checked', 'ip_publik'
      ]
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
    console.error('Get public location detail error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router; 