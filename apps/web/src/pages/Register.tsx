import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import VolleyLogo from '../components/VolleyLogo';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      setAuth(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Errore durante la registrazione');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-6 sm:p-12 h-full overflow-y-auto bg-bg-primary">
      <div className="w-full max-w-[420px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-3 mb-6">
          <VolleyLogo size="lg" />
        </div>

        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight mb-2">Nuovo Account</h2>
          <p className="text-text-secondary text-sm sm:text-base">Crea il tuo profilo e unisciti subito alla squadra.</p>
        </div>

        {error && (
          <div className="p-4 bg-danger/10 text-danger border border-danger/20 text-sm rounded-xl flex items-center font-medium">
            <AlertCircle className="w-5 h-5 mr-3 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-text-tertiary">Nome Completo</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface border border-border text-text-primary px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00F59B]/50 focus:border-[#00F59B] transition-all placeholder:text-text-tertiary text-sm"
              placeholder="Mario Rossi"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-text-tertiary">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface border border-border text-text-primary px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00F59B]/50 focus:border-[#00F59B] transition-all placeholder:text-text-tertiary text-sm"
              placeholder="mario@esempio.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-text-tertiary">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface border border-border text-text-primary px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00F59B]/50 focus:border-[#00F59B] transition-all placeholder:text-text-tertiary text-sm"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading || !email || !password || !name}
            className="w-full bg-gradient-to-r from-[#00F59B] via-[#00DF89] to-[#00C87E] hover:from-[#22FFAB] hover:to-[#00DF89] text-[#070B12] font-black py-4 rounded-xl transition-all shadow-[0_0_25px_rgba(0,245,155,0.35)] hover:shadow-[0_0_35px_rgba(0,245,155,0.55)] flex justify-center items-center text-base tracking-wide mt-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99]"
          >
            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : (
              <span className="flex items-center gap-2">
                Crea Account <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-text-secondary mt-8">
          Hai già un account? <Link to="/login" className="text-[#00F59B] hover:text-[#22FFAB] font-bold">Accedi ora</Link>
        </p>
      </div>
    </div>
  );
}
