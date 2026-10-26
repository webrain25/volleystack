import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Trophy, Users, Wallet, Calendar, Shield, Activity, X } from 'lucide-react';
import Footer from '../components/Footer';
import Login from './Login';
import Register from './Register';

export default function Landing() {
  const location = useLocation();
  const navigate = useNavigate();
  
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
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl overflow-hidden shadow-sm">
              <img src="/logo.jpg" alt="VolleyStack Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-xl tracking-tight">VolleyStack</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors px-4 py-2 hidden sm:block">
              Accedi
            </Link>
            <Link to="/register" className="bg-brand-blue text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-brand-blue/30 hover:scale-105 transition-transform">
              Inizia Gratis
            </Link>
          </div>
        </div>
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
            <Link to="/register" className="w-full sm:w-auto flex items-center justify-center bg-brand-blue text-white px-8 py-4 rounded-full text-base font-bold shadow-xl shadow-brand-blue/30 hover:scale-105 transition-all">
              Crea la tua Squadra <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link to="/login" className="w-full sm:w-auto flex items-center justify-center bg-surface border border-border text-text-primary px-8 py-4 rounded-full text-base font-bold hover:bg-surface-hover transition-all">
              Accedi al tuo account
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
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-blue"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.1] mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Pronto a trasformare la tua squadra?</h2>
          <p className="text-white/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto">Unisciti a VolleyStack oggi. Registrazione gratuita, setup in 2 minuti e inizi subito a organizzare il prossimo allenamento.</p>
          <Link to="/register" className="inline-flex items-center justify-center bg-white text-brand-blue px-8 py-4 rounded-full text-lg font-bold shadow-2xl hover:scale-105 transition-all">
            Inizia Ora
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
