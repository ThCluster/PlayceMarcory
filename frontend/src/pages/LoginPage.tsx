import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import { CarrefourLogo } from '../components/common/CarrefourLogo';
import { useApp } from '../context/AppContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useApp();

  const [email, setEmail] = useState('admin@carrefour.ci');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      login(email, password);
      setIsLoading(false);
      navigate('/');
    } catch (err: any) {
      setIsLoading(false);
      setError(err?.message || 'Identifiants invalides');
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6fa] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 font-sans">
      {/* Background Subtle Accent Gradients */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-red-500/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-7 sm:p-9 relative z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Logo */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="bg-white p-2.5 rounded-2xl shadow-2xs border border-gray-100 mb-4">
            <CarrefourLogo variant="full" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Espace Connexion
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
            Gestion de Stock & Point de Vente
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-100 text-xs text-red-600 font-semibold flex items-center gap-2 animate-in fade-in">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Adresse Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre.email@carrefour.ci"
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-[#0942a6] focus:bg-white transition-all shadow-2xs font-medium"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-[#0942a6] focus:bg-white transition-all shadow-2xs font-medium"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me & Options */}
          <div className="flex items-center justify-between text-xs py-1">
            <label className="flex items-center gap-2 cursor-pointer text-gray-600 font-medium select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded-md border-gray-300 text-[#0942a6] focus:ring-[#0942a6]"
              />
              <span>Se souvenir de moi</span>
            </label>
            <button
              type="button"
              onClick={() => setError('Contactez votre administrateur système pour réinitialiser le mot de passe.')}
              className="font-bold text-[#0942a6] hover:underline"
            >
              Mot de passe oublié ?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0942a6] hover:bg-blue-800 text-white font-bold py-3.5 px-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-70 mt-2"
          >
            {isLoading ? (
              <span className="flex items-center gap-2 text-sm">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Connexion en cours...
              </span>
            ) : (
              <>
                <span className="text-sm">Se connecter au système</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Security Badge Footer */}
        <div className="mt-8 flex items-center justify-center gap-1.5 text-[11px] text-gray-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Accès sécurisé SSL • Carrefour Côte d'Ivoire</span>
        </div>
      </div>
    </div>
  );
};
