# WiFi Monitoring Backend API

Backend API untuk sistem monitoring lokasi WiFi menggunakan Node.js, Express, dan MySQL.

## Fitur Utama

- 🔐 **Autentikasi JWT** - Login admin dengan token
- 📍 **CRUD Lokasi WiFi** - Kelola lokasi dengan validasi IP unik
- 🏓 **Ping Monitoring Real** - Ping otomatis ke IP publik setiap 5 menit
- 📧 **Email Notifications** - Alert email saat status berubah
- 📊 **Dashboard API** - Statistik dan monitoring logs
- 🗄️ **Database MySQL** - Penyimpanan data dengan Sequelize ORM
- ⏰ **Scheduler** - Cron job untuk monitoring otomatis

## Instalasi

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Setup Database
Buat database MySQL:
```sql
CREATE DATABASE db_wifi_monitoring;
```

### 3. Konfigurasi Environment
Copy file `.env.example` ke `.env` dan sesuaikan:
```bash
cp .env.example .env
```

Edit file `.env`:
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=db_wifi_monitoring
DB_USER=root
DB_PASSWORD=your_password

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# Email SMTP (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=your-email@gmail.com
ADMIN_EMAIL=admin@example.com

# Server
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### 4. Migrasi Database
```bash
npm run migrate
```

### 5. Seed Data
```bash
npm run seed
```

### 6. Jalankan Server
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login admin
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### WiFi Locations
- `GET /api/locations` - Get all locations
- `GET /api/locations/:id` - Get single location
- `POST /api/locations` - Create location
- `PUT /api/locations/:id` - Update location
- `DELETE /api/locations/:id` - Delete location
- `POST /api/locations/:id/ping` - Manual ping test

### Monitoring
- `GET /api/monitoring/logs` - Get monitoring logs
- `GET /api/monitoring/stats` - Get monitoring statistics
- `POST /api/monitoring/trigger` - Manual trigger monitoring

### Alerts
- `GET /api/alerts` - Get alerts
- `PATCH /api/alerts/:id/read` - Mark alert as read
- `PATCH /api/alerts/read-all` - Mark all alerts as read
- `GET /api/alerts/unread-count` - Get unread count

### Dashboard
- `GET /api/dashboard` - Get dashboard data

## Struktur Database

### users
- id (UUID)
- name (VARCHAR)
- email (VARCHAR, UNIQUE)
- password (VARCHAR, HASHED)
- role (ENUM: admin, user)
- is_active (BOOLEAN)

### wifi_locations
- id (UUID)
- nama (VARCHAR)
- alamat (TEXT)
- latitude (DECIMAL)
- longitude (DECIMAL)
- ip_publik (VARCHAR, UNIQUE)
- status (ENUM: online, offline, unknown)
- last_checked (DATETIME)
- is_active (BOOLEAN)

### monitoring_logs
- id (UUID)
- location_id (UUID, FK)
- ip_address (VARCHAR)
- status (ENUM: online, offline)
- response_time (INTEGER, ms)
- error_message (TEXT)
- checked_at (DATETIME)

### alerts
- id (UUID)
- location_id (UUID, FK)
- message (TEXT)
- type (ENUM: status_change, connection_lost, connection_restored)
- previous_status (ENUM)
- current_status (ENUM)
- is_read (BOOLEAN)
- email_sent (BOOLEAN)
- email_sent_at (DATETIME)

## Monitoring Scheduler

Sistem menggunakan cron job untuk monitoring otomatis:
- **Interval**: Setiap 5 menit (dapat dikonfigurasi via `PING_INTERVAL_MINUTES`)
- **Ping Timeout**: 5 detik (dapat dikonfigurasi via `PING_TIMEOUT_MS`)
- **Auto Start**: Scheduler otomatis start saat server berjalan

## Email Notifications

Sistem mengirim email alert saat:
- Status lokasi berubah dari online ke offline
- Status lokasi berubah dari offline ke online

Template email HTML responsif dengan detail lokasi.

## Default Login

```
Email: admin@wifi.com
Password: password
```

## Development

```bash
# Install nodemon untuk auto-restart
npm install -g nodemon

# Jalankan dalam mode development
npm run dev
```

## Production Deployment

1. Set `NODE_ENV=production` di environment
2. Gunakan process manager seperti PM2
3. Setup reverse proxy (Nginx)
4. Konfigurasi SSL certificate
5. Setup database backup

## Troubleshooting

### Database Connection Error
- Pastikan MySQL service berjalan
- Cek kredensial database di `.env`
- Pastikan database sudah dibuat

### Email Not Sending
- Pastikan SMTP credentials benar
- Untuk Gmail, gunakan App Password bukan password biasa
- Cek firewall untuk port 587

### Ping Not Working
- Pastikan server memiliki akses internet
- Cek firewall untuk ICMP packets
- Test manual ping dari server

## Monitoring

Health check endpoint: `GET /health`

Response:
```json
{
  "success": true,
  "message": "WiFi Monitoring API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development",
  "scheduler_status": {
    "running": true,
    "interval_minutes": 5,
    "next_run": "Scheduled"
  }
}
```