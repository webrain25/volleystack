import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  WalletCards, 
  Trophy, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  ChevronRight,
  HelpCircle,
  Sun,
  Moon
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/useThemeStore';
import VolleyLogo from '../components/VolleyLogo';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

interface Step {
  title: string;
  desc: string;
  tag?: string;
}

interface Guide {
  id: string;
  title: string;
  category: string;
  readTime: string;
  icon: any;
  summary: string;
  proTip: string;
  steps: Step[];
}

const GUIDES_DATA: Guide[] = [
  {
    id: 'setup',
    title: 'Avvio Rapido: Configura la tua Squadra in 2 Minuti',
    category: 'Primi Passi',
    readTime: '2 min',
    icon: Users,
    summary: 'La procedura più semplice e veloce per creare la tua squadra e riunire subito tutto il tuo spogliatoio su WhatsApp.',
    proTip: 'Invia il link di invito subito dopo l’allenamento o la partita: quando i compagni hanno il telefono in mano si iscrivono tutti in 5 minuti.',
    steps: [
      {
        title: '1. Crea la tua squadra',
        desc: 'Clicca su "Crea la tua Squadra" dalla Home. Inserisci il nome del tuo club o gruppo sportivo (es. Volley Sharks Serie D) e specifica la categoria.',
        tag: 'Setup immediato'
      },
      {
        title: '2. Condividi il link su WhatsApp',
        desc: 'Nella sezione "Squadra" trovi il link di invito unico. Copialo con un tocco e incollalo direttamente nel vostro gruppo WhatsApp di squadra.',
        tag: '1 Clic'
      },
      {
        title: '3. I compagni entrano senza scaricare nulla',
        desc: 'I tuoi atleti cliccano sul link dal proprio telefono, inseriscono nome e numero di maglia e sono già dentro. Non serve scaricare alcuna app pesante.',
        tag: 'Zero attrito'
      },
      {
        title: '4. Assegna i ruoli di spogliatoio',
        desc: 'Dalla lista giocatori puoi promuovere i compagni chiave: assegna il ruolo di Vice Allenatore, Capitano o Dirigente/Tesoriere per gestire multe e presenze.',
        tag: 'Controllo rosa'
      }
    ]
  },
  {
    id: 'presenze',
    title: 'Gestire Presenze e Convocazioni Senza Stress',
    category: 'Presenze & Convocazioni',
    readTime: '3 min',
    icon: Calendar,
    summary: 'Basta messaggi persi nella chat di gruppo: un tabellone presenze sempre chiaro per allenamenti e partite ufficiali.',
    proTip: 'Stabilite la regola di spogliatoio: conferma presenze entro 24 ore prima dell’allenamento per permettere al mister di preparare gli esercizi giusti.',
    steps: [
      {
        title: '1. Crea l’evento (Allenamento o Partita)',
        desc: 'Dalla sezione Eventi imposta data, orario di ritrovo e palazzetto. Puoi anche usare "Stagione Automatica" per generare tutti gli allenamenti dell’anno in blocco.',
        tag: 'Pianificazione rapida'
      },
      {
        title: '2. Votazione immediata in un tap',
        desc: 'Ogni giocatore apre la schermata e tocca semplicemente "Ci sono", "Assente" o "In dubbio". Nessun messaggio infinito su WhatsApp.',
        tag: 'Un solo tocco'
      },
      {
        title: '3. Allenamento: verifica il 6 vs 6',
        desc: 'Il mister vede a colpo d’occhio i tre contatori essenziali: Presenti, Assenti e In attesa, per sapere subito se si gioca 6 contro 6.',
        tag: 'Conta atleti'
      },
      {
        title: '4. Partita: distinta e convocati FIPAV',
        desc: 'Per le gare ufficiali il mister seleziona i 12-14 atleti a referto tra chi ha confermato la presenza, specificando orario di ritrovo e divisa.',
        tag: 'Lista gara'
      }
    ]
  },
  {
    id: 'multe-paste',
    title: 'Regolamento Multe, Cassa Comune e Turno Paste',
    category: 'Spogliatoio & Finanze',
    readTime: '3 min',
    icon: WalletCards,
    summary: 'Come far rispettare la disciplina con il sorriso e raccogliere la cassa per la cena di fine campionato o le divise nuove.',
    proTip: 'La cassa multe è la vera salvezza di fine stagione: con i fondi raccolti potete pagarvi la pizza di squadra senza chiedere un euro in più a nessuno!',
    steps: [
      {
        title: '1. Concorda il tariffario multe di squadra',
        desc: 'Stabilite insieme le regole sacre: ritardo all’allenamento (es. 2 €), ritardo alla convocazione gara (5 €), cellulare che squilla nel discorso tecnico (3 €), maglia dimenticata (2 €).',
        tag: 'Regole chiare'
      },
      {
        title: '2. Assegna la multa in 3 secondi',
        desc: 'Dalla sezione Squadra o Finanze seleziona il colpevole, clicca "Assegna Multa" e scegli la causale. Il saldo viene calcolato in automatico.',
        tag: 'Trasparenza totale'
      },
      {
        title: '3. Registra i pagamenti e monitora la cassa',
        desc: 'Quando il compagno salda al tesoriere (in contanti o bonifico), basta un clic su "Segna come pagata" per accreditare la cassa comune.',
        tag: 'Cassa comune'
      },
      {
        title: '4. Il sacro turno delle paste',
        desc: 'Compleanno? Esordio in prima squadra? Primo punto o cartellino rosso? Il sistema genera il reminder "Porta le paste": il festeggiato le porta e segna la consegna!',
        tag: 'Tradizione volley'
      }
    ]
  },
  {
    id: 'fipav-trasferte',
    title: 'Campionato FIPAV, Trasferte e Navigatore GPS',
    category: 'Gare & Trasferte',
    readTime: '2 min',
    icon: Trophy,
    summary: 'Mai più ritardi alle trasferte: indirizzi dei palazzetti, mappe istantanee e ritrovi organizzati per tutta la squadra.',
    proTip: 'Organizzate le macchine direttamente guardando chi ha confermato la presenza: meno auto in viaggio, meno carburante e più concentrazione pre-gara.',
    steps: [
      {
        title: '1. Inserisci il calendario del campionato',
        desc: 'Aggiungi le partite di andata e ritorno con l’orario ufficiale di fischio d’inizio e l’orario di ritrovo al palazzetto per il riscaldamento.',
        tag: 'Gare ufficiali'
      },
      {
        title: '2. Mappa e navigatore GPS integrato',
        desc: 'In ogni scheda gara l’indirizzo è cliccabile: aprendolo si attiva direttamente Google Maps o Apple Maps per guidare tutta la squadra al palazzetto.',
        tag: 'Google Maps'
      },
      {
        title: '3. Dettagli trasferta e colore maglia',
        desc: 'Indica se la gara è in casa o fuori, l’orario di partenza delle macchine e il colore della divisa da gara (es. maglia scura o maglia chiara).',
        tag: 'Coordinamento'
      }
    ]
  }
];

