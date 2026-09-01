import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, LogOut, User, FileText, Home, Award } from 'lucide-react';

interface NavbarProps {
  user: any;
  company: any;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, company, onLogout }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      {/* Top Red DMRC Banner */}
      <div className="bg-dmrc-red text-white text-xs font-semibold px-4 py-1.5 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="bg-white/20 px-2 py-0.5 rounded text-[11px] uppercase tracking-wider">Official Portal</span>
          <span>Delhi Metro Rail Corporation Ltd. (DMRC) — Vendor Empanelment</span>
        </div>
        <div className="text-white/80 text-[11px] hidden sm:block">
          Ref: DMRC/Plg./Vendor/7000/Vol.2/2025/
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
        <Link to={user?.role === 'ADMIN' ? '/admin' : '/dashboard'} className="flex items-center space-x-3 group">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-dmrc-red to-dmrc-darkRed flex items-center justify-center text-white font-bold text-2xl shadow-md group-hover:scale-105 transition-transform">
            M
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-slate-900 text-xl tracking-tight font-outfit">DMRC</span>
              <span className="bg-dmrc-red/10 text-dmrc-red text-xs font-bold px-2 py-0.5 rounded-full uppercase">Vendor Portal</span>
            </div>
            <p className="text-xs text-slate-5-00 font-medium">Material & Product Empanelment System</p>
          </div>
        </Link>

        {user ? (
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-4 text-sm font-medium text-slate-600">
              <Link to="/dashboard" className="flex items-center space-x-1.5 hover:text-dmrc-red transition-colors">
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              {user.role === 'ADMIN' && (
                <Link to="/admin" className="flex items-center space-x-1.5 text-dmrc-red font-semibold hover:underline">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Portal</span>
                </Link>
              )}
            </div>

            <div className="flex items-center space-x-3 border-l border-slate-200 pl-6">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-slate-800">{company?.company_name || 'Vendor Company'}</div>
                <div className="text-[11px] font-mono text-slate-500">{user.user_id || user.userId} ({user.role})</div>
              </div>

              <button
                onClick={onLogout}
                className="flex items-center space-x-1.5 bg-slate-100 hover:bg-dmrc-lightRed hover:text-dmrc-red text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-lg transition-all"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-700 hover:text-dmrc-red px-4 py-2 rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-dmrc-red hover:bg-dmrc-darkRed text-white text-sm font-bold px-5 py-2.5 rounded-lg shadow-sm hover:shadow transition-all"
            >
              Register Company
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
