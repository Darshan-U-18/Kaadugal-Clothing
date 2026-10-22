import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Mail, User as UserIcon, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';


export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const redirectPath = searchParams.get('redirect') || '/account';

  const { user, isAdmin, login, register } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      if (isAdmin && redirectPath === '/account') {
        navigate('/admin');
      } else {
        navigate(redirectPath);
      }
    }
  }, [user, isAdmin, redirectPath, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await login({ email, password });
      } else {
        await register({ name, email, password });
      }
      navigate(redirectPath);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#071910] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Bright 3D Realistic Sun-Drenched Forest Background - 100% Crisp, Sharp & Clear */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/forest_3d_bg.jpg"
          alt="Kaadugal 3D Realistic Forest"
          className="w-full h-full object-cover object-center brightness-105 contrast-105"
        />
        {/* Minimal transparent overlay - keeps the entire 3D forest completely crisp and visible */}
        <div className="absolute inset-0 bg-black/15 pointer-events-none" />
      </div>

      <div className="w-full max-w-md bg-[#071910]/85 backdrop-blur-2xl rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.85)] border border-[#386641]/60 overflow-hidden animate-fade-in relative z-10">
        {/* Editorial Brand Header */}
        <div className="bg-[#071910]/90 p-8 text-white text-center relative border-b border-[#163D2B]">
          <Link to="/" className="inline-block group">
            <img
              src="/logo.png"
              alt="KAADUGAL Brand Mark"
              className="w-14 h-14 mx-auto rounded-2xl shadow-lg mb-3 object-cover border border-[#386641]/50 group-hover:scale-105 transition-transform"
            />
          </Link>
          <h1 className="font-editorial text-3xl font-bold tracking-wide text-white">
            {mode === 'login' ? 'Welcome to Kaadugal' : 'Join Kaadugal'}
          </h1>
          <p className="text-xs text-[#A8BFA5] font-light tracking-wider mt-1">
            {mode === 'login'
              ? 'Sign in to access your wardrobe, orders, and wishlist.'
              : 'Create your KAADUGAL account to wear your roots.'}
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-[#0B2419] rounded-xl p-1 mt-6 border border-[#163D2B]">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-[#163D2B] text-white shadow-sm border border-[#386641]/50'
                  : 'text-[#A8BFA5] hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-[#163D2B] text-white shadow-sm border border-[#386641]/50'
                  : 'text-[#A8BFA5] hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-5 p-3.5 bg-red-950/60 border border-red-800/80 text-red-200 rounded-xl text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-[#386641]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Darshan"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#386641] transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#386641]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#386641] transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#A8BFA5]">
                  Password
                </label>
                {mode === 'login' && (
                  <span className="text-[11px] text-[#A8BFA5]/60">Min. 6 characters</span>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#386641]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#386641] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#A8BFA5] hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 bg-gradient-to-r from-[#163D2B] to-[#386641] hover:from-[#1b4833] hover:to-[#437a4e] text-white border border-[#386641]/50 rounded-xl font-medium text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isLoading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#163D2B] text-center">
            <Link to="/" className="text-xs text-[#A8BFA5] hover:text-[#FDE68A] transition-colors font-medium">
              ← Return to Kaadugal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
