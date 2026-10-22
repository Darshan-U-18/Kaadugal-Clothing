import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

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
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in overflow-hidden">
      {/* 3D Realistic Forest Backdrop - 100% Crisp, Sharp & Clear */}
      <div className="absolute inset-0 z-0">
        <img
          src="/forest_3d_bg.jpg"
          alt="Kaadugal 3D Forest"
          className="w-full h-full object-cover object-center brightness-105 contrast-105 scale-100"
        />
        <div className="absolute inset-0 bg-black/35 pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-md bg-[#0B2419]/90 backdrop-blur-2xl rounded-3xl shadow-[0_25px_70px_rgba(4,18,11,0.95)] border border-[#386641]/60 overflow-hidden text-white">
        {/* Header with Kaadugal Brand Tone */}
        <div className="bg-[#071910]/85 p-6 text-white text-center relative border-b border-[#163D2B]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#A8BFA5] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <img src="/logo.png" alt="KAADUGAL" className="w-12 h-12 mx-auto rounded-xl shadow-md mb-3 object-cover border border-[#386641]/50" />
          <h3 className="font-editorial text-2xl tracking-wide">
            {mode === 'login' ? 'Welcome to Kaadugal' : 'Join Kaadugal'}
          </h3>
          <p className="text-xs text-[#A8BFA5] mt-1 font-light tracking-wider">
            {mode === 'login' ? 'Sign in to access your orders and wishlist.' : 'Wear Your Roots. Craftsmanship inspired by nature.'}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-950/60 border border-red-800 text-red-200 rounded-xl text-xs flex items-center gap-2">
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
                    placeholder="E.g. Siddharth Rao"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#386641]"
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
                  className="w-full pl-10 pr-4 py-2.5 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#386641]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8BFA5] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#386641]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#071910] border border-[#163D2B] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#386641]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 bg-gradient-to-r from-[#163D2B] to-[#386641] hover:from-[#1b4833] hover:to-[#437a4e] text-white border border-[#386641]/50 rounded-xl font-medium text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <span>{isLoading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-[#163D2B] text-center">
            <button
              type="button"
              onClick={() => {
                setError(null);
                setMode(mode === 'login' ? 'register' : 'login');
              }}
              className="text-xs text-[#A8BFA5] hover:text-[#FDE68A] font-medium transition-colors"
            >
              {mode === 'login'
                ? "Don't have an account yet? Create one"
                : 'Already have an account? Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
