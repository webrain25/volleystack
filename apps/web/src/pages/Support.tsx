import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  Search,
  ChevronDown,
  Mail,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Moon,
  Sun
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/useThemeStore';
import VolleyLogo from '../components/VolleyLogo';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  highlight?: string;
}

const FAQ_DATA: FAQItem[] = [
  // Primi Passi & Rosa
  {
    id: 'setup-squadra',
    category: 'Primi Passi',
    question: 'Come creo la mia squadra su VolleyStack?',
    answer: 'Bastano letteralmente due minuti. Clicca su "Crea la tua Squadra", inserisci il nome della tua società o gruppo (es. Volley Roma) e sei dentro. Dalla sezione Squadra otterrai subito il link d’invito da incollare direttamente nel vostro gruppo WhatsApp di squadra per far entrare tutti i compagni in un tap.',
    highlight: 'Setup in 2 minuti e link WhatsApp immediato.'
  },
  {
    id: 'app-install',
    category: 'Primi Passi',
    question: 'I giocatori devono scaricare un’app dagli store?',
    answer: 'No, VolleyStack è una Progressive Web App moderna. Funziona istantaneamente dal browser di qualsiasi smartphone (iOS o Android), tablet o computer. Ogni atleta può aggiungere l’icona alla schermata Home del telefono con un clic ("Aggiungi a Home") per aprirla a tutto schermo come una vera app nativa, senza occupare memoria.',
    highlight: 'Nessun download pesante: funziona su qualsiasi smartphone.'
  },
  {
    id: 'ruoli-squadra',
    category: 'Primi Passi',
    question: 'Chi può modificare le impostazioni e gestire la squadra?',
    answer: 'Chi crea la squadra riceve automaticamente il ruolo di Coach / Amministratore. Dalla scheda "Squadra" puoi assegnare ruoli specifici ai compagni: Vice Allenatore, Capitano, Dirigente o Tesoriere. In questo modo chi gestisce le multe o organizza le trasferte ha i permessi giusti senza complicazioni.',
    highlight: 'Permessi flessibili per Coach, Capitano e Tesoriere.'
  },

  // Presenze & Convocazioni
  {
    id: 'segna-presenza',
    category: 'Presenze & Convocazioni',
    question: 'Come confermo la mia presenza all’allenamento o alla partita?',
    answer: 'Dalla Home della Dashboard o dalla scheda "Eventi", visualizzi subito il prossimo impegno in programma. Ti basta un solo tocco sul pulsante verde "Ci sono" (oppure "Assente" o "In dubbio" se hai un imprevisto). Il coach e i compagni vedono il contatore aggiornato in tempo reale.',
    highlight: 'Un solo tap: Ci sono, Assente o In dubbio.'
  },
  {
    id: 'differenza-allenamento-partita',
    category: 'Presenze & Convocazioni',
    question: 'Qual è la differenza tra presenze all’allenamento e convocati per la gara?',
    answer: 'Per l’allenamento conta sapere chi è disponibile per raggiungere il numero ideale e preparare gli schemi (es. 6 contro 6). Per le gare ufficiali FIPAV, il coach seleziona la lista dei 12-14 atleti a referto: nella scheda dell’evento il mister ha il quadro completo delle conferme per compilare la distinta di gara.',
    highlight: 'Nessun quorum artificiale: numeri chiari e lista gara trasparente.'
  },
  {
    id: 'orario-limite-rsvp',
    category: 'Presenze & Convocazioni',
    question: 'Fino a quando posso modificare la mia disponibilità?',
    answer: 'Puoi aggiornare la risposta in qualsiasi momento prima dell’inizio dell’evento. La buona regola dello spogliatoio è confermare almeno 24 ore prima, così il mister può pianificare gli esercizi della seduta o chiamare un sostituto in tempo.',
    highlight: 'Modifiche libere in tempo reale fino all’inizio dell’evento.'
  },

  // Il Turno delle Paste
  {
    id: 'regole-paste',
    category: 'Turno Paste',
    question: 'Quando scatta il sacro turno delle paste?',
    answer: 'Il turno delle paste è una tradizione fondamentale della pallavolo! Scatta automaticamente per: compleanno di un compagno, primo punto in prima squadra, prima battuta vincente (ace), scarpe o maglia da gioco dimenticate a casa, o per qualsiasi evento epico deciso dallo spogliatoio.',
    highlight: 'Tradizione sacra del volley: compleanni, esordi ed epiche dimenticanze.'
  },
  {
    id: 'chiudi-debito-paste',
    category: 'Turno Paste',
    question: 'Come segno che ho portato le paste in palestra?',
    answer: 'Se tocca a te, la Dashboard mostrerà un avviso evidente con l’icona del cornetto e la motivazione. Quando hai portato il vassoio di paste o la crostata a fine allenamento, basta cliccare su "Dettagli" e confermare la consegna. Il debito verrà archiviato con tutti gli onori!',
    highlight: 'Avviso in Home e conferma consegna con un clic.'
  },

  // Cassa Multe & Tesoreria
  {
    id: 'assegna-multa',
    category: 'Cassa & Multe',
    question: 'Chi può assegnare una multa e come funziona la cassa?',
    answer: 'Il Coach, il Capitano e il Tesoriere possono registrare una multa in pochi secondi dalla scheda "Squadra" o "Finanze & Cassa". Basta selezionare il giocatore, il motivo (es. ritardo allenamento, cellulare che suona durante la riunione, cartellino giallo) e l’importo stabilito dal vostro regolamento interno.',
    highlight: 'Multe registrate in 3 secondi con importi personalizzabili.'
  },
  {
    id: 'trasparenza-cassa',
    category: 'Cassa & Multe',
    question: 'Tutta la squadra può vedere il saldo della cassa comune?',
    answer: 'Sì, la massima trasparenza è uno dei principi chiave di VolleyStack. Ogni compagno può visualizzare il totale raccolto nella cassa comune (fondamentale per la cena di fine stagione, l’acquisto di palloni nuovi o la quota del torneo) e verificare quali multe sono state saldate.',
    highlight: 'Totale cassa e storico versamenti visibili a tutti.'
  },
  {
    id: 'salda-multa',
    category: 'Cassa & Multe',
    question: 'Come viene registrato il pagamento di una multa?',
    answer: 'Quando un giocatore paga la quota o la multa al tesoriere (in contanti o bonifico), il tesoriere clicca su "Segna come pagata". Il saldo in sospeso si azzera e i fondi confluiscono subito nel totale della cassa comune.',
    highlight: 'Gestione immediata per contanti, bonifico o app di pagamento.'
  },

  // Calendario, Trasferte & FIPAV
  {
    id: 'mappa-palazzetto',
    category: 'Gare FIPAV',
    question: 'Come trovo l’indirizzo del palazzetto per le trasferte?',
    answer: 'Nella card di ogni partita trovi l’indirizzo esatto del palazzetto avversario. Cliccando sull’indirizzo o sull’icona della mappa si aprirà direttamente Google Maps o Apple Maps con il navigatore pronto per guidarti a destinazione senza perdere tempo.',
    highlight: 'Navigatore GPS con un tap direttamente dalla scheda partita.'
  },
  {
    id: 'stagione-automatica',
    category: 'Gare FIPAV',
    question: 'Posso generare tutti gli allenamenti dell’anno in una volta sola?',
    answer: 'Sì! Nella sezione "Eventi" trovi la funzione "Stagione Automatica": seleziona i giorni settimanali di palestra (es. Martedì e Giovedì) e gli orari. VolleyStack genererà tutte le sessioni da inizio stagione fino a Giugno, tenendo conto delle festività natalizie e pasquali.',
    highlight: 'Generatore automatico di tutta la stagione sportiva.'
  }
];

