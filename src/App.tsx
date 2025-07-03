import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';
import { LoginForm } from './components/LoginForm';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { LocationsPage } from './components/LocationsPage';
import { MonitoringPage } from './components/MonitoringPage';
import { AlertsPage } from './components/AlertsPage';
import { PublicLocations } from './components/PublicLocations';
import { useAuth } from './hooks/useAuth';

// Halaman info publik (sementara statis)
const AboutPage = () => (
  <div className="p-8 max-w-2xl mx-auto">
    <h1 className="text-2xl font-bold mb-4">Tentang WiFi Publik</h1>
    <p className="text-gray-700">Aplikasi ini menampilkan lokasi WiFi publik yang dapat diakses masyarakat secara gratis.</p>
  </div>
);
const GuidePage = () => (
  <div className="p-8 max-w-2xl mx-auto">
    <h1 className="text-2xl font-bold mb-4">Panduan Penggunaan WiFi</h1>
    <ul className="list-disc pl-6 text-gray-700">
      <li>Cari lokasi WiFi terdekat di peta atau daftar.</li>
      <li>Klik marker atau nama lokasi untuk detail.</li>
      <li>Ikuti petunjuk keamanan saat menggunakan WiFi publik.</li>
    </ul>
  </div>
);
const ContactPage = () => (
  <div className="p-8 max-w-2xl mx-auto">
    <h1 className="text-2xl font-bold mb-4">Kontak & Pengaduan</h1>
    <p className="text-gray-700">Untuk pengaduan atau pertanyaan, silakan hubungi <a href="mailto:admin@wifi.com" className="text-blue-600 underline">admin@wifi.com</a></p>
  </div>
);

// Wrapper untuk proteksi route admin
const AdminRoutes: React.FC = () => {
  return (
    <AuthProvider>
      <LayoutWrapper />
    </AuthProvider>
  );
};

const LayoutWrapper: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = React.useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'locations':
        return <LocationsPage />;
      case 'monitoring':
        return <MonitoringPage />;
      case 'alerts':
        return <AlertsPage />;
      case 'public':
        return <PublicLocations />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman publik (tamu) */}
        <Route path="/" element={<PublicLocations />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/contact" element={<ContactPage />} />
        {/* Admin area */}
        <Route path="/admin/login" element={
          <AuthProvider>
            <LoginForm />
          </AuthProvider>
        } />
        <Route path="/admin/*" element={<AdminRoutes />} />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;