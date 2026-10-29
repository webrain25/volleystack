import { useEffect } from 'react';
import {
  Activity,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Moon,
  Sun,
  Trophy,
  Users,
  Wallet,
  X,
  Zap,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/Footer';
import Login from './Login';
import Register from './Register';
import VolleyLogo from '../components/VolleyLogo';
import { useThemeStore } from '../store/useThemeStore';

export default function Landing() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const isLogin = location.pathname === '/login';
  const isRegister = location.pathname === '/register';
  const isAuth = isLogin || isRegister;

  const closeAuth = () => {
    navigate('/');
  };

  return (
    <div className="relative w-full min-h-screen bg-[#F8FAFC] dark:bg-[#03060B] text-slate-900 dark:text-slate-100 overflow-x-hidden scroll-smooth selection:bg-[#38BDF8]/30 selection:text-white transition-colors duration-200">
      {/* Subtle Atmospheric Illumination - Apple Pro Monolith */}
      <div
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        {/* Soft Conic/Radial Glow from top center */}
        <div className="absolute -top-[120px] left-1/2 -translate-x-1/2 w-[90vw] max-w-[1100px] h-[550px] bg-[radial-gradient(ellipse_at_50%_0%,rgba(56,189,248,0.18)_0%,rgba(10,64,89,0.05)_45%,transparent_75%)] dark:bg-[radial-gradient(ellipse_at_50%_0%,rgba(42,126,162,0.22)_0%,rgba(10,64,89,0.08)_45%,transparent_75%)] pointer-events-none transition-colors duration-300" />

        {/* Real Volleyball Court Background with subtle atmospheric blend */}
        <img
          src="/backgrounds/court.jpg"
          alt="Campo di Pallavolo"
          className="w-full h-full object-cover object-center filter brightness-[0.9] dark:brightness-[0.35] contrast-[1.05] dark:contrast-[1.15] opacity-10 dark:opacity-20 transition-opacity duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAFC]/80 via-[#F8FAFC]/92 to-[#F8FAFC] dark:from-[#03060B]/70 dark:via-[#03060B]/85 dark:to-[#03060B] z-0 transition-colors duration-300" />
      </div>

      {/* Main Page Layout */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between w-full">
        {/* IN-PAGE FLUSH HEADER: NO SEPARATE NAVBAR, NO ANCHOR LINKS, 100% RESPONSIVE */}
        <header className="relative z-30 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-5 sm:pt-10 pb-4 sm:pb-8 flex items-center justify-between gap-2">
          <Link
            to="/"
            className="group flex items-center transition-transform hover:scale-[1.01] shrink-0"
          >
            <VolleyLogo size="md" />
          </Link>

          {/* Action CTAs */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-slate-200/70 hover:bg-slate-300/80 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 flex items-center justify-center text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-all active:scale-95 cursor-pointer shadow-sm"
            >
              {theme === 'dark' ? (
                <Sun className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              ) : (
                <Moon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              )}
            </button>

            <Link
              to="/login"
              className="text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white transition-all px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full hover:bg-slate-200/60 dark:hover:bg-white/5 border border-slate-300 dark:border-white/10"
            >
              Accedi
            </Link>

                        {/* Luxury CTA Button - High Contrast */}
            <Link
              to="/register"
              className="group relative hidden sm:inline-flex items-center justify-center px-5 sm:px-6 py-2 sm:py-2.5 rounded-full overflow-hidden border border-[#7DD3FC]/50 dark:border-[#38BDF8] bg-[#0A4059] dark:bg-gradient-to-r dark:from-[#38BDF8] dark:to-[#0EA5E9] text-white dark:text-[#030712] font-black text-xs sm:text-sm tracking-tight transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_4px_18px_rgba(10,64,89,0.25)] dark:shadow-[0_0_25px_rgba(56,189,248,0.5)] shrink-0
                before:absolute before:w-12 before:h-12 before:content-[''] before:right-0 before:top-0 before:z-0 before:bg-white/40 before:rounded-full before:blur-md before:transition-all before:duration-500 group-hover:before:right-8 group-hover:before:-bottom-3 group-hover:before:blur-lg
                after:absolute after:z-0 after:w-16 after:h-16 after:content-[''] after:bg-[#0284C7]/50 after:right-4 after:top-0 after:rounded-full after:blur-md after:transition-all after:duration-500 group-hover:after:-right-2 group-hover:after:top-1"
            >
              <span className="relative z-10">Inizia Gratis</span>
            </Link>
          </div>
        </header>

        {/* HERO SECTION - MONUMENTAL APPLE PRO */}
        <section className="relative pt-6 pb-12 sm:pt-12 sm:pb-18 md:pt-16 md:pb-22 px-4 sm:px-6 w-full overflow-hidden">
          <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
            {/* Monumental Headline */}
            <h1 className="font-['Outfit',sans-serif] text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-950 dark:text-white mb-4 sm:mb-6 max-w-4xl leading-[1.14] sm:leading-[1.04]">
              Tutto il tuo spogliatoio<br className="hidden sm:inline" />
              <span className="bg-gradient-to-b from-slate-950 via-slate-800 to-slate-500 dark:from-white dark:via-white/95 dark:to-white/40 bg-clip-text text-transparent block mt-1.5 sm:mt-0 text-2xl sm:text-5xl md:text-6xl lg:text-7xl">
                in un'unica app
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-6 sm:mb-10 max-w-2xl leading-relaxed px-1 sm:px-0 font-normal">
              Convocazioni, presenze, cassa multe e turno delle paste<br className="hidden sm:inline" />
              Semplice, trasparente e sincronizzato con il calendario della tua squadra
            </p>

            {/* CTAs - Apple Monolith Luxury Button vs Translucent Pill */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-xs sm:max-w-none mx-auto">
                            <Link
                to="/register"
                className="group relative w-full sm:w-auto inline-flex items-center justify-center px-8 sm:px-10 py-3.5 sm:py-4 rounded-full overflow-hidden border border-[#7DD3FC]/50 dark:border-[#7DD3FC] bg-[#0A4059] dark:bg-gradient-to-r dark:from-[#38BDF8] dark:via-[#0EA5E9] dark:to-[#0284C7] hover:bg-[#072d3f] dark:hover:from-[#7DD3FC] dark:hover:to-[#0EA5E9] text-white dark:text-[#030712] font-black text-sm sm:text-base tracking-tight shadow-[0_10px_30px_rgba(10,64,89,0.3)] dark:shadow-[0_0_35px_rgba(56,189,248,0.5)] hover:shadow-[0_12px_45px_rgba(56,189,248,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 text-center
                  before:absolute before:w-20 before:h-20 before:content-[''] before:right-0 before:top-0 before:z-0 before:bg-white/40 before:rounded-full before:blur-xl before:transition-all before:duration-500 group-hover:before:right-16 group-hover:before:-bottom-4 group-hover:before:blur-2xl
                  after:absolute after:z-0 after:w-24 after:h-24 after:content-[''] after:bg-[#0284C7]/40 after:right-8 after:top-1 after:rounded-full after:blur-xl after:transition-all after:duration-500 group-hover:after:-right-4 group-hover:after:top-2"
              >
                <span className="relative z-10 flex items-center justify-center">
                  Crea la tua Squadra <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-[#0A4059]/10 hover:bg-[#0A4059]/20 dark:bg-[#0A4059]/20 dark:hover:bg-[#0A4059]/35 border border-[#2A7EA2]/40 text-[#0A4059] dark:text-[#38BDF8] px-5 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base font-bold transition-all active:scale-95 shadow-sm text-center backdrop-blur-md"
              >
                Accedi allo Spogliatoio
              </Link>
            </div>
          </div>
        </section>

        {/* 3-PILLAR SHOWCASE FRAME */}
        <section className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 mb-16 sm:mb-24 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Pillar 1 */}
            <div className="p-6 rounded-2xl bg-white/90 dark:bg-[#091322]/70 border border-slate-200 dark:border-white/10 backdrop-blur-xl shadow-lg dark:shadow-xl flex flex-col gap-3 group hover:border-[#38BDF8]/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#2A7EA2]/15 dark:bg-[#2A7EA2]/20 border border-[#2A7EA2]/40 flex items-center justify-center text-[#0284C7] dark:text-[#38BDF8]">
                <Wallet className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Cassa & Satispay</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Multe assegnate con 1 tap dal capitano, visibili a tutti e saldate all'istante tramite QR code Satispay personale
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-2xl bg-white/90 dark:bg-[#091322]/70 border border-slate-200 dark:border-white/10 backdrop-blur-xl shadow-lg dark:shadow-xl flex flex-col gap-3 group hover:border-[#38BDF8]/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#2A7EA2]/15 dark:bg-[#2A7EA2]/20 border border-[#2A7EA2]/40 flex items-center justify-center text-[#0284C7] dark:text-[#38BDF8]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Presenze Istantanee</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Convocazioni partite e allenamenti confermate in 3 secondi dallo smartphone: chi c'è, chi salta e chi è in ritardo
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-2xl bg-white/90 dark:bg-[#091322]/70 border border-slate-200 dark:border-white/10 backdrop-blur-xl shadow-lg dark:shadow-xl flex flex-col gap-3 group hover:border-[#38BDF8]/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#2A7EA2]/15 dark:bg-[#2A7EA2]/20 border border-[#2A7EA2]/40 flex items-center justify-center text-[#0284C7] dark:text-[#38BDF8]">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Calendario Gare & Partite</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Gare, orari di convocazione, palazzetti e indirizzi sempre aggiornati per tutta la squadra
              </p>
            </div>
          </div>
        </section>

        {/* Social Proof Metrics Bar */}
        <section className="py-12 sm:py-14 border-y border-slate-200 dark:border-white/10 bg-slate-100/70 dark:bg-[#060D18]/70 backdrop-blur-xl mb-16 sm:mb-24 w-full transition-colors duration-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div>
              <div className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tight mb-1">0 €</div>
              <div className="text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Gratis per tutta la squadra
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl md:text-5xl font-black text-[#0284C7] dark:text-[#38BDF8] tracking-tight mb-1">1 Click</div>
              <div className="text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Importa gare e calendari
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tight mb-1">100%</div>
              <div className="text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Trasparenza sulla Cassa
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl md:text-5xl font-black text-[#0284C7] dark:text-[#38BDF8] tracking-tight mb-1">H24</div>
              <div className="text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Da smartphone, tablet e PC
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid Section */}
        <section className="py-10 sm:py-16 md:py-20 max-w-6xl mx-auto px-4 sm:px-6 mb-16 sm:mb-24 w-full">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight mb-3 sm:mb-4 text-slate-950 dark:text-white">
              Progettato per chi vive la pallavolo ogni settimana
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
              Basta con i fogli volanti, i messaggi persi nelle chat di gruppo e i conti a penna: con VolleyStack hai tutto lo spogliatoio sotto controllo in un unico posto
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white/90 dark:bg-[#081220]/60 border border-slate-200 dark:border-white/10 hover:border-[#38BDF8]/40 transition-all duration-300 shadow-sm dark:shadow-none">
              <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-[#2A7EA2]/15 dark:bg-[#2A7EA2]/20 border border-[#2A7EA2]/40 flex items-center justify-center mb-5 sm:mb-6 text-[#0284C7] dark:text-[#38BDF8]">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-slate-950 dark:text-white">Partite, Allenamenti e Presenze</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                Segna chi c'è e chi salta con un tocco: mister e capitano sanno sempre chi sarà in palestra
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white/90 dark:bg-[#081220]/60 border border-slate-200 dark:border-white/10 hover:border-[#38BDF8]/40 transition-all duration-300 shadow-sm dark:shadow-none">
              <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-[#2A7EA2]/15 dark:bg-[#2A7EA2]/20 border border-[#2A7EA2]/40 flex items-center justify-center mb-5 sm:mb-6 text-[#0284C7] dark:text-[#38BDF8]">
                <Wallet className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-slate-950 dark:text-white">Cassa Multe & Satispay</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                Ritardi, ginocchiere dimenticate o cartellini: ognuno vede le proprie multe e la cassa è sempre in ordine
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white/90 dark:bg-[#081220]/60 border border-slate-200 dark:border-white/10 hover:border-[#38BDF8]/40 transition-all duration-300 shadow-sm dark:shadow-none">
              <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-[#2A7EA2]/15 dark:bg-[#2A7EA2]/20 border border-[#2A7EA2]/40 flex items-center justify-center mb-5 sm:mb-6 text-[#0284C7] dark:text-[#38BDF8]">
                <Activity className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-slate-950 dark:text-white">Il Turno delle Paste</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                Compleanni, esordi in campo o una schiacciata finita dritta sull'asta: assegna il turno dolci e ricorda a tutti chi deve portare la colazione!
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white/90 dark:bg-[#081220]/60 border border-slate-200 dark:border-white/10 hover:border-[#38BDF8]/40 transition-all duration-300 shadow-sm dark:shadow-none">
              <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-[#2A7EA2]/15 dark:bg-[#2A7EA2]/20 border border-[#2A7EA2]/40 flex items-center justify-center mb-5 sm:mb-6 text-[#0284C7] dark:text-[#38BDF8]">
                <Trophy className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-slate-950 dark:text-white">Classifiche e Statistiche</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                Scopri chi è il più multato della stagione, chi non salta mai un allenamento e i numeri della tua squadra nel campionato.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white/90 dark:bg-[#081220]/60 border border-slate-200 dark:border-white/10 hover:border-[#38BDF8]/40 transition-all duration-300 shadow-sm dark:shadow-none">
              <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-[#2A7EA2]/15 dark:bg-[#2A7EA2]/20 border border-[#2A7EA2]/40 flex items-center justify-center mb-5 sm:mb-6 text-[#0284C7] dark:text-[#38BDF8]">
                <Users className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-slate-950 dark:text-white">Invito Rapido con Codice</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                Mister, capitano o giocatore. Condividi un semplice codice di 6 lettere nella chat di squadra per far entrare tutti all'istante.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white/90 dark:bg-[#081220]/60 border border-slate-200 dark:border-white/10 hover:border-[#38BDF8]/40 transition-all duration-300 shadow-sm dark:shadow-none">
              <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-[#2A7EA2]/15 dark:bg-[#2A7EA2]/20 border border-[#2A7EA2]/40 flex items-center justify-center mb-5 sm:mb-6 text-[#0284C7] dark:text-[#38BDF8]">
                <Zap className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-slate-950 dark:text-white">Gare e Campionati</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                Date, orari di fischio d'inizio e palazzetti sempre aggiornati senza dover copiare o riscrivere nulla a mano nelle chat
              </p>
            </div>
          </div>
        </section>

        {/* FINAL MONUMENTAL CTA SECTION */}
        <section className="py-20 sm:py-28 relative overflow-hidden bg-gradient-to-b from-transparent via-slate-100 to-slate-200/50 dark:via-[#060D18] dark:to-[#03060B] border-t border-slate-200 dark:border-white/10 w-full text-center transition-colors duration-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
            <h2 className="font-['Outfit',sans-serif] text-3xl sm:text-5xl md:text-6xl font-black text-slate-950 dark:text-white tracking-tight mb-4 sm:mb-6">
              Pronto a organizzare il tuo spogliatoio?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-2xl mx-auto px-2">
              Bastano due minuti per creare la squadra e riunire tutto il tuo spogliatoio: zero costi, zero complicazioni
            </p>
            <Link
              to="/register"
              className="inline-flex items-center justify-center bg-[#0A4059] hover:bg-[#072d3f] text-white dark:bg-white dark:text-[#04060A] dark:hover:bg-neutral-100 px-8 sm:px-10 py-4 sm:py-4.5 rounded-full text-base sm:text-lg font-black shadow-[0_12px_45px_rgba(10,64,89,0.25)] dark:shadow-[0_12px_45px_rgba(255,255,255,0.25)] hover:shadow-[0_16px_55px_rgba(10,64,89,0.35)] dark:hover:shadow-[0_16px_55px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 transition-all w-full max-w-xs sm:max-w-none sm:w-auto"
            >
              Crea la tua Squadra Gratis <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>

      {/* Centered Auth Modal */}
      <AnimatePresence>
        {isAuth && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            {/* Backdrop with Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black/70 dark:bg-black/85 backdrop-blur-md"
              onClick={closeAuth}
            />

            {/* Centered Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[440px] my-auto bg-white dark:bg-[#070D18]/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_35px_rgba(56,189,248,0.12)] p-4 sm:p-8 z-10 overflow-hidden text-slate-900 dark:text-white"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Subtle Ambient Radial Accents */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#2A7EA2]/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#38BDF8]/15 rounded-full blur-3xl pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={closeAuth}
                className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
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
