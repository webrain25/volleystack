import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Trophy,
  Users,
  Wallet,
  Calendar,
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
    <div className="relative w-full min-h-screen bg-[#03060B] text-slate-100 overflow-x-hidden scroll-smooth selection:bg-[#38BDF8]/30 selection:text-white">
      {/* Subtle Zenith Atmospheric Illumination - Apple Pro Monolith */}
      <div
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        {/* Soft Conic/Radial Glow from top center */}
        <div className="absolute -top-[120px] left-1/2 -translate-x-1/2 w-[90vw] max-w-[1100px] h-[550px] bg-[radial-gradient(ellipse_at_50%_0%,rgba(42,126,162,0.22)_0%,rgba(10,64,89,0.08)_45%,transparent_75%)] pointer-events-none" />

        {/* Real Volleyball Court Background with subtle atmospheric blend */}
        <img
          src="/backgrounds/court.jpg"
          alt="Campo di Pallavolo"
          className="w-full h-full object-cover object-center filter brightness-[0.35] contrast-[1.15] opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#03060B]/70 via-[#03060B]/85 to-[#03060B] z-0" />
      </div>

      {/* Main Page Layout */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between w-full">
        {/* IN-PAGE FLUSH HEADER: NO SEPARATE NAVBAR, 100% RESPONSIVE */}
        <header className="relative z-30 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-5 sm:pt-10 pb-4 sm:pb-8 flex items-center justify-between gap-2">
          <Link
            to="/"
            className="group flex items-center transition-transform hover:scale-[1.01] shrink-0"
          >
            <VolleyLogo size="md" />
          </Link>

          {/* Clean Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-400">
            <a href="#funzionalita" className="hover:text-white transition-colors">
              Funzionalità
            </a>
            <a href="#campionati" className="hover:text-white transition-colors">
              Campionati FIPAV
            </a>
            <a href="#cassa" className="hover:text-white transition-colors">
              Cassa & Multe
            </a>
            <a href="#vantaggi" className="hover:text-white transition-colors">
              Perché VolleyStack
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all active:scale-95 cursor-pointer shadow-sm"
            >
              {theme === 'dark' ? (
                <Sun className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              ) : (
                <Moon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              )}
            </button>

            <Link
              to="/login"
              className="text-xs sm:text-sm font-bold text-slate-200 hover:text-white transition-all px-3 py-1.5 sm:px-4 sm:py-2 rounded-full hover:bg-white/5 border border-white/10"
            >
              Accedi
            </Link>

            {/* Apple Monolith Stark White Button (Desktop & Tablet) */}
            <Link
              to="/register"
              className="hidden sm:inline-flex items-center justify-center bg-white text-[#04060A] hover:bg-neutral-100 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-black tracking-tight shadow-[0_4px_20px_rgba(255,255,255,0.22)] hover:shadow-[0_6px_25px_rgba(255,255,255,0.35)] active:scale-[0.98] transition-all shrink-0"
            >
              <span>Inizia Gratis</span>
            </Link>
          </div>
        </header>

        {/* HERO SECTION - MONUMENTAL APPLE PRO */}
        <section className="relative pt-6 pb-12 sm:pt-12 sm:pb-18 md:pt-16 md:pb-22 px-4 sm:px-6 w-full overflow-hidden">
          <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
            {/* Sync Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[11px] sm:text-xs font-semibold text-slate-300 mb-5 sm:mb-6 backdrop-blur-md max-w-full">
              <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse shrink-0" />
              <span className="text-[#38BDF8] font-bold">FIPAV Lazio</span>
              <span className="text-slate-400">•</span>
              <span className="truncate">Serie B, C e D Sincronizzate</span>
            </div>

            {/* Monumental Headline */}
            <h1 className="font-['Outfit',sans-serif] text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white mb-4 sm:mb-6 max-w-4xl leading-[1.14] sm:leading-[1.04]">
              Lo Spogliatoio.<br className="hidden sm:inline" />
              <span className="bg-gradient-to-b from-white via-white/95 to-white/40 bg-clip-text text-transparent block mt-1.5 sm:mt-0 text-2xl sm:text-5xl md:text-6xl lg:text-7xl">
                Diretto, Preciso,<br className="sm:hidden" /> Senza Attrito.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-lg md:text-xl text-slate-300 mb-6 sm:mb-10 max-w-2xl leading-relaxed px-1 sm:px-0 font-normal">
              La piattaforma creata su misura per allenatori, capitani e giocatori di pallavolo. Presenze in 3 secondi, multe con QR Satispay e cassa squadra sempre trasparente.
            </p>

            {/* CTAs - Apple Monolith Stark White vs Obsidian Translucent */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-xs sm:max-w-none mx-auto">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-white text-[#04060A] hover:bg-neutral-100 font-black px-6 sm:px-9 py-3 sm:py-4 rounded-full text-sm sm:text-base shadow-[0_10px_35px_rgba(255,255,255,0.25)] hover:shadow-[0_12px_45px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 transition-all text-center"
              >
                Crea la tua Squadra <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-[#0A4059]/20 hover:bg-[#0A4059]/35 border border-[#2A7EA2]/40 text-[#38BDF8] px-5 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base font-bold transition-all active:scale-95 shadow-sm text-center backdrop-blur-md"
              >
                Accedi allo Spogliatoio
              </Link>
            </div>
          </div>
        </section>

        {/* 3-PILLAR SHOWCASE FRAME */}
        <section id="funzionalita" className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 mb-16 sm:mb-24 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Pillar 1 */}
            <div className="p-6 rounded-2xl bg-[#091322]/70 border border-white/10 backdrop-blur-xl shadow-xl flex flex-col gap-3 group hover:border-[#38BDF8]/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#2A7EA2]/20 border border-[#2A7EA2]/40 flex items-center justify-center text-[#38BDF8]">
                <Wallet className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">Cassa & Satispay</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Multe assegnate con 1 tap dal capitano, visibili a tutti e saldate all'istante tramite QR code Satispay personale.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-2xl bg-[#091322]/70 border border-white/10 backdrop-blur-xl shadow-xl flex flex-col gap-3 group hover:border-[#38BDF8]/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#2A7EA2]/20 border border-[#2A7EA2]/40 flex items-center justify-center text-[#38BDF8]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">Presenze Istantanee</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Convocazioni partite e allenamenti confermate in 3 secondi dallo smartphone. Chi c'è, chi salta e chi è in ritardo.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-2xl bg-[#091322]/70 border border-white/10 backdrop-blur-xl shadow-xl flex flex-col gap-3 group hover:border-[#38BDF8]/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#2A7EA2]/20 border border-[#2A7EA2]/40 flex items-center justify-center text-[#38BDF8]">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">Calendario FIPAV Lazio</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Gare, orari e palazzetti sincronizzati direttamente con i calendari federali regionali (Serie B, C, D e giovanili).
              </p>
            </div>
          </div>
        </section>

        {/* Live Interactive Dashboard Preview Mockup */}
        <section id="campionati" className="relative z-20 max-w-5xl mx-auto px-3 sm:px-6 mb-16 sm:mb-24 md:mb-32 w-full">
          <div className="relative rounded-2xl sm:rounded-3xl p-1 bg-gradient-to-b from-white/15 via-white/5 to-transparent shadow-[0_25px_80px_rgba(0,0,0,0.8)] w-full overflow-hidden">
            {/* Floating Status Badges - large screens */}
            <div className="hidden lg:flex absolute -top-5 -left-4 z-30 items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#091322]/95 border border-[#38BDF8]/40 shadow-[0_10px_30px_rgba(56,189,248,0.2)] backdrop-blur-md">
              <Zap className="h-4 w-4 text-[#38BDF8]" />
              <span className="text-xs font-black text-white">Calendario FIPAV Sincronizzato</span>
            </div>

            <div className="hidden lg:flex absolute -bottom-5 -right-4 z-30 items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#091322]/95 border border-[#38BDF8]/40 shadow-[0_10px_30px_rgba(56,189,248,0.2)] backdrop-blur-md">
              <CheckCircle2 className="h-4 w-4 text-[#38BDF8]" />
              <span className="text-xs font-black text-white">14 Convocati • Tutti Presenti</span>
            </div>

            {/* Inner Glass Workspace Window */}
            <div className="rounded-[16px] sm:rounded-[22px] bg-[#070E1A]/95 border border-white/10 backdrop-blur-2xl overflow-hidden p-4 sm:p-6 md:p-8 text-left">
              {/* Window Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 pb-3 sm:pb-4 mb-4 sm:mb-6 gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-slate-400 truncate">
                    Volley Roma Nord (Serie C) — Prossima Partita
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0A4059]/40 border border-[#2A7EA2]/40 text-[#38BDF8] text-[11px] font-bold self-start sm:self-auto">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
                  SPOGLIATOIO ATTIVO
                </div>
              </div>

              {/* Dynamic Mockup Body */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-6">
                {/* Main Match Card */}
                <div className="md:col-span-2 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 p-4 sm:p-6 relative overflow-hidden">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black bg-[#2A7EA2]/30 text-[#38BDF8] border border-[#2A7EA2]/50">
                      PARTITA UFFICIALE FIPAV
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#38BDF8]" /> Tra 3 giorni
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-2xl md:text-3xl font-black text-white tracking-tight mb-1.5 sm:mb-2">
                    Volley Roma Nord vs Virtus Sharks
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-1.5 mb-4 sm:mb-6">
                    <MapPin className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                    <span className="truncate">Sabato 31 Ottobre • 18:30 • Palazzetto dello Sport</span>
                  </p>

                  <div className="grid grid-cols-3 gap-1 sm:gap-3 pt-2 border-t border-white/10 min-w-0">
                    <div className="px-1 sm:px-4 py-2 rounded-xl bg-[#2A7EA2]/25 border border-[#38BDF8]/40 text-[#38BDF8] text-[10px] sm:text-xs font-black flex items-center justify-center gap-1 text-center truncate min-w-0">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 hidden sm:inline" /> CI SONO (14)
                    </div>
                    <div className="px-1 sm:px-4 py-2 rounded-xl bg-white/[0.02] border border-white/5 text-slate-400 text-[10px] sm:text-xs font-bold text-center truncate min-w-0">
                      ASSENTE (0)
                    </div>
                    <div className="px-1 sm:px-4 py-2 rounded-xl bg-white/[0.02] border border-white/5 text-slate-400 text-[10px] sm:text-xs font-bold text-center truncate min-w-0">
                      IN DUBBIO (0)
                    </div>
                  </div>
                </div>

                {/* Side Stats Columns */}
                <div className="grid grid-cols-2 md:grid-cols-1 gap-2 sm:gap-4 min-w-0">
                  {/* Presenze Box */}
                  <div className="rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 p-3 sm:p-5 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 truncate">
                        Presenze
                      </span>
                      <TrendingUp className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                    </div>
                    <div className="text-xl sm:text-3xl font-black text-white mb-1.5">14 / 14</div>
                    <div className="w-full h-1.5 sm:h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#2A7EA2] to-[#38BDF8] rounded-full w-full" />
                    </div>
                  </div>

                  {/* Cassa Multe Box */}
                  <div className="rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 p-3 sm:p-5 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 truncate">
                        Cassa Multe
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-bold text-[#38BDF8] bg-[#2A7EA2]/25 px-1.5 py-0.5 rounded-full border border-[#2A7EA2]/40">
                        REGOLARE
                      </span>
                    </div>
                    <div className="text-base sm:text-2xl font-black text-white font-mono">€ 1.485,00</div>
                    <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 truncate">Fondo cassa squadra</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Metrics Bar */}
        <section id="vantaggi" className="py-12 sm:py-14 border-y border-white/10 bg-[#060D18]/70 backdrop-blur-xl mb-16 sm:mb-24 w-full">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div>
              <div className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-1">0 €</div>
              <div className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Gratis per tutta la squadra
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl md:text-5xl font-black text-[#38BDF8] tracking-tight mb-1">1 Click</div>
              <div className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Importa gare FIPAV Lazio
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-1">100%</div>
              <div className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Trasparenza sulla Cassa
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl md:text-5xl font-black text-[#38BDF8] tracking-tight mb-1">H24</div>
              <div className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Da smartphone, tablet e PC
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid Section */}
        <section className="py-10 sm:py-16 md:py-20 max-w-6xl mx-auto px-4 sm:px-6 mb-16 sm:mb-24 w-full">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight mb-3 sm:mb-4 text-white">
              Progettato per chi vive la pallavolo ogni settimana.
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
              Basta con i fogli volanti, i messaggi persi nelle chat di gruppo e i conti a penna. Con VolleyStack hai tutto lo spogliatoio sotto controllo in un unico posto.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#081220]/60 border border-white/10 hover:border-[#38BDF8]/40 transition-all duration-300">
              <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-[#2A7EA2]/20 border border-[#2A7EA2]/40 flex items-center justify-center mb-5 sm:mb-6 text-[#38BDF8]">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-white">Partite, Allenamenti e Presenze</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Segna chi c'è e chi salta con un tocco. Il mister e il capitano sanno sempre con precisione chi sarà in palestra.
              </p>
            </div>

            {/* Feature 2 */}
            <div
              id="cassa"
              className="p-6 sm:p-8 rounded-2xl bg-[#081220]/60 border border-white/10 hover:border-[#38BDF8]/40 transition-all duration-300"
            >
              <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-[#2A7EA2]/20 border border-[#2A7EA2]/40 flex items-center justify-center mb-5 sm:mb-6 text-[#38BDF8]">
                <Wallet className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-white">Cassa Multe & Satispay</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Ritardi, ginocchiere dimenticate o cartellini. Ognuno vede le proprie multe e il tesoriere tiene i conti in ordine senza discussioni.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#081220]/60 border border-white/10 hover:border-[#38BDF8]/40 transition-all duration-300">
              <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-[#2A7EA2]/20 border border-[#2A7EA2]/40 flex items-center justify-center mb-5 sm:mb-6 text-[#38BDF8]">
                <Activity className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-white">Il Turno delle Paste</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Compleanni, esordi in campo o una schiacciata finita dritta sull'asta: assegna il turno dolci e ricorda a tutti chi deve portare la colazione!
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#081220]/60 border border-white/10 hover:border-[#38BDF8]/40 transition-all duration-300">
              <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-[#2A7EA2]/20 border border-[#2A7EA2]/40 flex items-center justify-center mb-5 sm:mb-6 text-[#38BDF8]">
                <Trophy className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-white">Classifiche e Statistiche</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Scopri chi è il più multato della stagione, chi non salta mai un allenamento e i numeri della tua squadra nel campionato.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#081220]/60 border border-white/10 hover:border-[#38BDF8]/40 transition-all duration-300">
              <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-[#2A7EA2]/20 border border-[#2A7EA2]/40 flex items-center justify-center mb-5 sm:mb-6 text-[#38BDF8]">
                <Users className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-white">Invito Rapido con Codice</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Mister, capitano o giocatore. Condividi un semplice codice di 6 lettere nella chat di squadra per far entrare tutti all'istante.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#081220]/60 border border-white/10 hover:border-[#38BDF8]/40 transition-all duration-300">
              <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-[#2A7EA2]/20 border border-[#2A7EA2]/40 flex items-center justify-center mb-5 sm:mb-6 text-[#38BDF8]">
                <Zap className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-white">Gare e Campionati FIPAV</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Sincronizzato con Serie B, Serie C e tutti i campionati FIPAV Lazio. Date, orari di fischio d'inizio e palazzetti sempre aggiornati senza copiare nulla a mano.
              </p>
            </div>
          </div>
        </section>

        {/* FINAL MONUMENTAL CTA SECTION */}
        <section className="py-20 sm:py-28 relative overflow-hidden bg-gradient-to-b from-transparent via-[#060D18] to-[#03060B] border-t border-white/10 w-full text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
            <h2 className="font-['Outfit',sans-serif] text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-4 sm:mb-6">
              Pronto a organizzare il tuo spogliatoio?
            </h2>
            <p className="text-slate-400 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-2xl mx-auto px-2">
              Bastano due minuti per creare la squadra e riunire tutto il tuo spogliatoio. Zero costi, zero complicazioni.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center justify-center bg-white text-[#04060A] hover:bg-neutral-100 px-8 sm:px-10 py-4 sm:py-4.5 rounded-full text-base sm:text-lg font-black shadow-[0_12px_45px_rgba(255,255,255,0.25)] hover:shadow-[0_16px_55px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 transition-all w-full max-w-xs sm:max-w-none sm:w-auto"
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
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
              onClick={closeAuth}
            />

            {/* Centered Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[440px] my-auto bg-[#070D18]/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_35px_rgba(56,189,248,0.12)] p-4 sm:p-8 z-10 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Subtle Ambient Radial Accents */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#2A7EA2]/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#38BDF8]/15 rounded-full blur-3xl pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={closeAuth}
                className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
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