export default function Guides() {
  const token = useAuthStore((state) => state.token);
  const { theme, toggleTheme } = useThemeStore();
  const [activeGuideId, setActiveGuideId] = useState<string>('setup');

  const activeGuide = GUIDES_DATA.find((g) => g.id === activeGuideId) || GUIDES_DATA[0];

  const content = (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#38BDF8]/10 text-[#38BDF8] border border-[#2A7EA2]/30 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
          <BookOpen className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span>Guide e Tutorial Spogliatoio</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-text-primary tracking-tight">
          Come usare VolleyStack come un professionista
        </h1>
        <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Guide pratiche passo dopo passo scritte per atleti, capitani e coach. Niente gergo complicato: solo ciò che serve in palestra.
        </p>
      </div>

      {/* Guide Navigation Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {GUIDES_DATA.map((guide) => {
          const isActive = guide.id === activeGuideId;
          const Icon = guide.icon;
          return (
            <button
              key={guide.id}
              onClick={() => setActiveGuideId(guide.id)}
              className={`p-5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between cursor-pointer active:scale-98 ${
                isActive
                  ? 'bg-[#0F1726] border-[#2A7EA2] shadow-[0_0_30px_rgba(56,189,248,0.2)] scale-[1.02]'
                  : 'bg-[#0A101D]/70 hover:bg-[#0F1726]/80 border-white/10 hover:border-white/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    isActive ? 'bg-[#38BDF8] text-[#070B12]' : 'bg-white/5 text-[#38BDF8] border border-white/10'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-text-tertiary flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {guide.readTime}
                  </span>
                </div>
                <h3 className="font-bold text-sm sm:text-base text-text-primary line-clamp-2 mb-1">
                  {guide.title}
                </h3>
                <span className="text-[11px] font-semibold text-[#38BDF8]">
                  {guide.category}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-bold text-text-secondary">
                <span>{isActive ? 'Aperta' : 'Leggi guida'}</span>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'translate-x-1 text-[#38BDF8]' : ''}`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Guide Viewer Card */}
      <motion.div
        key={activeGuide.id}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-3xl bg-[#0F1726] border border-white/10 shadow-2xl overflow-hidden p-6 sm:p-10 relative"
      >
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#38BDF8]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-8">
          {/* Guide Top Details */}
          <div className="border-b border-white/10 pb-6 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#38BDF8]/15 text-[#38BDF8] border border-[#2A7EA2]/30">
                {activeGuide.category}
              </span>
              <span className="text-xs font-mono font-bold text-text-tertiary flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Tempo di lettura: {activeGuide.readTime}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
              {activeGuide.title}
            </h2>
            <p className="text-text-secondary text-sm sm:text-base max-w-3xl leading-relaxed">
              {activeGuide.summary}
            </p>
          </div>

          {/* Step-by-Step Flow */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-text-tertiary uppercase tracking-wider">
              Procedura Passo dopo Passo:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeGuide.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl p-5 bg-[#070B12]/80 border border-white/10 hover:border-[#2A7EA2]/30 transition-all space-y-2 flex flex-col justify-between shadow-inner"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-base text-text-primary flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#38BDF8] shrink-0" />
                        <span>{step.title}</span>
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                  {step.tag && (
                    <div className="pt-2">
                      <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-mono font-black uppercase tracking-wider bg-white/5 text-[#38BDF8] border border-[#2A7EA2]/20">
                        {step.tag}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pro Tip Box */}
          <div className="rounded-2xl p-5 bg-gradient-to-r from-[#0A4059]/30 via-[#0A4059]/10 to-transparent border border-[#2A7EA2]/30 flex items-start gap-4 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-[#38BDF8] text-[#070B12] flex items-center justify-center shrink-0 font-black shadow-[0_0_15px_rgba(56,189,248,0.4)]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-black text-[#38BDF8] uppercase tracking-wider">
                Consiglio dello Spogliatoio
              </h4>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                {activeGuide.proTip}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Switch to FAQ or Direct Support */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/support"
          className="p-6 rounded-3xl bg-[#0A101D]/90 border border-white/10 hover:border-[#2A7EA2]/40 transition-all flex items-center justify-between group shadow-lg"
        >
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#38BDF8] uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Domande Frequenti</span>
            </div>
            <h4 className="font-bold text-base text-text-primary">Hai un dubbio specifico?</h4>
            <p className="text-xs text-text-secondary">Consulta le FAQ interattive sul funzionamento del gestionale.</p>
          </div>
          <ArrowRight className="w-5 h-5 text-text-tertiary group-hover:translate-x-1 group-hover:text-[#38BDF8] transition-all shrink-0 ml-4" />
        </Link>

        <a
          href="mailto:support@volleystack.com"
          className="p-6 rounded-3xl bg-[#0A101D]/90 border border-white/10 hover:border-[#2A7EA2]/40 transition-all flex items-center justify-between group shadow-lg"
        >
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#38BDF8] uppercase tracking-wider">
              <Users className="w-3.5 h-3.5" />
              <span>Supporto Dedicato</span>
            </div>
            <h4 className="font-bold text-base text-text-primary">Serve aiuto per la tua squadra?</h4>
            <p className="text-xs text-text-secondary">Scrivici a support@volleystack.com: rispondiamo in giornata.</p>
          </div>
          <ArrowRight className="w-5 h-5 text-text-tertiary group-hover:translate-x-1 group-hover:text-[#38BDF8] transition-all shrink-0 ml-4" />
        </a>
      </div>
    </div>
  );

  // If authenticated user, render directly inside logged-in dashboard layout
  if (token) {
    return content;
  }

  // If unauthenticated public visitor, wrap with clean top navbar and court background
  return (
    <div className="min-h-screen bg-[#070B12] text-text-primary relative selection:bg-[#38BDF8]/30 selection:text-white flex flex-col justify-between">
      {/* Background with court atmosphere */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 opacity-25">
          <img
            src="/backgrounds/court.jpg"
            alt="Court Background"
            className="w-full h-full object-cover object-center filter blur-[1px]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#070B12]/80 via-[#070B12]/95 to-[#070B12] z-0" />
      </div>

      {/* Public Top Navbar */}
      <nav className="relative z-20 w-full bg-[#070B12] border-b border-white/10 sticky top-0 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center transition-transform hover:opacity-95">
            <VolleyLogo size="sm" />
          </Link>
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="h-9 w-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-text-secondary hover:text-text-primary transition-all active:scale-95"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Link
              to="/login"
              className="text-sm font-bold text-text-secondary hover:text-text-primary transition-all px-4 py-2 rounded-xl hover:bg-white/5"
            >
              Accedi
            </Link>
            <Link
              to="/register"
              className="bg-white hover:bg-slate-100 text-[#04060A] px-4 py-2 rounded-xl text-sm font-extrabold shadow-[0_4px_20px_rgba(255,255,255,0.22)] transition-all"
            >
              Inizia Ora
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Page Body */}
      <main className="relative z-10 flex-grow px-4 sm:px-6 py-12 md:py-16">
        {content}
      </main>

      {/* Public Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
