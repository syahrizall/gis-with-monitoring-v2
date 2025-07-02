import { syncDatabase } from '../models/index.js';

async function migrate() {
  console.log('🔄 Starting database migration...');
  
  try {
    const success = await syncDatabase(false); // false = don't force drop tables
    
    if (success) {
      console.log('✅ Database migration completed successfully');
      process.exit(0);
    } else {
      console.log('❌ Database migration failed');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

migrate();