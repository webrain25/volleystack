import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { Loader2, AlertCircle } from 'lucide-react';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  return (
    <div className="w-full flex flex-col items-center justify-center p-6 sm:p-12 h-full overflow-y-auto bg-bg-primary">
      <div className="w-full max-w-[420px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 bg-surface rounded-xl flex items-center justify-center shadow-sm overflow-hidden">
            <img src="/logo.jpg" alt="Logo" className="h-full w-full object-cover" />
          </div>
          <span className="text-2xl font-bold text-text-primary tracking-tight">VolleyStack</span>
        </div>

        <div>
          <h2 className="text-4xl font-extrabold text-text-primary tracking-tight mb-3">Bentornato</h2>
          <p className="text-text-secondary text-lg">Inserisci i tuoi dati per accedere.</p>
        </div>

        {error && (
          <div className="p-4 bg-danger/10 text-danger border border-danger/20 text-sm rounded-xl flex items-center font-medium">
            <AlertCircle className="w-5 h-5 mr-3 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-text-primary">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface border border-border text-text-primary px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all placeholder:text-text-tertiary"
              placeholder="mario@esempio.com"
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-bold text-text-primary">Password</label>
              <a href="#" className="text-sm font-bold text-brand-blue hover:text-brand-blue-bright transition-colors">Dimenticata?</a>
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface border border-border text-text-primary px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all placeholder:text-text-tertiary"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading || !email || !password}
            className="w-full bg-brand-blue hover:bg-brand-blue-bright text-white font-bold py-4 rounded-xl transition-all shadow-[0_4px_20px_rgba(37,99,235,0.3)] hover:shadow-[0_4px_25px_rgba(37,99,235,0.5)] flex justify-center items-center text-lg mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="animate-spin h-6 w-6" /> : 'Accedi'}
          </button>
        </form>

        <p className="text-center text-base text-text-secondary mt-8">
          Non hai un account? <Link to="/register" className="text-brand-blue hover:text-brand-blue-bright font-bold">Crealo gratis</Link>
        </p>
      </div>
    </div>
  );
}
