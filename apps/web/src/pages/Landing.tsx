import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Trophy, Users, Wallet, Calendar, Shield, Activity, X, Sun, Moon } from 'lucide-react';
import Footer from '../components/Footer';
import Login from './Login';
import Register from './Register';
import VolleyLogo from '../components/VolleyLogo';
import { useThemeStore } from '../store/useThemeStore';

export default function Landing() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeStore();
  
  const isLogin = location.pathname === '/login';
  const isRegister = location.pathname === '/register';
  const isAuth = isLogin || isRegister;

  const closeAuth = () => {
    navigate('/');
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-bg-primary text-text-primary">
      {/* Main Landing Page Content */}
      <motion.div 
        animate={{ 
          scale: isAuth ? 0.95 : 1,
          x: isAuth ? (window.innerWidth >= 1024 ? '-25%' : '0%') : '0%', // Slide left on desktop
          opacity: isAuth ? 0.4 : 1,
          pointerEvents: isAuth ? 'none' : 'auto'
        }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        className="w-full h-full overflow-y-auto overflow-x-hidden absolute top-0 left-0"
      >
        <div className="min-h-screen">
          {/* Top Navbar */}
          <nav className="fixed top-0 w-full z-50 bg-bg-primary/80 backdrop-blur-xl border-b border-border/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
              <Link to="/" className="group flex items-center transition-transform hover:opacity-95">
                <VolleyLogo size="md" />
              </Link>
              
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button 
                  onClick={toggleTheme} 
                  aria-label="Toggle theme"
                  className="h-9 w-9 rounded-xl bg-surface/80 border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface transition-all active:scale-95 shadow-sm"
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>

                <Link 
                  to="/login" 
                  className="text-sm font-bold text-text-secondary hover:text-text-primary transition-all px-4 py-2.5 rounded-xl hover:bg-surface/70 border border-transparent hover:border-border hidden sm:block"
                >
                  Accedi
                </Link>

                <Link 
                  to="/register" 
                  className="relative inline-flex items-center justify-center bg-gradient-to-r from-[#00F59B] via-[#00DF89] to-[#00C87E] hover:from-[#22FFAB] hover:to-[#00DF89] text-[#070B12] px-5 py-2.5 rounded-xl text-sm font-black tracking-wide shadow-[0_0_20px_rgba(0,245,155,0.35)] hover:shadow-[0_0_30px_rgba(0,245,155,0.55)] hover:scale-[1.03] active:scale-[0.98] transition-all"
                >
                  Inizia Gratis
                </Link>
              </div>
            </div>
            {/* Subtle Neon Line Under Navbar */}
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#00F59B]/25 to-transparent" />
          </nav>

          {/* Hero Section */}
          <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img src="/backgrounds/court.jpg" alt="Volleyball Court" className="w-full h-full object-cover opacity-20 dark:opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-white dark:from-black/80 dark:via-[#0a0a0a]/90 dark:to-[#0a0a0a]"></div>
            </div>
            
            <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">

              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl leading-tight"
              >
                Abbiamo costruito un hub avanzato per la gestione e le performance della tua squadra.
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl text-text-tertiary mb-10 max-w-2xl leading-relaxed"
              >
                Your team. All in one place.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-4"
              >
                <Link to="/register" className="w-full sm:w-auto flex items-center justify-center bg-gradient-to-r from-[#00F59B] via-[#00DF89] to-[#00C87E] text-[#070B12] font-black px-8 py-4 rounded-xl text-base shadow-[0_0_25px_rgba(0,245,155,0.4)] hover:shadow-[0_0_35px_rgba(0,245,155,0.6)] hover:scale-105 transition-all">
                  Crea la tua Squadra <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link to="/login" className="w-full sm:w-auto flex items-center justify-center bg-surface border border-border text-text-primary px-8 py-4 rounded-xl text-base font-bold hover:bg-surface-hover hover:border-[#00F59B]/40 transition-all">
                  Accedi allo Spogliatoio
                </Link>
              </motion.div>
            </div>
          </section>

      {/* App Preview Image / Dashboard Mockup */}
      <section className="relative -mt-10 md:-mt-20 z-20 max-w-5xl mx-auto px-6 mb-32">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/20 dark:border-white/5 bg-surface"
        >
          <img src="/backgrounds/stats.jpg" alt="Dashboard Preview" className="w-full h-auto object-cover opacity-90" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-surface/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Tutto ciò di cui hai bisogno</h2>
            <p className="text-text-tertiary max-w-xl mx-auto text-lg">
              Sostituisci fogli Excel, chat Whatsapp infinite e confusione generale con uno strumento fatto apposta per la pallavolo.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-black p-8 rounded-3xl border border-border shadow-sm hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center mb-6">
                <Calendar className="h-6 w-6 text-brand-blue" />
              </div>
              <h3 className="text-xl font-bold mb-3">Eventi e Presenze</h3>
              <p className="text-text-tertiary">Pianifica allenamenti e partite. Ricevi notifiche istantanee e monitora in tempo reale chi ci sarà e chi no.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-black p-8 rounded-3xl border border-border shadow-sm hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6">
                <Wallet className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Cassa e Multe</h3>
              <p className="text-text-tertiary">Il tesoriere ha il controllo totale. Gestisci multe, quote associative e traccia ogni entrata e uscita in modo trasparente.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-black p-8 rounded-3xl border border-border shadow-sm hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6">
                <Activity className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Turno delle Paste</h3>
              <p className="text-text-tertiary">Mai più ritardi o dimenticanze per i compleanni o le schiacciate a rete. Il sistema assegna e ricorda chi deve portare i dolci.</p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white dark:bg-black p-8 rounded-3xl border border-border shadow-sm hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6">
                <Trophy className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Statistiche Avanzate</h3>
              <p className="text-text-tertiary">Dashboard analitica per monitorare presenze, sanzioni e andamento stagionale di ogni giocatore.</p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white dark:bg-black p-8 rounded-3xl border border-border shadow-sm hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-indigo-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Ruoli Personalizzati</h3>
              <p className="text-text-tertiary">Allenatore, Capitano, Dirigente, Tesoriere. Ognuno ha i propri permessi per gestire la squadra al meglio.</p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white dark:bg-black p-8 rounded-3xl border border-border shadow-sm hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-2xl bg-rose-500/10 flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-rose-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Privacy & Sicurezza</h3>
              <p className="text-text-tertiary">I dati della tua squadra sono al sicuro. Infrastruttura moderna per garantire massima affidabilità in ogni momento.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 relative overflow-hidden bg-gradient-to-b from-surface via-[#0a1220] to-[#070B12] border-t border-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#00F59B]/15 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">Pronto a trasformare la tua squadra?</h2>
          <p className="text-text-secondary text-lg md:text-xl mb-10 max-w-2xl mx-auto">Unisciti a VolleyStack oggi. Registrazione gratuita, setup in 2 minuti e inizi subito a organizzare il prossimo allenamento.</p>
          <Link to="/register" className="inline-flex items-center justify-center bg-gradient-to-r from-[#00F59B] via-[#00DF89] to-[#00C87E] text-[#070B12] px-8 py-4 rounded-xl text-lg font-black shadow-[0_0_35px_rgba(0,245,155,0.45)] hover:shadow-[0_0_45px_rgba(0,245,155,0.65)] hover:scale-105 transition-all">
            Inizia Ora <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

          <Footer />
        </div>
      </motion.div>

      {/* Auth Drawer */}
      <AnimatePresence>
        {isAuth && (
          <>
            {/* Backdrop for mobile */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
              onClick={closeAuth}
            />

            {/* Auth Panel */}
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: '0%', opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              className="absolute top-0 right-0 w-full lg:w-1/2 h-full z-50 bg-bg-primary shadow-2xl border-l border-border/50 overflow-hidden"
            >
              <button 
                onClick={closeAuth}
                className="absolute top-6 left-6 z-[60] p-2 rounded-full bg-surface hover:bg-surface-hover border border-border text-text-primary transition-colors shadow-sm"
                title="Chiudi"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-full h-full overflow-hidden">
                {isLogin ? <Login /> : <Register />}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
