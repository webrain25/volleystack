import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Trophy,
  Users,
  Wallet,
  Calendar,
  Shield,
  Activity,
  X,
  Sun,
  Moon,
  CheckCircle2,
  Clock,
  MapPin,
  TrendingUp,
  Zap,
} from 'lucide-react';
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
    <div className="relative w-full min-h-screen text-text-primary overflow-x-hidden scroll-smooth selection:bg-[#00F59B]/30 selection:text-white">
      {/* Real Volleyball Court Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <img
          src="/backgrounds/court.jpg"
          alt="Campo di Pallavolo"
          className="w-full h-full object-cover object-center filter brightness-[0.70] contrast-[1.05]"
        />
        {/* Soft gradient overlays so text remains pristine and readable while the court is clearly visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#070B12]/80 via-[#070B12]/40 to-[#070B12] z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(7,11,18,0.2)_0%,rgba(7,11,18,0.75)_100%)] z-0" />
      </div>

      {/* Main Page Layout */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between w-full">
        {/* In-Page Header: 100% centered, responsive, zero horizontal overflow */}
        <header className="relative z-30 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-4 sm:pt-8 flex items-center justify-between pb-4 sm:pb-6 border-b border-white/10">
          <Link to="/" className="group flex items-center transition-transform hover:opacity-95 shrink-0">
            <VolleyLogo size="md" />
          </Link>

          <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-text-secondary hover:text-text-primary transition-all active:scale-95 cursor-pointer shadow-sm"
            >
              {theme === 'dark' ? <Sun className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Moon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
            </button>

            <Link
              to="/login"
              className="text-xs sm:text-sm font-bold text-text-primary hover:text-[#00F59B] transition-all px-2.5 py-1.5 sm:px-4 sm:py-2.5 rounded-xl hover:bg-white/5 border border-white/10 hover:border-[#00F59B]/30"
            >
              Accedi
            </Link>

            <Link
              to="/register"
              className="relative inline-flex items-center justify-center bg-gradient-to-r from-[#00F59B] via-[#00DF89] to-[#00C87E] hover:from-[#22FFAB] hover:to-[#00DF89] text-[#070B12] px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black tracking-wide shadow-[0_0_20px_rgba(0,245,155,0.35)] hover:shadow-[0_0_30px_rgba(0,245,155,0.55)] hover:scale-[1.03] active:scale-[0.98] transition-all"
            >
              <span className="sm:hidden">Inizia</span>
              <span className="hidden sm:inline">Inizia Gratis</span>
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative pt-8 pb-12 sm:pt-14 sm:pb-16 md:pt-20 md:pb-24 px-4 sm:px-6 w-full overflow-hidden">
          <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-2xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-4 sm:mb-6 max-w-4xl leading-[1.18] sm:leading-[1.05] text-center"
            >
              Tutto il tuo spogliatoio{' '}
              <span className="bg-gradient-to-r from-[#00F59B] via-[#22FFAB] to-[#00DF89] bg-clip-text text-transparent block sm:inline-block">
                in un'unica app
              </span>.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm sm:text-lg md:text-xl text-text-secondary mb-8 sm:mb-10 max-w-2xl leading-relaxed px-1 sm:px-0"
            >
              Convocazioni, presenze, cassa multe e turno delle paste.
              Semplice, trasparente e sincronizzato con il calendario del tuo campionato.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-xs sm:max-w-none mx-auto"
            >
              <Link
                to="/register"
                className="w-full sm:w-auto flex items-center justify-center bg-gradient-to-r from-[#00F59B] via-[#00DF89] to-[#00C87E] text-[#070B12] font-black px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-sm sm:text-lg shadow-[0_0_25px_rgba(0,245,155,0.4)] hover:shadow-[0_0_40px_rgba(0,245,155,0.65)] hover:scale-105 active:scale-95 transition-all text-center"
              >
                Crea la tua Squadra <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto flex items-center justify-center bg-surface border border-border text-text-primary px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-sm sm:text-lg font-bold hover:bg-surface-hover hover:border-[#00F59B]/40 transition-all active:scale-95 shadow-sm text-center"
              >
                Accedi allo Spogliatoio
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Live Interactive Dashboard Preview Mockup */}
        <section className="relative z-20 max-w-5xl mx-auto px-3 sm:px-6 mb-16 sm:mb-24 md:mb-36 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative rounded-2xl sm:rounded-3xl p-1 bg-gradient-to-b from-white/20 via-white/5 to-transparent dark:from-white/10 dark:via-white/5 dark:to-transparent shadow-[0_20px_80px_rgba(0,0,0,0.5)] w-full overflow-hidden"
          >
            {/* Floating Status Badges - only on large desktop screens */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              className="hidden lg:flex absolute -top-5 -left-4 z-30 items-center gap-2 px-4 py-2.5 rounded-2xl bg-surface/90 border border-[#00F59B]/40 shadow-[0_10px_30px_rgba(0,245,155,0.2)] backdrop-blur-md"
            >
              <Zap className="h-4 w-4 text-[#00F59B]" />
              <span className="text-xs font-black text-text-primary">Calendario FIPAV Sincronizzato</span>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="hidden lg:flex absolute -bottom-5 -right-4 z-30 items-center gap-2 px-4 py-2.5 rounded-2xl bg-surface/90 border border-[#00F59B]/40 shadow-[0_10px_30px_rgba(0,245,155,0.2)] backdrop-blur-md"
            >
              <CheckCircle2 className="h-4 w-4 text-[#00F59B]" />
              <span className="text-xs font-black text-text-primary">14 Convocati • Tutti Presenti</span>
            </motion.div>

            {/* Inner Glass Workspace Window */}
            <div className="rounded-[16px] sm:rounded-[22px] bg-[#0A101D]/95 dark:bg-[#070B14]/95 border border-border backdrop-blur-2xl overflow-hidden p-3.5 sm:p-6 md:p-8 text-left">
              {/* Window Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border/70 pb-3 sm:pb-4 mb-4 sm:mb-6 gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-danger/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-warning/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-success/80" />
                  <span className="ml-2 text-xs font-mono text-text-tertiary truncate">
                    Volley Roma — Prossima Partita
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#00F59B]/10 border border-[#00F59B]/30 text-[#00F59B] text-[11px] font-bold self-start sm:self-auto">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00F59B] animate-pulse" />
                  SPOGLIATOIO ATTIVO
                </div>
              </div>

              {/* Dynamic Mockup Body */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-6">
                {/* Main Match Card */}
                <div className="md:col-span-2 rounded-xl sm:rounded-2xl bg-surface/40 border border-border p-3.5 sm:p-6 relative overflow-hidden">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <span className="px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-black bg-warning/20 text-warning border border-warning/30">
                      PARTITA UFFICIALE
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold text-text-tertiary flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Tra 3 giorni
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-2xl md:text-3xl font-black text-white tracking-tight mb-1.5 sm:mb-2">
                    Campionato: Volley Roma vs Virtus Sharks
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary flex items-center gap-1.5 mb-4 sm:mb-6">
                    <MapPin className="w-3.5 h-3.5 text-[#00F59B] shrink-0" />
                    <span className="truncate">Sabato 31 Ottobre • 17:00 • Palazzetto</span>
                  </p>

                  <div className="grid grid-cols-3 gap-1 sm:gap-3 pt-2 border-t border-border/50 min-w-0">
                    <div className="px-1 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-[#00F59B]/20 border border-[#00F59B]/50 text-[#00F59B] text-[9px] sm:text-xs font-black flex items-center justify-center gap-1 text-center truncate min-w-0">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 hidden sm:inline" /> CI SONO (14)
                    </div>
                    <div className="px-1 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-surface/50 border border-border text-text-tertiary text-[9px] sm:text-xs font-bold text-center truncate min-w-0">
                      ASSENTE (0)
                    </div>
                    <div className="px-1 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-surface/50 border border-border text-text-tertiary text-[9px] sm:text-xs font-bold text-center truncate min-w-0">
                      IN DUBBIO (0)
                    </div>
                  </div>
                </div>

                {/* Side Stats Columns */}
                <div className="grid grid-cols-2 md:grid-cols-1 gap-2 sm:gap-4 min-w-0">
                  {/* Presenze Box */}
                  <div className="rounded-xl sm:rounded-2xl bg-surface/40 border border-border p-2.5 sm:p-5 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-text-tertiary truncate">
                        Presenze
                      </span>
                      <TrendingUp className="w-3.5 h-3.5 text-[#00F59B] shrink-0" />
                    </div>
                    <div className="text-xl sm:text-3xl font-black text-white mb-1.5">14 / 14</div>
                    <div className="w-full h-1.5 sm:h-2 rounded-full bg-surface overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#00F59B] to-[#22FFAB] rounded-full w-full" />
                    </div>
                  </div>

                  {/* Cassa Multe Box */}
                  <div className="rounded-xl sm:rounded-2xl bg-surface/40 border border-border p-2.5 sm:p-5 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-text-tertiary truncate">
                        Cassa Multe
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-bold text-[#00F59B] bg-[#00F59B]/15 px-1.5 py-0.5 rounded">
                        REGOLARE
                      </span>
                    </div>
                    <div className="text-base sm:text-2xl font-black text-white">€ 142.50</div>
                    <p className="text-[10px] sm:text-xs text-text-tertiary mt-0.5 truncate">Saldo squadra</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Social Proof Metrics Bar */}
        <section className="py-10 sm:py-12 border-y border-border/80 bg-surface/40 backdrop-blur-lg mb-16 sm:mb-24 w-full">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div>
              <div className="text-2xl sm:text-4xl md:text-5xl font-black text-text-primary tracking-tight mb-1">0 €</div>
              <div className="text-[11px] sm:text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                Gratis per tutta la squadra
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl md:text-5xl font-black text-[#00F59B] tracking-tight mb-1">1 Click</div>
              <div className="text-[11px] sm:text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                Importa gare FIPAV
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl md:text-5xl font-black text-text-primary tracking-tight mb-1">100%</div>
              <div className="text-[11px] sm:text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                Trasparenza sulla Cassa
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl md:text-5xl font-black text-[#00F59B] tracking-tight mb-1">H24</div>
              <div className="text-[11px] sm:text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                Da smartphone, tablet e PC
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid Section */}
        <section className="py-10 sm:py-16 md:py-24 max-w-6xl mx-auto px-4 sm:px-6 mb-16 sm:mb-24 w-full">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight mb-3 sm:mb-4 text-text-primary">
              Progettato per chi vive la pallavolo ogni settimana.
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
              Basta con i fogli volanti, i messaggi persi nelle chat di gruppo e i conti a penna. Con VolleyStack hai tutto lo spogliatoio sotto controllo in un unico posto.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <motion.div
              whileHover={{ y: -6, scale: 1.015 }}
              className="saas-card p-6 sm:p-8 rounded-2xl sm:rounded-3xl group border border-border hover:border-[#00F59B]/50 transition-all duration-300"
            >
              <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-[#00F59B]/10 border border-[#00F59B]/20 flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-110 transition-transform">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-[#00F59B]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-text-primary">Partite, Allenamenti e Presenze</h3>
              <p className="text-text-secondary text-xs sm:text-sm leading-relaxed">
                Segna chi c'è e chi salta con un tocco. Il mister e il capitano sanno sempre con precisione chi sarà in palestra.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              whileHover={{ y: -6, scale: 1.015 }}
              className="saas-card p-6 sm:p-8 rounded-2xl sm:rounded-3xl group border border-border hover:border-[#00F59B]/50 transition-all duration-300"
            >
              <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-[#00F59B]/10 border border-[#00F59B]/20 flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-110 transition-transform">
                <Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-[#00F59B]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-text-primary">Cassa Multe della Squadra</h3>
              <p className="text-text-secondary text-xs sm:text-sm leading-relaxed">
                Ritardi, ginocchiere dimenticate o cartellini. Ognuno vede le proprie multe e il tesoriere tiene i conti in ordine senza discussioni.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              whileHover={{ y: -6, scale: 1.015 }}
              className="saas-card p-6 sm:p-8 rounded-2xl sm:rounded-3xl group border border-border hover:border-[#00F59B]/50 transition-all duration-300"
            >
              <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-[#00F59B]/10 border border-[#00F59B]/20 flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-110 transition-transform">
                <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-[#00F59B]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-text-primary">Il Turno delle Paste</h3>
              <p className="text-text-secondary text-xs sm:text-sm leading-relaxed">
                Compleanni, esordi in campo o una schiacciata finita dritta sull'asta: assegna il turno dolci e ricorda a tutti chi deve portare la colazione!
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              whileHover={{ y: -6, scale: 1.015 }}
              className="saas-card p-6 sm:p-8 rounded-2xl sm:rounded-3xl group border border-border hover:border-[#00F59B]/50 transition-all duration-300"
            >
              <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-[#00F59B]/10 border border-[#00F59B]/20 flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-110 transition-transform">
                <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-[#00F59B]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-text-primary">Classifiche e Statistiche</h3>
              <p className="text-text-secondary text-xs sm:text-sm leading-relaxed">
                Scopri chi è il più multato della stagione, chi non salta mai un allenamento e i numeri della tua squadra nel campionato.
              </p>
            </motion.div>

            {/* Feature 5 */}
            <motion.div
              whileHover={{ y: -6, scale: 1.015 }}
              className="saas-card p-6 sm:p-8 rounded-2xl sm:rounded-3xl group border border-border hover:border-[#00F59B]/50 transition-all duration-300"
            >
              <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-[#00F59B]/10 border border-[#00F59B]/20 flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-[#00F59B]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-text-primary">Invito Rapido con Codice</h3>
              <p className="text-text-secondary text-xs sm:text-sm leading-relaxed">
                Mister, capitano o giocatore. Condividi un semplice codice di 6 lettere nella chat di squadra per far entrare tutti all'istante.
              </p>
            </motion.div>

            {/* Feature 6 */}
            <motion.div
              whileHover={{ y: -6, scale: 1.015 }}
              className="saas-card p-6 sm:p-8 rounded-2xl sm:rounded-3xl group border border-border hover:border-[#00F59B]/50 transition-all duration-300"
            >
              <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-[#00F59B]/10 border border-[#00F59B]/20 flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-110 transition-transform">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-[#00F59B]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-text-primary">Dati Sempre al Sicuro</h3>
              <p className="text-text-secondary text-xs sm:text-sm leading-relaxed">
                Nessun rischio di perdere fogli o chat cancellate. Le presenze, le casse e il calendario rimangono sempre salvati e sincronizzati.
              </p>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24 md:py-28 relative overflow-hidden bg-gradient-to-b from-surface via-[#0A111F] to-[#070B12] border-t border-border w-full">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#00F59B]/15 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.035] mix-blend-overlay pointer-events-none" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-4 sm:mb-6">
              Pronto a organizzare il tuo spogliatoio?
            </h2>
            <p className="text-text-secondary text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-2xl mx-auto px-2">
              Bastano due minuti per creare la squadra e riunire tutto il tuo spogliatoio.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center justify-center bg-gradient-to-r from-[#00F59B] via-[#00DF89] to-[#00C87E] text-[#070B12] px-7 py-3.5 sm:px-8 sm:py-4 rounded-xl text-base sm:text-lg font-black shadow-[0_0_35px_rgba(0,245,155,0.45)] hover:shadow-[0_0_45px_rgba(0,245,155,0.65)] hover:scale-105 active:scale-95 transition-all w-full max-w-xs sm:max-w-none sm:w-auto"
            >
              Crea la tua Squadra Gratis <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>

      {/* Centered Auth Modal (Opzione A) */}
      <AnimatePresence>
        {isAuth && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            {/* Backdrop with Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
              onClick={closeAuth}
            />

            {/* Centered Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[440px] my-auto bg-[#0A101D]/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_35px_rgba(0,245,155,0.12)] p-4 sm:p-8 z-10 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Subtle Ambient Radial Accents */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#00F59B]/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#22FFAB]/15 rounded-full blur-3xl pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={closeAuth}
                className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-text-secondary hover:text-text-primary transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
                title="Chiudi"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative z-10">
                {isLogin ? <Login inModal /> : <Register inModal />}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
