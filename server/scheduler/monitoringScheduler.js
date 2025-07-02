import cron from 'node-cron';
import pingService from '../services/pingService.js';

class MonitoringScheduler {
  constructor() {
    this.task = null;
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) {
      console.log('⚠️ Monitoring scheduler is already running');
      return;
    }

    const intervalMinutes = parseInt(process.env.PING_INTERVAL_MINUTES) || 5;
    const cronExpression = `*/${intervalMinutes} * * * *`;

    console.log(`🕐 Starting monitoring scheduler (every ${intervalMinutes} minutes)`);

    this.task = cron.schedule(cronExpression, async () => {
      console.log('⏰ Scheduled monitoring cycle triggered');
      await pingService.monitorAllLocations();
    }, {
      scheduled: true,
      timezone: "Asia/Jakarta"
    });

    this.isRunning = true;
    console.log('✅ Monitoring scheduler started successfully');
  }

  stop() {
    if (this.task) {
      this.task.stop();
      this.task = null;
      this.isRunning = false;
      console.log('🛑 Monitoring scheduler stopped');
    }
  }

  getStatus() {
    return {
      running: this.isRunning,
      interval_minutes: parseInt(process.env.PING_INTERVAL_MINUTES) || 5,
      next_run: this.task ? 'Scheduled' : 'Not scheduled'
    };
  }

  // Manual trigger for testing
  async triggerNow() {
    console.log('🚀 Manual monitoring trigger');
    return await pingService.monitorAllLocations();
  }
}

export default new MonitoringScheduler();