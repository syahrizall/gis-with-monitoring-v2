import ping from 'ping';
import { WiFiLocation, MonitoringLog, Alert } from '../models/index.js';
import { sendStatusChangeEmail } from './emailService.js';

class PingService {
  constructor() {
    this.timeout = parseInt(process.env.PING_TIMEOUT_MS) || 5000;
  }

  async pingHost(host) {
    try {
      const result = await ping.promise.probe(host, {
        timeout: this.timeout / 1000, // ping library expects seconds
        min_reply: 1
      });

      return {
        alive: result.alive,
        time: result.alive ? Math.round(result.time) : null,
        error: result.alive ? null : 'Host unreachable'
      };
    } catch (error) {
      return {
        alive: false,
        time: null,
        error: error.message
      };
    }
  }

  async monitorLocation(location) {
    try {
      console.log(`🔍 Monitoring ${location.nama} (${location.ip_publik})`);
      
      const pingResult = await this.pingHost(location.ip_publik);
      const newStatus = pingResult.alive ? 'online' : 'offline';
      const previousStatus = location.status;

      // Create monitoring log
      const logData = {
        location_id: location.id,
        ip_address: location.ip_publik,
        status: newStatus,
        response_time: pingResult.time,
        error_message: pingResult.error,
        checked_at: new Date()
      };

      await MonitoringLog.create(logData);

      // Update location status
      await location.update({
        status: newStatus,
        last_checked: new Date()
      });

      // Check if status changed and create alert
      if (previousStatus !== 'unknown' && previousStatus !== newStatus) {
        await this.createStatusChangeAlert(location, previousStatus, newStatus);
      }

      console.log(`✅ ${location.nama}: ${newStatus} (${pingResult.time || 'N/A'}ms)`);
      
      return {
        success: true,
        location: location.nama,
        status: newStatus,
        responseTime: pingResult.time,
        statusChanged: previousStatus !== newStatus
      };

    } catch (error) {
      console.error(`❌ Error monitoring ${location.nama}:`, error);
      return {
        success: false,
        location: location.nama,
        error: error.message
      };
    }
  }

  async createStatusChangeAlert(location, previousStatus, currentStatus) {
    try {
      const alertType = currentStatus === 'online' ? 'connection_restored' : 'connection_lost';
      const message = `${location.nama} status changed from ${previousStatus} to ${currentStatus}`;

      const alert = await Alert.create({
        location_id: location.id,
        message,
        type: alertType,
        previous_status: previousStatus,
        current_status: currentStatus,
        is_read: false,
        email_sent: false
      });

      // Send email notification
      try {
        await sendStatusChangeEmail(location, previousStatus, currentStatus);
        await alert.update({
          email_sent: true,
          email_sent_at: new Date()
        });
        console.log(`📧 Email sent for ${location.nama} status change`);
      } catch (emailError) {
        console.error(`❌ Failed to send email for ${location.nama}:`, emailError.message);
      }

      return alert;
    } catch (error) {
      console.error('❌ Error creating alert:', error);
      throw error;
    }
  }

  async monitorAllLocations() {
    try {
      console.log('🚀 Starting monitoring cycle...');
      
      const locations = await WiFiLocation.findAll({
        where: { is_active: true }
      });

      if (locations.length === 0) {
        console.log('⚠️ No active locations to monitor');
        return { success: true, message: 'No active locations' };
      }

      const results = [];
      for (const location of locations) {
        const result = await this.monitorLocation(location);
        results.push(result);
        
        // Small delay between pings to avoid overwhelming the network
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      const statusChanges = results.filter(r => r.statusChanged).length;

      console.log(`✅ Monitoring cycle completed: ${successful} successful, ${failed} failed, ${statusChanges} status changes`);

      return {
        success: true,
        total: locations.length,
        successful,
        failed,
        statusChanges,
        results
      };

    } catch (error) {
      console.error('❌ Error in monitoring cycle:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new PingService();