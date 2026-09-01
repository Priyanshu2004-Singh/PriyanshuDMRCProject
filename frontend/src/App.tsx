import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { CivilFormPage } from './pages/CivilFormPage';
import { ElectricalFormPage } from './pages/ElectricalFormPage';
import { ArchitectureFormPage } from './pages/ArchitectureFormPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import api from './services/api';

export const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any | null>(null);
  const [company, setCompany] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('dmrc_token');
    if (token) {
      api
        .get('/auth/me')
        .then((res) => {
          setUser(res.data.user);
          setCompany(res.data.company);
        })
        .catch(() => {
          localStorage.removeItem('dmrc_token');
          localStorage.removeItem('dmrc_user');
          localStorage.removeItem('dmrc_company');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleLoginSuccess = (userData: any, companyData: any) => {
    setUser(userData);
    setCompany(companyData);
  };

  const handleLogout = () => {
    localStorage.removeItem('dmrc_token');
    localStorage.removeItem('dmrc_user');
    localStorage.removeItem('dmrc_company');
    setUser(null);
    setCompany(null);
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-dmrc-red text-white flex items-center justify-center font-bold text-2xl animate-pulse">
            M
          </div>
          <span className="text-xs font-semibold text-slate-500">Loading DMRC Vendor Portal...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} company={company} onLogout={handleLogout} />
      <main className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={<Navigate to={user ? (user.role === 'ADMIN' ? '/admin' : '/dashboard') : '/login'} replace />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} replace /> : <LoginPage onLoginSuccess={handleLoginSuccess} />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage onLoginSuccess={handleLoginSuccess} />}
          />
          <Route
            path="/dashboard"
            element={user ? <DashboardPage company={company} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/applications/civil/:id"
            element={user ? <CivilFormPage company={company} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/applications/electrical/:id"
            element={user ? <ElectricalFormPage company={company} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/applications/architecture/:id"
            element={user ? <ArchitectureFormPage company={company} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/admin"
            element={user && user.role === 'ADMIN' ? <AdminDashboardPage /> : <Navigate to="/dashboard" replace />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
