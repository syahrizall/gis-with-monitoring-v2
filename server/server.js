import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import models and database
import { syncDatabase } from './models/index.js';

// Import routes
import authRoutes from './routes/auth.js';
import locationRoutes from './routes/locations.js';
import monitoringRoutes from './routes/monitoring.js';
import alertRoutes from './routes/alerts.js';
import dashboardRoutes from './routes/dashboard.js';
import publicRoutes from './routes/public.js';

// Import scheduler
import monitoringScheduler from './scheduler/monitoringScheduler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'WiFi Monitoring API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    scheduler_status: monitoringScheduler.getStatus()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/monitoring', monitoringRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/public', publicRoutes);

// Manual monitoring trigger (for testing)
app.post('/api/monitoring/trigger', async (req, res) => {
  try {
    const result = await monitoringScheduler.triggerNow();
    res.json({
      success: true,
      message: 'Monitoring triggered manually',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to trigger monitoring',
      error: error.message
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  monitoringScheduler.stop();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  monitoringScheduler.stop();
  process.exit(0);
});

// Start server
async function startServer() {
  try {
    // Initialize database
    console.log('🔄 Initializing database...');
    const dbSuccess = await syncDatabase(false);
    
    if (!dbSuccess) {
      console.error('❌ Failed to initialize database');
      process.exit(1);
    }

    // Start monitoring scheduler
    console.log('🔄 Starting monitoring scheduler...');
    monitoringScheduler.start();

    // Start HTTP server
    app.listen(PORT, () => {
      console.log('🚀 WiFi Monitoring API Server Started');
      console.log(`📡 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API base URL: http://localhost:${PORT}/api`);
      console.log('✅ Server is ready to accept connections');
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();