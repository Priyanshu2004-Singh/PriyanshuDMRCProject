import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import api from '../services/api';

export const LoginPage: React.FC<{ onLoginSuccess: (user: any, company: any) => void }> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [userIdOrEmail, setUserIdOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        userIdOrEmail,
        password,
      });

      const { token, user, company } = response.data;

      localStorage.setItem('dmrc_token', token);
      localStorage.setItem('dmrc_user', JSON.stringify(user));
      localStorage.setItem('dmrc_company', JSON.stringify(company));

      onLoginSuccess(user, company);

      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid User ID / Email or Password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-xl relative overflow-hidden">
        {/* Header Ribbon */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-dmrc-red to-dmrc-darkRed h-2" />

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-dmrc-red text-white font-extrabold text-3xl flex items-center justify-center mx-auto mb-4 shadow-md">
            M
          </div>
          <h2 className="text-2xl font-black text-slate-900 font-outfit">Vendor Portal Login</h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Delhi Metro Rail Corporation Ltd. — Material Empanelment
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-3.5 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              User ID or Registered Email <span className="text-dmrc-red">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={userIdOrEmail}
                onChange={(e) => setUserIdOrEmail(e.target.value)}
                placeholder="e.g. DMRC-VND-0001 or vendor@company.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl outline-none font-semibold text-slate-800 focus:ring-2 focus:ring-dmrc-red/20 focus:border-dmrc-red"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password <span className="text-dmrc-red">*</span>
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl outline-none font-semibold text-slate-800 focus:ring-2 focus:ring-dmrc-red/20 focus:border-dmrc-red"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-dmrc-red hover:bg-dmrc-darkRed text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 uppercase tracking-wider disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Login Credentials Helper */}
        <div className="mt-8 pt-6 border-t border-slate-100 bg-slate-50/70 rounded-2xl p-4 text-[11px] text-slate-600">
          <div className="flex items-center space-x-1.5 text-dmrc-red font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Default DMRC Admin Account</span>
          </div>
          <p>User ID: <code className="font-mono text-slate-800 bg-slate-200 px-1 rounded">DMRC-ADMIN-01</code> | Password: <code className="font-mono text-slate-800 bg-slate-200 px-1 rounded">admin123</code></p>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500 font-medium">
          Don't have a registered vendor account?{' '}
          <Link to="/register" className="text-dmrc-red font-bold hover:underline">
            Register Company
          </Link>
        </div>
      </div>
    </div>
  );
};
