import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { apiService } from '../services/api';
import { WiFiLocation } from '../types';
import { Wifi, MapPin, Info, Mail } from 'lucide-react';
import { WiFiMap } from './WiFiMap';
import Modal from 'react-modal';

// [1] IMPORTS
// [2] UTILITY COMPONENTS (AnimatedCard, CardTitle, CardDivider)
const AnimatedCard = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`bg-gradient-to-br from-white via-teal-100 to-teal-200 rounded-xl shadow-md border p-8 md:p-12 mb-12 animate-fade-in transition-transform duration-300 hover:scale-[1.025] hover:shadow-xl ${className}`}
    {...props}
  >
    {children}
  </div>
);

const CardTitle = ({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) => (
  <div className="flex items-center gap-3 mb-2">
    <span className="text-teal-700">{icon}</span>
    <h2 className="text-3xl font-bold text-gray-900">{children}</h2>
  </div>
);

const CardDivider = () => (
  <div className="w-24 h-1 bg-gradient-to-r from-teal-400 via-teal-600 to-teal-400 rounded-full mb-6 opacity-70" />
);

// [3] SECTION COMPONENTS (PublicNavbar, PublicHero, TentangSection, KontakSection)
const PublicNavbar = () => (
  <nav className="sticky top-0 z-50 bg-white shadow">
    <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-1">
      <button
        className="flex items-center focus:outline-none -my-4"
        onClick={()=>document.getElementById('home')?.scrollIntoView({behavior:'smooth'})}
        aria-label="Home"
      >
        <img src="/logo.png" alt="Logo WinFree" className="w-20 h-20 object-contain" />
      </button>
      <div className="flex gap-1 md:gap-3 text-base md:text-lg font-semibold items-center">
        <button onClick={()=>document.getElementById('home')?.scrollIntoView({behavior:'smooth'})} className="hover:text-teal-700 transition-colors capitalize px-3 py-1 rounded focus:outline-none focus:bg-teal-50">Home</button>
        <button onClick={()=>document.getElementById('peta')?.scrollIntoView({behavior:'smooth'})} className="hover:text-teal-700 transition-colors capitalize px-3 py-1 rounded focus:outline-none focus:bg-teal-50">Lokasi WiFi</button>
        <button onClick={()=>document.getElementById('tentang')?.scrollIntoView({behavior:'smooth'})} className="hover:text-teal-700 transition-colors capitalize px-3 py-1 rounded focus:outline-none focus:bg-teal-50">Tentang</button>
        <button onClick={()=>document.getElementById('kontak')?.scrollIntoView({behavior:'smooth'})} className="hover:text-teal-700 transition-colors capitalize px-3 py-1 rounded focus:outline-none focus:bg-teal-50">Kontak</button>
      </div>
    </div>
  </nav>
);

const PublicHero = ({ onScrollToLokasi }: { onScrollToLokasi: () => void }) => (
  <section className="relative flex justify-center items-center py-12 md:py-20 bg-gradient-to-br from-teal-50 via-white to-teal-100 overflow-hidden">
    {/* SVG Dots Pattern */}
    <svg className="absolute left-0 top-0 w-64 h-64 opacity-20 z-0" width="256" height="256"><circle cx="8" cy="8" r="2" fill="#2dd4bf"/><circle cx="32" cy="32" r="2" fill="#2dd4bf"/><circle cx="56" cy="56" r="2" fill="#2dd4bf"/><circle cx="80" cy="80" r="2" fill="#2dd4bf"/><circle cx="104" cy="104" r="2" fill="#2dd4bf"/><circle cx="128" cy="128" r="2" fill="#2dd4bf"/><circle cx="152" cy="152" r="2" fill="#2dd4bf"/><circle cx="176" cy="176" r="2" fill="#2dd4bf"/><circle cx="200" cy="200" r="2" fill="#2dd4bf"/><circle cx="224" cy="224" r="2" fill="#2dd4bf"/></svg>
    <svg className="absolute right-0 bottom-0 w-64 h-64 opacity-10 z-0" width="256" height="256"><circle cx="8" cy="8" r="2" fill="#2dd4bf"/><circle cx="32" cy="32" r="2" fill="#2dd4bf"/><circle cx="56" cy="56" r="2" fill="#2dd4bf"/><circle cx="80" cy="80" r="2" fill="#2dd4bf"/><circle cx="104" cy="104" r="2" fill="#2dd4bf"/><circle cx="128" cy="128" r="2" fill="#2dd4bf"/><circle cx="152" cy="152" r="2" fill="#2dd4bf"/><circle cx="176" cy="176" r="2" fill="#2dd4bf"/><circle cx="200" cy="200" r="2" fill="#2dd4bf"/><circle cx="224" cy="224" r="2" fill="#2dd4bf"/></svg>
    <div className="bg-gradient-to-br from-white via-teal-50 to-teal-100 rounded-2xl shadow-xl p-8 md:p-12 flex flex-col items-center w-full max-w-5xl relative z-10 animate-fade-in">
      <img src="/logo.png" alt="Logo WinFree" className="w-28 h-28 md:w-36 md:h-36 mb-4 object-contain drop-shadow-lg" />
      <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-gray-900 text-center drop-shadow">Terhubung Tanpa Batas</h1>
      <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-2 text-gray-700 text-center">Jelajahi Dunia dengan <span className="font-bold text-teal-700">WIFI Gratis!</span></p>
      <span className="inline-block bg-teal-100 text-teal-800 font-bold rounded-full px-6 py-2 text-lg mb-6">#SmartWifi</span>
      <button onClick={onScrollToLokasi} className="mt-2 px-10 py-4 bg-teal-800 text-white font-bold rounded-full shadow-lg hover:bg-teal-900 transition text-lg">Lihat Lokasi WiFi</button>
      <div className="w-32 h-1 bg-gradient-to-r from-teal-400 via-teal-600 to-teal-400 rounded-full mt-8 mb-2 opacity-60" />
    </div>
  </section>
);

const TentangSection = () => (
  <section id="tentang" className="max-w-5xl mx-auto w-full">
    <AnimatedCard>
      <CardTitle icon={<Info className="w-8 h-8" />}>Apa itu Wifi Publik ?</CardTitle>
      <CardDivider />
      <p className="text-lg text-gray-700 mb-4">Wifi Publik merupakan Layanan wifi Gratis yang dapat dimanfaatkan masyarakat untuk berbagai keperluan. Layanan wifi publik tersebut dapat diakses di tempat-tempat umum dan strategis yang bisa dijangkau secara mudah oleh masyarakat, dekat dengan lingkungan masyarakat.</p>
      <ul className="list-disc ml-6 text-gray-600 mb-2 text-base md:text-lg">
        <li><span className="font-bold text-teal-700">Akses gratis</span> tanpa kuota</li>
        <li>Tersedia di berbagai <span className="font-bold text-teal-700">titik strategis kota</span></li>
        <li>Dapat digunakan oleh <span className="font-bold text-teal-700">siapa saja</span></li>
        <li>Pastikan menjaga <span className="font-bold text-teal-700">keamanan data pribadi</span> saat menggunakan jaringan publik</li>
      </ul>
    </AnimatedCard>
  </section>
);

const KontakSection = () => (
  <section id="kontak" className="max-w-5xl mx-auto w-full">
    <AnimatedCard>
      <CardTitle icon={<Mail className="w-8 h-8" />}>Kontak & Pengaduan</CardTitle>
      <CardDivider />
      <p className="text-base md:text-lg text-gray-700 mb-4">Hubungi kami untuk pertanyaan, saran, atau pengaduan terkait layanan <span className="font-bold text-teal-700">WinFree</span>. Tim kami siap membantu Anda dengan ramah dan profesional.</p>
      <ul className="list-disc ml-6 text-gray-600 text-base md:text-lg space-y-1">
        <li>Email: <a href="mailto:admin@winfree.co.id" className="text-teal-700 underline hover:text-teal-900">admin@winfree.co.id</a></li>
        <li>Telepon: <a href="tel:+6287741415969" className="text-teal-700 underline hover:text-teal-900">+62 877 4141 5969</a></li>
        <li>WhatsApp: <a href="https://wa.me/6287741415969" target="_blank" rel="noopener noreferrer" className="text-teal-700 underline hover:text-teal-900">+62 877 4141 5969</a></li>
        <li>Alamat: <a href="https://goo.gl/maps/2v6Qw1kQw1kQw1kQ7" target="_blank" rel="noopener noreferrer" className="text-teal-700 underline hover:text-teal-900">Parahyangan Business Park, The Suites Blok E5, Jl. Soekarno Hatta No. 693 Bandung, Jawa Barat 40286</a></li>
      </ul>
      <div className="mt-4 text-sm text-teal-800">Kami menghargai setiap masukan Anda demi peningkatan layanan WinFree di masa depan.</div>
    </AnimatedCard>
  </section>
);

// [4] MAIN PAGE COMPONENT (PublicLocations)
export const PublicLocations: React.FC = () => {
  const [locations, setLocations] = useState<WiFiLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<WiFiLocation | null>(null);
  const scrollPosRef = useRef<number>(0);
  const isIntervalRef = useRef<boolean>(false);

  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoading(true);
      try {
        const response = await apiService.getPublicLocations({ limit: 100 }) as { locations: WiFiLocation[] };
        setLocations(response.locations || []);
      } catch (err: any) {
        setError('Gagal memuat data lokasi');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLocations();
    const interval = setInterval(() => {
      scrollPosRef.current = window.scrollY;
      isIntervalRef.current = true;
      fetchLocations();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useLayoutEffect(() => {
    if (isIntervalRef.current) {
      window.scrollTo({ top: scrollPosRef.current, behavior: 'auto' });
      isIntervalRef.current = false;
    }
  }, [locations]);

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
      <main className="flex-1 w-full px-2 md:px-4 py-8 space-y-16">
        {/* Hero */}
        <section id="home">
          <PublicHero onScrollToLokasi={()=>document.getElementById('peta')?.scrollIntoView({behavior:'smooth'})} />
        </section>
        {/* Peta */}
        <section id="peta" className="max-w-5xl mx-auto w-full">
          <AnimatedCard>
            <CardTitle icon={<MapPin className="w-8 h-8" />}>WinFreeSpot Internet Gratis</CardTitle>
            <CardDivider />
            <p className="text-lg text-gray-700 mb-4">Sudah tersebar luas di ratusan public area di wilayah Jawa Barat.</p>
            <WiFiMap locations={locations} onLocationClick={setSelectedLocation} />
          </AnimatedCard>
        </section>
        {/* Tentang */}
        <TentangSection />
        {/* Kontak */}
        <KontakSection />
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
              <a href={`https://www.google.com/maps/search/?api=1&query=${selectedLocation.latitude},${selectedLocation.longitude}`} target="_blank" rel="noopener noreferrer" className="block mt-4 px-4 py-2 bg-teal-800 text-white rounded-lg text-center font-semibold hover:bg-teal-900 transition">Buka di Google Maps</a>
            </div>
          )}
        </Modal>
      </main>
      {/* Footer */}
      <footer className="bg-gradient-to-tr from-teal-900 via-teal-800 to-teal-900 text-teal-100 text-base md:text-lg py-8 mt-8 border-t-4 border-teal-700 shadow-inner animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-start">
          {/* Brand & Logo */}
          <div className="flex flex-col items-start gap-2 mb-6 md:mb-0">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo WinFree" className="w-14 h-14 md:w-16 md:h-16 object-contain drop-shadow-lg bg-white rounded-full p-1 border-2 border-teal-600" />
              <div>
                <div className="font-extrabold text-2xl tracking-wide text-white drop-shadow">WinFree</div>
                <div className="text-xs text-teal-200 font-medium">#SmartWifi untuk Semua</div>
              </div>
            </div>
          </div>
          {/* Menu Navigasi */}
          <div className="flex flex-col items-start md:items-center gap-2 mb-6 md:mb-0">
            <div className="font-bold mb-2 flex items-center gap-2"><svg className="w-5 h-5 text-teal-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" /></svg> Menu</div>
            <ul className="space-y-1">
              <li><button onClick={()=>document.getElementById('home')?.scrollIntoView({behavior:'smooth'})} className="hover:text-white flex items-center gap-2 transition"><svg className="w-4 h-4 text-teal-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" /></svg>Home</button></li>
              <li><button onClick={()=>document.getElementById('peta')?.scrollIntoView({behavior:'smooth'})} className="hover:text-white flex items-center gap-2 transition"><svg className="w-4 h-4 text-teal-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 12.414a4 4 0 10-5.657 5.657l4.243 4.243a8 8 0 1011.314-11.314l-4.243 4.243a4 4 0 00-5.657 5.657z" /></svg>Lokasi WiFi</button></li>
              <li><button onClick={()=>document.getElementById('tentang')?.scrollIntoView({behavior:'smooth'})} className="hover:text-white flex items-center gap-2 transition"><svg className="w-4 h-4 text-teal-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" /></svg>Tentang</button></li>
              <li><button onClick={()=>document.getElementById('kontak')?.scrollIntoView({behavior:'smooth'})} className="hover:text-white flex items-center gap-2 transition"><svg className="w-4 h-4 text-teal-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 01-8 0m8 0a4 4 0 00-8 0m8 0V8a4 4 0 00-8 0v4m8 0a4 4 0 01-8 0" /></svg>Kontak</button></li>
            </ul>
          </div>
          {/* Kontak & Bantuan */}
          <div className="flex flex-col items-start gap-2 w-full">
            <div className="font-bold mb-2 flex items-center gap-2"><svg className="w-5 h-5 text-teal-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 10.34V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h7.34" /></svg>Kontak & Bantuan</div>
            <ul className="space-y-1 text-sm md:text-base">
              <li className="flex items-center gap-2"><svg className="w-4 h-4 text-teal-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 01-8 0m8 0a4 4 0 00-8 0m8 0V8a4 4 0 00-8 0v4m8 0a4 4 0 01-8 0" /></svg>Email: <a href="mailto:admin@winfree.co.id" className="underline text-teal-100 hover:text-white">admin@winfree.co.id</a></li>
              <li className="flex items-center gap-2"><svg className="w-4 h-4 text-teal-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5h2a2 2 0 012 2v14a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2zm0 0V3a2 2 0 012-2h14a2 2 0 012 2v2" /></svg>Telepon: <a href="tel:+6287741415969" className="underline text-teal-100 hover:text-white">+62 877 4141 5969</a></li>
              <li className="flex items-center gap-2"><svg className="w-4 h-4 text-teal-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 12.414a4 4 0 10-5.657 5.657l4.243 4.243a8 8 0 1011.314-11.314l-4.243 4.243a4 4 0 00-5.657 5.657z" /></svg>Alamat: Parahyangan Business Park, The Suites Blok E5</li>
              <li className="flex items-center gap-2"><svg className="w-4 h-4 text-teal-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 22c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z" /></svg>Jl. Soekarno Hatta No. 693 Bandung, Jawa Barat 40286, Indonesia</li>
            </ul>
            {/* Social Media */}
            <div className="mt-4 w-full">
              <div className="text-xs text-teal-300 mb-1 font-semibold tracking-wide">Ikuti Kami</div>
              <div className="flex flex-row gap-4 items-center">
                <a href="https://youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-red-500 transition"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M21.8 8.001a2.752 2.752 0 0 0-1.936-1.948C18.2 5.5 12 5.5 12 5.5s-6.2 0-7.864.553A2.752 2.752 0 0 0 2.2 8.001 28.6 28.6 0 0 0 1.5 12a28.6 28.6 0 0 0 .7 3.999 2.752 2.752 0 0 0 1.936 1.948C5.8 18.5 12 18.5 12 18.5s6.2 0 7.864-.553A2.752 2.752 0 0 0 21.8 15.999 28.6 28.6 0 0 0 22.5 12a28.6 28.6 0 0 0-.7-3.999zM10 15.5v-7l6 3.5-6 3.5z"/></svg></a>
                <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-pink-400 transition"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5zm4.25 2.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zm5.25 1.25a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg></a>
                <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-blue-400 transition"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.632.771-1.632 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 16.991 22 12z"/></svg></a>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-teal-800 pt-4 text-center text-xs text-teal-300 opacity-80">
          &copy; {new Date().getFullYear()} WinFree. All rights reserved.
        </div>
      </footer>
    </div>
  );
}; 