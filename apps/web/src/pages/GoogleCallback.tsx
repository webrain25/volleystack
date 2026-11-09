import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import VolleyLogo from '../components/VolleyLogo';

export default function GoogleCallback() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const googleError = params.get('error');

    if (googleError) {
      setError(`Accesso rifiutato da Google: ${googleError}`);
      return;
    }

    if (!code) {
      setError('Nessun codice di autorizzazione ricevuto da Google.');
      return;
    }

    const exchangeCode = async () => {
      try {
        const redirectUri = `${window.location.origin}/auth/google/callback`;
        const res = await api.post('/auth/google', { code, redirectUri });

        const { token, user } = res.data;
        setAuth(token, user);

        // If user is already in a team go to dashboard, otherwise prompt to join/create team
        if (user.memberships && user.memberships.length > 0) {
          navigate('/dashboard');
        } else {
          navigate('/team');
        }
      } catch (err: any) {
        console.error('Google authentication failed', err);
        setError(
          err.response?.data?.error ||
          'Impossibile completare l\'accesso con Google. Riprova o registrati con email.'
        );
      }
    };

    exchangeCode();
  }, [navigate, setAuth]);

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-5 animate-in fade-in duration-300">
        <VolleyLogo size="md" glow={false} className="mx-auto" />

        {error ? (
          <div className="space-y-4">
            <div className="p-4 bg-danger/10 border border-danger/30 rounded-2xl text-danger text-sm flex items-start gap-3 text-left">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">Accesso Google non riuscito</p>
                <p className="text-xs opacity-90">{error}</p>
              </div>
            </div>

            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#0A4059] hover:bg-[#072d3f] text-white dark:bg-white dark:text-slate-950 font-bold rounded-xl text-sm transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Torna al Login
            </Link>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="relative mx-auto w-12 h-12 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-[#38BDF8] animate-spin" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Accesso con Google in corso...
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Stiamo sincronizzando il tuo profilo Google con lo spogliatoio.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