const CATEGORIES = ['Tutte', 'Primi Passi', 'Presenze & Convocazioni', 'Turno Paste', 'Cassa & Multe', 'Gare FIPAV'];

export default function Support() {
  const token = useAuthStore((state) => state.token);
  const { theme, toggleTheme } = useThemeStore();
  const [selectedCategory, setSelectedCategory] = useState('Tutte');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>('setup-squadra');

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((faq) => {
      const matchCategory = selectedCategory === 'Tutte' || faq.category === selectedCategory;
      const matchQuery = 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (faq.highlight && faq.highlight.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  const content = (
    <div className="space-y-10 max-w-4xl mx-auto">
      {/* Hero Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#38BDF8]/10 text-[#38BDF8] border border-[#2A7EA2]/30 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
          <HelpCircle className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span>Centro Assistenza & FAQ</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-text-primary tracking-tight">
          Come possiamo aiutarti?
        </h1>
        <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Tutto quello che serve sapere per gestire il tuo spogliatoio, organizzare le presenze e non perdersi una pasta.
        </p>

        {/* Live Search Input */}
        <div className="relative max-w-xl mx-auto pt-4">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-text-tertiary absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca una risposta (es. paste, convocazione, multa, FIPAV)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-surface/90 border border-white/10 hover:border-[#2A7EA2]/40 focus:border-[#2A7EA2] text-text-primary placeholder:text-text-tertiary outline-none transition-all shadow-lg backdrop-blur-md text-sm sm:text-base font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 text-xs font-bold text-text-tertiary hover:text-text-primary bg-white/5 px-2 py-1 rounded-lg"
              >
                Cancella
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Categories Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-150 active:scale-95 cursor-pointer ${
                isActive
                  ? 'bg-[#38BDF8] text-[#070B12] shadow-[0_0_20px_rgba(56,189,248,0.35)]'
                  : 'bg-surface hover:bg-white/5 border border-white/10 text-text-secondary hover:text-text-primary'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* FAQs Accordion List */}
      <div className="space-y-3.5">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-surface/40 border border-white/10">
            <HelpCircle className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
            <h3 className="text-lg font-bold text-text-primary">Nessuna risposta trovata</h3>
            <p className="text-sm text-text-secondary mt-1 max-w-md mx-auto">
              Non abbiamo trovato domande che corrispondono a "{searchQuery}". Prova con un'altra parola o scrivici direttamente.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('Tutte'); }}
              className="mt-4 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-text-primary transition-all"
            >
              Mostra tutte le domande
            </button>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <motion.div
                key={faq.id}
                initial={false}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen 
                    ? 'bg-[#0F1726] border-[#2A7EA2]/40 shadow-[0_0_25px_rgba(56,189,248,0.10)]' 
                    : 'bg-[#0A101D]/70 hover:bg-[#0F1726]/90 border-white/10 hover:border-white/20'
                }`}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="shrink-0 w-2 h-2 rounded-full bg-[#38BDF8]" />
                    <span className="font-bold text-sm sm:text-base text-text-primary">
                      {faq.question}
                    </span>
                  </div>
                  <div className={`p-1.5 rounded-lg bg-white/5 border border-white/10 text-text-tertiary transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-[#38BDF8] border-[#2A7EA2]/30' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1 border-t border-white/5 text-sm sm:text-base text-text-secondary leading-relaxed space-y-3">
                        <p>{faq.answer}</p>
                        {faq.highlight && (
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#38BDF8]/10 border border-[#2A7EA2]/25 text-[#38BDF8] text-xs font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            <span>{faq.highlight}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Guide & Tutorial Callout */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#0F1726] via-[#131F33] to-[#0F1726] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#38BDF8]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#38BDF8]">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Guide Passo-Passo</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
            Preferisci un tutorial completo?
          </h3>
          <p className="text-text-secondary text-sm max-w-md">
            Scopri come impostare la rosa, calcolare le multe e preparare i convocati della partita passo dopo passo.
          </p>
        </div>
        <Link
          to="/guides"
          className="relative z-10 shrink-0 inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-[#04060A] px-6 py-3.5 rounded-xl font-extrabold text-sm transition-all duration-150 active:scale-95 shadow-[0_4px_20px_rgba(255,255,255,0.22)]"
        >
          <span>Apri le Guide</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Direct Contact Card */}
      <div className="rounded-3xl p-8 bg-[#0A101D]/90 border border-white/10 text-center space-y-4 shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-[#38BDF8]/15 border border-[#2A7EA2]/30 flex items-center justify-center mx-auto text-[#38BDF8] shadow-[0_0_20px_rgba(56,189,248,0.2)]">
          <Mail className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-black text-text-primary tracking-tight">
          Non hai trovato la risposta che cercavi?
        </h3>
        <p className="text-text-secondary text-sm sm:text-base max-w-md mx-auto">
          Siamo una squadra di pallavolisti e sviluppatori. Scrivici quando vuoi, rispondiamo solitamente entro poche ore.
        </p>
        <div className="pt-2">
          <a
            href="mailto:support@volleystack.com"
            className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#2A7EA2]/50 text-text-primary hover:text-[#38BDF8] px-6 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-sm"
          >
            <Mail className="w-4 h-4 text-[#38BDF8]" />
            <span>support@volleystack.com</span>
          </a>
        </div>
      </div>
    </div>
  );

  // If user is already authenticated, render inside the logged-in App layout seamlessly
  if (token) {
    return content;
  }

  // If unauthenticated visitor from landing/footer, wrap with public navbar and volleyball backdrop
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
