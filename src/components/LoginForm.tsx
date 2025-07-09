// [1] IMPORTS
import React, { useState } from 'react';
import { LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

// [2] LOGIN FORM COMPONENT
export const LoginForm: React.FC = () => {
  // State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogging, setIsLogging] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLogging(true);
    const success = await login(email, password);
    if (success) {
      navigate('/admin', { replace: true });
    } else {
      setError('Invalid credentials. Try admin@wifi.com / password');
    }
    setIsLogging(false);
  };

  // [3] RENDER
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Logo & Judul */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-100 rounded-full mb-4">
            <img src="/logo.png" alt="Logo WinFree" className="w-20 h-20 object-contain" />
          </div>
          {/* <h1 className="text-2xl font-bold text-gray-900">WinFree</h1> */}
          <p className="text-gray-600">Admin Login</p>
        </div>
        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent transition-all"
              placeholder="admin@wifi.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent transition-all"
              placeholder="password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLogging}
            className="w-full bg-teal-800 text-white py-3 px-4 rounded-lg hover:bg-teal-900 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <LogIn className="w-5 h-5" />
            <span>{isLogging ? 'Logging in...' : 'Login'}</span>
          </button>
        </form>
        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Demo Credentials:</strong><br />
            Email: admin@wifi.com<br />
            Password: password
          </p>
        </div>
      </div>
    </div>
  );
};
// [4] EXPORT