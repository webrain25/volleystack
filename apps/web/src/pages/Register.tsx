import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { Loader2, AlertCircle, ArrowRight, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import VolleyLogo from '../components/VolleyLogo';

interface RegisterProps {
  inModal?: boolean;
}

export default function Register({ inModal = false }: RegisterProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const token = response.data.token;
      let userObj = response.data.user;

      try {
        const meRes = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (meRes.data) {
          userObj = meRes.data;
        }
      } catch (meErr) {
        console.warn('Could not refresh full user profile on register', meErr);
      }

      setAuth(token, userObj);
      navigate('/team');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Errore durante la registrazione');
    } finally {
      setIsLoading(false);
    }
  };

  const containerClasses = inModal
    ? 'w-full'
    : 'w-full flex flex-col items-center justify-center p-4 sm:p-12 min-h-screen bg-bg-primary';

  return (
    <div className={containerClasses}>
      <div className="w-full space-y-4 sm:space-y-5">
        {/* Header / Brand */}
        <div className="flex flex-col items-center text-center">
          <VolleyLogo size="sm" glow={false} className="mb-2 max-w-[180px]" />
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white tracking-tight">
            Crea Account
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-0.5 max-w-sm">
            Unisciti subito alla tua squadra su VolleyStack.
          </p>
        </div>

        {/* Auth Mode Switcher Tabs */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-surface/80 rounded-xl border border-slate-200 dark:border-white/10">
          <Link
            to="/login"
            className="flex-1 py-2 text-xs font-bold text-center text-slate-600 hover:text-slate-950 dark:text-text-secondary dark:hover:text-text-primary transition-all rounded-lg"
          >
            Accedi
          </Link>
          <button
            type="button"
            className="flex-1 py-2 text-xs font-bold rounded-lg bg-[#0A4059] text-white dark:bg-[#38BDF8]/15 dark:text-[#38BDF8] border border-transparent dark:border-[#2A7EA2]/30 shadow-sm transition-all"
          >
            Nuovo Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-danger/10 text-danger border border-danger/20 text-xs sm:text-sm rounded-xl flex items-center font-medium animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 mr-2.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Nome Completo
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#0B132B] border border-slate-300 dark:border-white/15 text-slate-900 dark:text-slate-100 pl-10 pr-4 py-2.5 sm:py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/40 focus:border-[#0284C7] dark:focus:border-[#2A7EA2] transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
                placeholder="Mario Rossi"
                autoComplete="name"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Email
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#0B132B] border border-slate-300 dark:border-white/15 text-slate-900 dark:text-slate-100 pl-10 pr-4 py-2.5 sm:py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/40 focus:border-[#0284C7] dark:focus:border-[#2A7EA2] transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
                placeholder="mario@esempio.com"
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#0B132B] border border-slate-300 dark:border-white/15 text-slate-900 dark:text-slate-100 pl-10 pr-11 py-2.5 sm:py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/40 focus:border-[#0284C7] dark:focus:border-[#2A7EA2] transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm font-mono tracking-wider"
                placeholder="Minimo 6 caratteri"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                title={showPassword ? 'Nascondi password' : 'Mostra password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !name || !email || !password}
            className="w-full bg-[#0A4059] hover:bg-[#072d3f] text-white dark:bg-white dark:text-[#04060A] dark:hover:bg-slate-100 font-extrabold py-3 sm:py-3.5 rounded-xl transition-all shadow-md dark:shadow-[0_0_20px_rgba(56,189,248,0.3)] flex justify-center items-center text-sm tracking-wide mt-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99]"
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <span className="flex items-center gap-2">
                Crea Profilo e Accedi <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </span>
            )}
          </button>
        </form>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-600 dark:text-slate-400 pt-1">
          Hai già un account?{' '}
          <Link to="/login" className="text-[#0284C7] dark:text-[#38BDF8] hover:underline font-bold">
            Accedi allo spogliatoio
          </Link>
        </p>
      </div>
    </div>
  );
}
