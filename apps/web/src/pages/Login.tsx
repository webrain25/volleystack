import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { Loader2, AlertCircle, ArrowRight, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import VolleyLogo from '../components/VolleyLogo';

interface LoginProps {
  inModal?: boolean;
}

export default function Login({ inModal = false }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      setAuth(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Errore durante il login');
    } finally {
      setIsLoading(false);
    }
  };

  const containerClasses = inModal
    ? 'w-full'
    : 'w-full flex flex-col items-center justify-center p-6 sm:p-12 min-h-screen bg-bg-primary';

  return (
    <div className={containerClasses}>
      <div className="w-full max-w-[420px] mx-auto space-y-6">
        {/* Header / Brand */}
        <div className="flex flex-col items-center text-center">
          <VolleyLogo size="lg" glow={false} className="mb-4" />
          <h2 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            Bentornato
          </h2>
          <p className="text-text-secondary text-xs sm:text-sm mt-1 max-w-sm">
            Inserisci le tue credenziali per entrare nello spogliatoio.
          </p>
        </div>

        {/* Auth Mode Switcher Tabs */}
        <div className="flex items-center p-1 bg-surface/80 rounded-xl border border-white/5">
          <button
            type="button"
            className="flex-1 py-2 text-xs font-bold rounded-lg bg-[#00F59B]/15 text-[#00F59B] border border-[#00F59B]/30 shadow-sm transition-all"
          >
            Accedi
          </button>
          <Link
            to="/register"
            className="flex-1 py-2 text-xs font-bold text-center text-text-secondary hover:text-text-primary transition-all rounded-lg"
          >
            Nuovo Account
          </Link>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-danger/10 text-danger border border-danger/20 text-xs sm:text-sm rounded-xl flex items-center font-medium animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 mr-2.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-text-tertiary">
              Email
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4 h-4 text-text-tertiary pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface border border-white/10 text-text-primary pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00F59B]/40 focus:border-[#00F59B] transition-all placeholder:text-text-tertiary text-sm"
                placeholder="mario@esempio.com"
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold uppercase tracking-wider text-text-tertiary">
                Password
              </label>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Contatta il tuo capitano o l\'amministratore di squadra per reimpostare la password.');
                }}
                className="text-[11px] font-bold text-[#00F59B] hover:text-[#22FFAB] transition-colors"
              >
                Password dimenticata?
              </a>
            </div>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-4 h-4 text-text-tertiary pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface border border-white/10 text-text-primary pl-10 pr-11 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00F59B]/40 focus:border-[#00F59B] transition-all placeholder:text-text-tertiary text-sm font-mono tracking-wider"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 p-1 text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
                title={showPassword ? 'Nascondi password' : 'Mostra password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full bg-gradient-to-r from-[#00F59B] via-[#00DF89] to-[#00C87E] hover:from-[#22FFAB] hover:to-[#00DF89] text-[#070B12] font-black py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(0,245,155,0.3)] hover:shadow-[0_0_30px_rgba(0,245,155,0.5)] flex justify-center items-center text-sm tracking-wide mt-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99]"
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <span className="flex items-center gap-2">
                Entra nello Spogliatoio <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </span>
            )}
          </button>
        </form>

        {/* Footer info */}
        <p className="text-center text-xs text-text-secondary pt-2">
          Non hai ancora un account?{' '}
          <Link to="/register" className="text-[#00F59B] hover:text-[#22FFAB] font-bold">
            Registrati gratis
          </Link>
        </p>
      </div>
    </div>
  );
}
