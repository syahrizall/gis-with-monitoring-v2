import React, { useEffect, useState, useRef } from 'react';
import { apiService } from '../services/api';
import { WiFiLocation } from '../types';
import { MapPin, Search, Filter, Info, HelpCircle, Mail, Image as ImageIcon } from 'lucide-react';
import { WiFiMap } from './WiFiMap';
import Modal from 'react-modal';

// Komponen Navbar
const sectionList = [
  { id: 'home', label: 'Home' },
  { id: 'peta', label: 'Peta' },
  { id: 'daftar', label: 'Daftar' },
  { id: 'faq', label: 'FAQ' },
  { id: 'galeri', label: 'Galeri' },
  { id: 'kontak', label: 'Kontak' },
];

const PublicNavbar = () => (
  <nav className="sticky top-0 z-50 bg-white shadow-md border-b">
    <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-2 cursor-pointer" onClick={()=>document.getElementById('home')?.scrollIntoView({behavior:'smooth'})}>
        <MapPin className="w-7 h-7 text-blue-700" />
        <span className="font-bold text-lg text-blue-700 tracking-tight">WiFi Publik</span>
      </div>
      <div className="flex gap-4 text-sm font-medium">
        {sectionList.map(menu => (
          <button key={menu.id} onClick={()=>document.getElementById(menu.id)?.scrollIntoView({behavior:'smooth'})} className="hover:text-blue-600 transition-colors capitalize px-2 py-1 rounded focus:outline-none focus:bg-blue-50">
            {menu.label}
          </button>
        ))}
      </div>
    </div>
  </nav>
);

// Hero Section
const PublicHero = ({ onScrollToLokasi }: { onScrollToLokasi: () => void }) => (
  <section className="bg-gradient-to-br from-blue-600 to-blue-400 text-white py-16 px-4 text-center flex flex-col items-center justify-center gap-6">
    <div className="flex flex-col items-center gap-2">
      <MapPin className="w-16 h-16 mb-2 text-white drop-shadow-lg animate-bounce" />
      <h1 className="text-3xl md:text-5xl font-extrabold mb-2 drop-shadow">Sistem Informasi Geografis WiFi Publik</h1>
      <p className="text-lg md:text-2xl max-w-2xl mx-auto mb-4">Akses internet gratis untuk masyarakat Kota Bandung. Temukan lokasi WiFi publik terdekat, cek status, dan dapatkan panduan penggunaan.</p>
      <button onClick={onScrollToLokasi} className="mt-4 px-8 py-3 bg-white text-blue-700 font-bold rounded-full shadow-lg hover:bg-blue-50 transition">Lihat Lokasi WiFi</button>
    </div>
  </section>
);

// InfoTabs (FAQ, Kontak saja, tanpa tab/button)
const InfoTabs = ({ active }: { active: string }) => (
  <section className="bg-white rounded-xl shadow-sm border p-4 md:p-6 mb-6 mt-6">
    {active==='faq' && (
      <div>
        <h3 className="text-lg font-bold mb-2">FAQ - Pertanyaan Umum</h3>
        <div className="space-y-3">
          <div className="bg-blue-50 rounded p-3"><b className="text-blue-700">Bagaimana cara mengakses WiFi Publik?</b><br/>Cari lokasi WiFi terdekat di peta/daftar, kunjungi lokasi, dan sambungkan perangkat ke jaringan WiFi yang tersedia.</div>
          <div className="bg-blue-50 rounded p-3"><b className="text-blue-700">Apakah WiFi Publik aman digunakan?</b><br/>WiFi Publik aman untuk penggunaan umum, namun hindari mengakses data sensitif di jaringan publik.</div>
          <div className="bg-blue-50 rounded p-3"><b className="text-blue-700">Apakah ada batasan waktu atau kuota?</b><br/>Tidak ada batasan waktu, namun kecepatan dapat menyesuaikan jumlah pengguna di lokasi.</div>
          <div className="bg-blue-50 rounded p-3"><b className="text-blue-700">Bagaimana jika saya tidak bisa terhubung?</b><br/>Coba restart perangkat, pastikan berada di area jangkauan, atau hubungi kontak pengaduan.</div>
          <div className="bg-blue-50 rounded p-3"><b className="text-blue-700">Apakah layanan ini gratis?</b><br/>Ya, seluruh masyarakat dapat menggunakan WiFi Publik secara gratis tanpa biaya apapun.</div>
          <div className="bg-blue-50 rounded p-3"><b className="text-blue-700">Apakah WiFi Publik tersedia 24 jam?</b><br/>Sebagian besar titik WiFi Publik aktif 24 jam, namun ada beberapa lokasi yang mengikuti jam operasional tempat umum.</div>
        </div>
      </div>
    )}
    {active==='kontak' && (
      <div>
        <h3 className="text-lg font-bold mb-2">Kontak & Pengaduan</h3>
        <ul className="list-disc ml-6 text-gray-600">
          <li>Email: <a href="mailto:admin@wifi.com" className="text-blue-600 underline">admin@wifi.com</a></li>
          <li>Telepon: 0800-123-4567</li>
          <li>Alamat: Jl. Asia Afrika No. 8, Bandung</li>
        </ul>
      </div>
    )}
  </section>
);

