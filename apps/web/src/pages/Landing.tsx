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
    <div className="relative w-full min-h-screen bg-bg-primary text-text-primary overflow-x-hidden scroll-smooth selection:bg-[#00F59B]/30 selection:text-white">
      {/* Dynamic Ambient Background */}
      <div className="ambient-bg-container fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 z-0 opacity-10 dark:opacity-25 transition-opacity duration-700">
          <img
            src="/backgrounds/court.jpg"
            alt="Court Ambient"
            className="w-full h-full object-cover mix-blend-luminosity filter blur-[1px]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/50 via-bg-primary/90 to-bg-primary z-0" />
        <div className="ambient-court-lines" />
        <div className="ambient-light-orb" />
        <div className="ambient-light-orb-secondary" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.035] mix-blend-overlay" />
      </div>

      {/* Main Page Layout */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between">
        {/* Top Navbar */}
        <nav className="fixed top-0 w-full z-40 bg-bg-primary/80 backdrop-blur-xl border-b border-border/80 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
            <Link to="/" className="group flex items-center transition-transform hover:opacity-95">
              <VolleyLogo size="md" />
            </Link>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="h-10 w-10 rounded-xl bg-surface/80 border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface transition-all active:scale-95 shadow-sm"
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
        <section className="relative pt-32 pb-16 md:pt-48 md:pb-24 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
            {/* Beacon Pill */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-surface/85 border border-[#00F59B]/40 shadow-[0_0_20px_rgba(0,245,155,0.18)] mb-8 backdrop-blur-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F59B] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00F59B]" />
              </span>
              <span className="text-xs font-bold tracking-wider text-text-primary uppercase">
                Next-Gen Volleyball Suite • Stagione 25/26
              </span>
              <span className="text-[10px] font-black bg-[#00F59B]/20 text-[#00F59B] px-1.5 py-0.5 rounded">
                LIVE
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 max-w-5xl leading-[1.05]"
            >
              Il gestionale spogliatoio{' '}
              <span className="bg-gradient-to-r from-[#00F59B] via-[#22FFAB] to-[#00DF89] bg-clip-text text-transparent">
                definitivo
              </span>{' '}
              per la tua squadra.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-2xl text-text-secondary mb-10 max-w-3xl leading-relaxed"
            >
              Convocazioni, presenze, cassa multe, turno paste e statistiche in tempo reale.
              Sincronizzato direttamente con i calendari ufficiali di campionato.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <Link
                to="/register"
                className="w-full sm:w-auto flex items-center justify-center bg-gradient-to-r from-[#00F59B] via-[#00DF89] to-[#00C87E] text-[#070B12] font-black px-8 py-4 rounded-xl text-base sm:text-lg shadow-[0_0_25px_rgba(0,245,155,0.4)] hover:shadow-[0_0_40px_rgba(0,245,155,0.65)] hover:scale-105 active:scale-95 transition-all"
              >
                Crea la tua Squadra <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto flex items-center justify-center bg-surface border border-border text-text-primary px-8 py-4 rounded-xl text-base sm:text-lg font-bold hover:bg-surface-hover hover:border-[#00F59B]/40 transition-all active:scale-95 shadow-sm"
              >
                Accedi allo Spogliatoio
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Live Interactive Dashboard Telemetry Mockup */}
        <section className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 mb-24 md:mb-36">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative rounded-3xl p-1 bg-gradient-to-b from-white/20 via-white/5 to-transparent dark:from-white/10 dark:via-white/5 dark:to-transparent shadow-[0_20px_80px_rgba(0,0,0,0.5)]"
          >
            {/* Floating Telemetry Pills */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              className="hidden lg:flex absolute -top-5 -left-4 z-30 items-center gap-2 px-4 py-2.5 rounded-2xl bg-surface/90 border border-[#00F59B]/40 shadow-[0_10px_30px_rgba(0,245,155,0.2)] backdrop-blur-md"
            >
              <Zap className="h-4 w-4 text-[#00F59B]" />
              <span className="text-xs font-black text-text-primary">FIPAV Sync • 22 Gare Importate</span>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="hidden lg:flex absolute -bottom-5 -right-4 z-30 items-center gap-2 px-4 py-2.5 rounded-2xl bg-surface/90 border border-[#00F59B]/40 shadow-[0_10px_30px_rgba(0,245,155,0.2)] backdrop-blur-md"
            >
              <CheckCircle2 className="h-4 w-4 text-[#00F59B]" />
              <span className="text-xs font-black text-text-primary">14 Convocati Presenti • Quorum 94%</span>
            </motion.div>

            {/* Inner Glass Workspace Window */}
            <div className="rounded-[22px] bg-[#0A101D]/90 dark:bg-[#070B14]/95 border border-border backdrop-blur-2xl overflow-hidden p-6 sm:p-8 text-left">
              {/* Window Header */}
              <div className="flex items-center justify-between border-b border-border/70 pb-5 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-danger/80" />
                  <div className="w-3 h-3 rounded-full bg-warning/80" />
                  <div className="w-3 h-3 rounded-full bg-success/80" />
                  <span className="ml-3 text-xs font-mono text-text-tertiary">
                    Volley Roma Spikers — Pro Matchday Telemetry
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#00F59B]/10 border border-[#00F59B]/30 text-[#00F59B] text-xs font-bold">
                  <span className="h-2 w-2 rounded-full bg-[#00F59B] animate-pulse" />
                  LIVE SPOGLIATOIO ATTIVO
                </div>
              </div>

              {/* Dynamic Mockup Body */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Match Card */}
                <div className="md:col-span-2 rounded-2xl bg-surface/40 border border-border p-6 relative overflow-hidden">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-md text-xs font-black bg-warning/20 text-warning border border-warning/30">
                      PARTITA UFFICIALE
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold text-text-tertiary flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Tra 3 giorni
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
                    Campionato: Volley Roma vs Virtus Sharks
                  </h3>
                  <p className="text-sm text-text-secondary flex items-center gap-1.5 mb-6">
                    <MapPin className="w-4 h-4 text-[#00F59B]" /> Sabato 31 Ottobre • 17:00 • Palazzetto Comunale (Trasferta)
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border/50">
                    <div className="px-4 py-2 rounded-xl bg-[#00F59B]/20 border border-[#00F59B]/50 text-[#00F59B] text-xs font-black flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> CI SONO (14)
                    </div>
                    <div className="px-4 py-2 rounded-xl bg-surface/50 border border-border text-text-tertiary text-xs font-bold">
                      ASSENTE (0)
                    </div>
                    <div className="px-4 py-2 rounded-xl bg-surface/50 border border-border text-text-tertiary text-xs font-bold">
                      IN DUBBIO (0)
                    </div>
                  </div>
                </div>

                {/* Side Stats Columns */}
                <div className="space-y-4">
                  {/* Quorum Box */}
                  <div className="rounded-2xl bg-surface/40 border border-border p-5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
                        Quorum Roster
                      </span>
                      <TrendingUp className="w-4 h-4 text-[#00F59B]" />
                    </div>
                    <div className="text-3xl font-black text-white mb-2">94%</div>
                    <div className="w-full h-2 rounded-full bg-surface overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#00F59B] to-[#22FFAB] rounded-full w-[94%]" />
                    </div>
                  </div>

                  {/* Cassa Multe Box */}
                  <div className="rounded-2xl bg-surface/40 border border-border p-5">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
                        Cassa Multe & Tax
                      </span>
                      <span className="text-[10px] font-bold text-[#00F59B] bg-[#00F59B]/15 px-2 py-0.5 rounded">
                        REGOLARE
                      </span>
                    </div>
                    <div className="text-2xl font-black text-white">€ 142.50</div>
                    <p className="text-xs text-text-tertiary mt-1">Nessun debito scaduto</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Social Proof Metrics Bar */}
        <section className="py-12 border-y border-border/80 bg-surface/40 backdrop-blur-lg mb-24">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-5xl font-black text-text-primary tracking-tight mb-1">0 €</div>
              <div className="text-xs sm:text-sm font-semibold text-text-tertiary uppercase tracking-wider">
                Costo Fisso o Licenza
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-5xl font-black text-[#00F59B] tracking-tight mb-1">1-Click</div>
              <div className="text-xs sm:text-sm font-semibold text-text-tertiary uppercase tracking-wider">
                Sync Calendario FIPAV
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-5xl font-black text-text-primary tracking-tight mb-1">100%</div>
              <div className="text-xs sm:text-sm font-semibold text-text-tertiary uppercase tracking-wider">
                Trasparenza Cassa Multe
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-5xl font-black text-[#00F59B] tracking-tight mb-1">h24</div>
              <div className="text-xs sm:text-sm font-semibold text-text-tertiary uppercase tracking-wider">
                Cloud Sempre Disponibile
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid Section */}
        <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-text-primary">
              Progettato per chi vive il volley sul campo.
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto text-base sm:text-lg">
              Elimina i fogli Excel, le chat WhatsApp piene di messaggi persi e i conti a penna. VolleyStack accentra
              ogni dettaglio della vita di squadra.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              whileHover={{ y: -6, scale: 1.015 }}
              className="saas-card p-8 rounded-3xl group border border-border hover:border-[#00F59B]/50 transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-2xl bg-[#00F59B]/10 border border-[#00F59B]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Calendar className="h-6 w-6 text-[#00F59B]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-text-primary">Eventi, Partite e Presenze</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Pianifica allenamenti e gare. I giocatori confermano con un tocco e l'allenatore vede subito chi sarà in
                palestra.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              whileHover={{ y: -6, scale: 1.015 }}
              className="saas-card p-8 rounded-3xl group border border-border hover:border-[#00F59B]/50 transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-2xl bg-[#00F59B]/10 border border-[#00F59B]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Wallet className="h-6 w-6 text-[#00F59B]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-text-primary">Cassa Multe & Regolamento</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Ritardi, maglia dimenticata, cartellini o battuta fuori. Assegna le multe e traccia i pagamenti senza
                discussioni.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              whileHover={{ y: -6, scale: 1.015 }}
              className="saas-card p-8 rounded-3xl group border border-border hover:border-[#00F59B]/50 transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-2xl bg-[#00F59B]/10 border border-[#00F59B]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Activity className="h-6 w-6 text-[#00F59B]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-text-primary">Turno delle Paste</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Compleanni, esordi o errori clamorosi: il turno dolci viene assegnato e notificato in modo trasparente.
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              whileHover={{ y: -6, scale: 1.015 }}
              className="saas-card p-8 rounded-3xl group border border-border hover:border-[#00F59B]/50 transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-2xl bg-[#00F59B]/10 border border-[#00F59B]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Trophy className="h-6 w-6 text-[#00F59B]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-text-primary">Statistiche & Classifiche</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Classifica dei più multati, fedeltà presenze, andamento stagionale e telemetria completa per lo staff
                tecnico.
              </p>
            </motion.div>

            {/* Feature 5 */}
            <motion.div
              whileHover={{ y: -6, scale: 1.015 }}
              className="saas-card p-8 rounded-3xl group border border-border hover:border-[#00F59B]/50 transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-2xl bg-[#00F59B]/10 border border-[#00F59B]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-[#00F59B]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-text-primary">Ruoli & Invito con Codice</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Coach, Capitano, Tesoriere o Giocatore. Invita la squadra con un semplice codice di 6 caratteri.
              </p>
            </motion.div>

            {/* Feature 6 */}
            <motion.div
              whileHover={{ y: -6, scale: 1.015 }}
              className="saas-card p-8 rounded-3xl group border border-border hover:border-[#00F59B]/50 transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-2xl bg-[#00F59B]/10 border border-[#00F59B]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="h-6 w-6 text-[#00F59B]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-text-primary">Cloud Sicuro & Sempre Attivo</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Database PostgreSQL di ultima generazione su Neon, CDN globale e zero costi di server.
              </p>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-28 relative overflow-hidden bg-gradient-to-b from-surface via-[#0A111F] to-[#070B12] border-t border-border">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#00F59B]/15 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.035] mix-blend-overlay pointer-events-none" />
          <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
              Pronto a trasformare la tua squadra?
            </h2>
            <p className="text-text-secondary text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Unisciti a VolleyStack oggi. Registrazione gratuita, setup in 2 minuti e inizi subito a organizzare il
              prossimo allenamento.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center justify-center bg-gradient-to-r from-[#00F59B] via-[#00DF89] to-[#00C87E] text-[#070B12] px-8 py-4 rounded-xl text-lg font-black shadow-[0_0_35px_rgba(0,245,155,0.45)] hover:shadow-[0_0_45px_rgba(0,245,155,0.65)] hover:scale-105 active:scale-95 transition-all"
            >
              Inizia Ora <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>

      {/* Auth Drawer / Modal */}
      <AnimatePresence>
        {isAuth && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/75 backdrop-blur-md"
              onClick={closeAuth}
            />

            {/* Slide-over Auth Panel */}
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: '0%', opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full sm:max-w-[480px] h-full bg-bg-primary/95 backdrop-blur-2xl shadow-2xl border-l border-border/80 overflow-y-auto z-10 flex flex-col"
            >
              <button
                onClick={closeAuth}
                className="absolute top-6 right-6 z-20 p-2.5 rounded-xl bg-surface hover:bg-surface-hover border border-border text-text-primary transition-all hover:scale-105 active:scale-95 shadow-sm"
                title="Chiudi"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-full my-auto py-12 px-6 sm:px-10">
                {isLogin ? <Login /> : <Register />}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
