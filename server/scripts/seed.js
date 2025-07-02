import { User, WiFiLocation, syncDatabase } from '../models/index.js';

const seedData = {
  users: [
    {
      name: 'Administrator',
      email: 'admin@wifi.com',
      password: 'password',
      role: 'admin'
    }
  ],
  locations : [
    //Bandung
    {
      nama: "PT XL Axiata",
      alamat: "Jl. Setiabudi No.401, Cibeunying Kidul, Kota Bandung",
      latitude: -6.9078,
      longitude: 107.6104,
      ip_publik: "203.78.124.21"
    },
    {
      nama: "PT Citra Jelajah Informatika",
      alamat: "Jl. Asia Afrika No.65, Lengkong, Kota Bandung",
      latitude: -6.9184,
      longitude: 107.6185,
      ip_publik: "103.14.20.39"
    },
    {
      nama: "PT Excelcomindo Pratama (XL Home)",
      alamat: "Jl. Buah Batu No.250, Kec. Regol, Kota Bandung",
      latitude: -6.9412,
      longitude: 107.6093,
      ip_publik: "140.213.107.113"
    },
    {
      nama: "PT Melvar Lintasnusa",
      alamat: "Jl. Diponegoro No.98, Cicendo, Kota Bandung",
      latitude: -6.9140,
      longitude: 107.6025,
      ip_publik: "202.138.244.124"
    },
    {
      nama: "PT Hutchison 3 Indonesia (Tri)",
      alamat: "Jl. Cihapit No.150, Cihapit, Kota Bandung",
      latitude: -6.9111,
      longitude: 107.6042,
      ip_publik: "116.206.14.19"
    },
    {
      nama: "PT Internux (Icon+)",
      alamat: "Jl. Sukajadi No.38, Sukajadi, Kota Bandung",
      latitude: -6.8893,
      longitude: 107.5967,
      ip_publik: "202.62.16.56"
    },
    {
      nama: "Biznet Bandung",
      alamat: "Jl. Pasir Kaliki No.124, Cicendo, Kota Bandung",
      latitude: -6.9149,
      longitude: 107.6138,
      ip_publik: "182.253.204.66"
    },
    {
      nama: "PT Lintas Satu Visi",
      alamat: "Jl. Sukajadi No.235, Sukajadi, Kota Bandung",
      latitude: -6.8905,
      longitude: 107.6089,
      ip_publik: "103.162.36.154"
    },
    {
      nama: "Pemerintah Kota Bandung",
      alamat: "Jl. Wastukencana No.2, Braga, Kota Bandung",
      latitude: -6.9147,
      longitude: 107.6098,
      ip_publik: "202.89.36.1"
    },
    {
      nama: "Fast.net Bandung",
      alamat: "Jl. Surapati No.56, Cicendo, Kota Bandung",
      latitude: -6.9128,
      longitude: 107.6167,
      ip_publik: "140.0.197.102"
    }, 
    // Jakarta
    {
      nama: "Balai Kota DKI Jakarta",
      alamat: "Jl. Medan Merdeka Selatan No.8-9, Gambir, Jakarta Pusat",
      latitude: -6.175392,
      longitude: 106.827153,
      ip_publik: "103.30.45.1"
    },
    {
      nama: "Taman Suropati",
      alamat: "Jl. Taman Suropati, Menteng, Jakarta Pusat",
      latitude: -6.197034,
      longitude: 106.832184,
      ip_publik: "103.30.45.2"
    },
    {
      nama: "Halte TransJakarta Bundaran HI",
      alamat: "Jl. M.H. Thamrin, Menteng, Jakarta Pusat",
      latitude: -6.193398,
      longitude: 106.822716,
      ip_publik: "103.30.45.3"
    },
    {
      nama: "Perpustakaan Umum Jakarta",
      alamat: "Jl. Cikini Raya No.73, Menteng, Jakarta Pusat",
      latitude: -6.199892,
      longitude: 106.841980,
      ip_publik: "103.30.45.4"
    },
    {
      nama: "Stasiun MRT Blok M",
      alamat: "Jl. Panglima Polim Raya, Kebayoran Baru, Jakarta Selatan",
      latitude: -6.243708,
      longitude: 106.799369,
      ip_publik: "103.30.45.5"
    },

    // Bogor
    {
      nama: "Balai Kota Bogor",
      alamat: "Jl. Ir. H. Juanda No.10, Pabaton, Bogor Tengah, Kota Bogor",
      latitude: -6.595038,
      longitude: 106.798195,
      ip_publik: "103.30.46.1"
    },
    {
      nama: "Stasiun Bogor",
      alamat: "Jl. Nyi Raja Permas, Cibogor, Bogor Tengah, Kota Bogor",
      latitude: -6.589184,
      longitude: 106.792999,
      ip_publik: "103.30.46.2"
    },
    {
      nama: "Taman Sempur",
      alamat: "Jl. Sempur Kidul No.59, Sempur, Bogor Tengah, Kota Bogor",
      latitude: -6.597403,
      longitude: 106.801348,
      ip_publik: "103.30.46.3"
    },
    {
      nama: "Taman Kencana",
      alamat: "Jl. Salak No.1, Babakan, Bogor Tengah, Kota Bogor",
      latitude: -6.598865,
      longitude: 106.798903,
      ip_publik: "103.30.46.4"
    },
    {
      nama: "Botani Square Mall",
      alamat: "Jl. Raya Pajajaran, Tegallega, Bogor Tengah, Kota Bogor",
      latitude: -6.602675,
      longitude: 106.806609,
      ip_publik: "103.30.46.5"
    }
  ]
};

async function seed() {
  console.log('🌱 Starting database seeding...');
  
  try {
    // Ensure database is synced
    await syncDatabase(false);
    
    // Seed users
    console.log('👤 Seeding users...');
    for (const userData of seedData.users) {
      const existingUser = await User.findOne({ where: { email: userData.email } });
      if (!existingUser) {
        await User.create(userData);
        console.log(`✅ Created user: ${userData.email}`);
      } else {
        console.log(`⚠️ User already exists: ${userData.email}`);
      }
    }
    
    // Seed WiFi locations
    console.log('📍 Seeding WiFi locations...');
    for (const locationData of seedData.locations) {
      const existingLocation = await WiFiLocation.findOne({ 
        where: { ip_publik: locationData.ip_publik } 
      });
      if (!existingLocation) {
        await WiFiLocation.create(locationData);
        console.log(`✅ Created location: ${locationData.nama}`);
      } else {
        console.log(`⚠️ Location already exists: ${locationData.nama}`);
      }
    }
    
    console.log('✅ Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seed();