// Gallery (dummy)
const galleryDummy = [
  { label: 'Alun-Alun Bandung', color: 'bg-blue-200' },
  { label: 'Taman Lansia', color: 'bg-green-200' },
  { label: 'Stasiun Bandung', color: 'bg-yellow-200' },
  { label: 'Gedung Sate', color: 'bg-purple-200' },
  { label: 'Balai Kota', color: 'bg-pink-200' },
  { label: 'Taman Film', color: 'bg-orange-200' },
  { label: 'Cihampelas Walk', color: 'bg-teal-200' },
  { label: 'Braga Citywalk', color: 'bg-red-200' },
];
const PublicGallery = () => (
  <section className="max-w-5xl mx-auto w-full px-2 md:px-4 py-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">Galeri Lokasi WiFi Publik</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {galleryDummy.map((item, i) => (
        <div key={i} className={`${item.color} rounded-xl h-32 flex items-center justify-center text-gray-700 text-base font-semibold shadow-inner`}>
          {item.label}
        </div>
      ))}
    </div>
  </section>
);

export const PublicLocations: React.FC = () => {
  const [locations, setLocations] = useState<WiFiLocation[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<WiFiLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState<WiFiLocation | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoading(true);
      try {
        const response = await apiService.getPublicLocations({ limit: 100, search, status: status !== 'all' ? status : undefined }) as { locations: WiFiLocation[] };
        setLocations(response.locations || []);
      } catch (err: any) {
        setError('Gagal memuat data lokasi');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLocations();
    const interval = setInterval(fetchLocations, 30000);
    return () => clearInterval(interval);
  }, [search, status]);

  useEffect(() => {
    let filtered = locations;
    if (search) {
      filtered = filtered.filter(loc => loc.nama.toLowerCase().includes(search.toLowerCase()) || loc.alamat.toLowerCase().includes(search.toLowerCase()));
    }
    if (status !== 'all') {
      filtered = filtered.filter(loc => loc.status === status);
    }
    setFilteredLocations(filtered);
  }, [locations, search, status]);

  if (isLoading) {
    return (
      <div className="p-6 text-center">Loading data lokasi...</div>
    );
  }
  if (error) {
    return (
      <div className="p-6 text-center text-red-600">{error}</div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PublicNavbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-2 md:px-4 py-6 space-y-12">
        {/* Hero */}
        <section id="home">
          <PublicHero onScrollToLokasi={()=>document.getElementById('peta')?.scrollIntoView({behavior:'smooth'})} />
        </section>
        {/* Peta */}
        <section id="peta">
          <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Peta Interaktif Lokasi WiFi</h2>
            <WiFiMap locations={filteredLocations} onLocationClick={setSelectedLocation} />
          </div>
        </section>
        {/* Daftar */}
        <section id="daftar">
          <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Daftar Lokasi ({filteredLocations.length})</h2>
              <div className="flex gap-2 items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input type="text" placeholder="Cari nama/alamat..." value={search} onChange={e=>setSearch(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50" />
                </div>
                <select value={status} onChange={e=>setStatus(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50">
                  <option value="all">Semua Status</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Alamat</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Koordinat</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Terakhir Dicek</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLocations.map((location) => (
                    <tr key={location.id} className="hover:bg-blue-50 cursor-pointer transition" onClick={()=>setSelectedLocation(location)}>
                      <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        {location.nama}
                      </td>
                      <td className="px-6 py-4 text-gray-500">{location.alamat}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          location.status === 'online'
                            ? 'bg-green-100 text-green-800'
                            : location.status === 'offline'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {location.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-mono">
                        {Number(location.latitude).toFixed(4)}, {Number(location.longitude).toFixed(4)}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(location.last_checked).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredLocations.length === 0 && (
              <div className="p-12 text-center">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada lokasi WiFi publik</h3>
                <p className="text-gray-500 mb-4">Data lokasi akan muncul di sini jika sudah tersedia.</p>
              </div>
            )}
          </div>
        </section>
        {/* FAQ */}
        <section id="faq">
          <InfoTabs active={'faq'} />
        </section>
        {/* Galeri */}
        <section id="galeri">
          <PublicGallery />
        </section>
        {/* Kontak */}
        <section id="kontak">
          <InfoTabs active={'kontak'} />
        </section>
        {/* Modal detail lokasi */}
        <Modal
          isOpen={!!selectedLocation}
          onRequestClose={()=>setSelectedLocation(null)}
          ariaHideApp={false}
          className="fixed inset-0 flex items-center justify-center z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-40 z-40"
        >
          {selectedLocation && (
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full relative animate-fade-in">
              <button onClick={()=>setSelectedLocation(null)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700">✕</button>
              <h2 className="text-xl font-bold mb-2">{selectedLocation.nama}</h2>
              <p className="text-gray-600 mb-2">{selectedLocation.alamat}</p>
              <div className="mb-2 flex gap-2 items-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  selectedLocation.status === 'online'
                    ? 'bg-green-100 text-green-800'
                    : selectedLocation.status === 'offline'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {selectedLocation.status}
                </span>
                <span className="text-xs text-gray-500">IP: {selectedLocation.ip_publik}</span>
              </div>
              <div className="mb-2 text-xs text-gray-500">Terakhir dicek: {new Date(selectedLocation.last_checked).toLocaleString()}</div>
              <div className="mb-2 text-xs text-gray-500">Koordinat: {Number(selectedLocation.latitude).toFixed(4)}, {Number(selectedLocation.longitude).toFixed(4)}</div>
              <a href={`https://www.google.com/maps/search/?api=1&query=${selectedLocation.latitude},${selectedLocation.longitude}`} target="_blank" rel="noopener noreferrer" className="block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-center font-semibold hover:bg-blue-700 transition">Buka di Google Maps</a>
              {/* Galeri foto (dummy) */}
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <ImageIcon className="w-5 h-5 text-gray-400" />
                  <span className="font-semibold text-gray-700">Galeri Foto Lokasi</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-gray-200 rounded h-20 flex items-center justify-center text-gray-400">No Image</div>
                  <div className="bg-gray-200 rounded h-20 flex items-center justify-center text-gray-400">No Image</div>
                  <div className="bg-gray-200 rounded h-20 flex items-center justify-center text-gray-400">No Image</div>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </main>
      {/* Footer */}
      <footer className="bg-blue-800 text-blue-100 text-sm py-4 mt-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>&copy; {new Date().getFullYear()} WiFi Publik Kota Bandung</div>
          <div>Didukung oleh Dinas Komunikasi dan Informatika Kota Bandung</div>
        </div>
      </footer>
    </div>
  );
}; 