import { useQuery } from '@tanstack/react-query';
import { 
  Activity, 
  Calendar as CalendarIcon, 
  Euro, 
  UserCheck, 
  Croissant, 
  Check, 
  X, 
  MapPin, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  ChevronRight,
  Users,
  Sparkles,
  Zap
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

export default function Dashboard() {
  const { user } = useAuthStore();
  const membership = user?.memberships?.[0];
  const teamId = membership?.teamId;

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ['events', teamId],
    queryFn: () => api.get(`/teams/${teamId}/events`).then(res => res.data),
    enabled: !!teamId,
  });

  const { data: teamMembers } = useQuery({
    queryKey: ['team', teamId, 'members'],
    queryFn: () => api.get(`/teams/${teamId}/members`).then(res => res.data),
    enabled: !!teamId,
  });

  const { data: fines } = useQuery({
    queryKey: ['fines', teamId],
    queryFn: () => api.get(`/teams/${teamId}/fines`).then(res => res.data),
    enabled: !!teamId,
  });

  const { data: pastes } = useQuery({
    queryKey: ['pastes', teamId],
    queryFn: () => api.get(`/teams/${teamId}/pastes`).then(res => res.data),
    enabled: !!teamId,
  });

  if (!teamId) {
    return <Navigate to="/team" replace />;
  }

  // Next Upcoming Event
  const nextEvent = events?.filter((e: any) => new Date(e.date) > new Date())
    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  // My Fines
  const myFines = fines?.filter((f: any) => f.status === 'UNPAID') || [];
  const totalFineAmount = myFines.reduce((acc: number, f: any) => acc + f.amountCents, 0);

  // My Pending Pastes
  const myPendingPastes = pastes?.filter((p: any) => p.status === 'PENDING' && p.teamMemberId === membership?.id) || [];
  const pasteReminder = myPendingPastes[0];

  const isCoachOrAdmin = membership?.roles?.some((r: any) => ['COACH', 'ADMIN', 'OWNER', 'ASSISTANT_COACH'].includes(r.role)) ?? false;

  // Official attendance & convocations from coach
  const nextEventAttendance = nextEvent?.attendance || [];
  const myAttendance = nextEventAttendance.find((a: any) => a.teamMemberId === membership?.id);
  const convocatiCount = nextEventAttendance.filter((a: any) => a.isPresent).length;

  // Formatted date string for today
  const todayFormatted = new Intl.DateTimeFormat('it-IT', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  }).format(new Date());

  // Countdown Helper
  const getEventTimeLeft = (eventDate: string) => {
    const diffMs = new Date(eventDate).getTime() - new Date().getTime();
    if (diffMs <= 0) return 'In corso';
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays > 0) return `Tra ${diffDays} ${diffDays === 1 ? 'giorno' : 'giorni'}`;
    const remHours = diffHours % 24;
    return `Tra ${remHours}h`;
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 14 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring" as const, stiffness: 350, damping: 28 } 
    }
  };

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="show" 
      className="space-y-6 md:space-y-8 max-w-5xl mx-auto"
    >
      {/* 1. Header: Profilo Squadra & Data Odierna (Option B Obsidian & Volt) */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#38BDF8]/10 text-[#38BDF8] border border-[#2A7EA2]/30 shadow-[0_0_12px_rgba(56,189,248,0.2)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse"></span>
              <span>{membership.team?.name || 'Volley Club'}</span>
            </span>
            {membership.roles?.[0]?.role && (
              <span className="text-[11px] font-mono font-bold text-text-tertiary uppercase tracking-wider">
                {membership.roles[0].role.replace('_', ' ')}
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-text-primary">
            Bentornato, {user?.name?.split(' ')[0] || 'Atleta'}
          </h1>
          <p className="text-xs md:text-sm text-text-tertiary capitalize mt-0.5 flex items-center gap-2">
            <span>{todayFormatted}</span>
            <span>·</span>
            <span className="text-[#38BDF8] font-semibold flex items-center gap-1">
              <Zap className="w-3 h-3 text-[#38BDF8]" /> Spogliatoio Attivo
            </span>
          </p>
        </div>

        {/* Quick shortcut to team roster */}
        <Link 
          to="/team" 
          className="self-start md:self-auto inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-surface hover:bg-surface-hover border border-border text-xs font-semibold text-text-secondary hover:text-text-primary transition-all duration-150 active:scale-95 shadow-sm"
        >
          <Users className="w-3.5 h-3.5 text-text-tertiary" />
          <span>Vedi Roster Squadra</span>
          <ChevronRight className="w-3 h-3 text-text-tertiary" />
        </Link>
      </motion.div>

      {/* 2. Paste Reminder Banner (Se presente) */}
      <AnimatePresence>
        {pasteReminder && (
          <motion.div 
            variants={itemVariants}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="relative overflow-hidden rounded-2xl p-4 md:p-5 bg-gradient-to-r from-[#170E1A] via-[#220F24] to-[#170E1A] text-white border border-[#FF4D94]/30 shadow-[0_4px_24px_rgba(255,77,148,0.2)]"
          >
            <div className="flex items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-[#FF4D94]/20 border border-[#FF4D94]/40 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,77,148,0.25)]">
                  <Croissant className="h-5 w-5 md:h-6 md:md-6 text-[#FF4D94]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-[#FF4D94]/25 text-[#FF4D94] border border-[#FF4D94]/40 px-2 py-0.5 rounded-full">
                      Debito Spogliatoio
                    </span>
                    {pasteReminder.deadline && (
                      <span className="text-[11px] text-text-secondary">
                        Entro il {new Date(pasteReminder.deadline).toLocaleDateString('it-IT')}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-sm md:text-base text-[#F8FAFC] mt-0.5">
                    Tocca a te portare le paste al prossimo allenamento!
                  </h3>
                  <p className="text-text-secondary text-xs mt-0.5 line-clamp-1">
                    Motivazione: <span className="font-semibold text-white italic">"{pasteReminder.reason}"</span>
                  </p>
                </div>
              </div>
              <Link 
                to="/pastes" 
                className="shrink-0 bg-[#FF4D94] hover:bg-[#FF3385] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 shadow-[0_0_15px_rgba(255,77,148,0.35)] flex items-center gap-1.5"
              >
                <span>Dettagli</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {/* Ambient subtle glow */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-[#FF4D94]/10 rounded-full blur-2xl pointer-events-none"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Event Hero Card (Prossimo Evento - Telemetry Obsidian & Volt Card) */}
      <motion.div 
        variants={itemVariants} 
        className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden border border-border bg-[#0F1726] shadow-xl"
      >
        {/* Ambient Top-Right Radial Volt Court Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.10)_0%,transparent_70%)] pointer-events-none -mr-20 -mt-20"></div>

        <div className="p-5 md:p-8 relative z-10">
          {eventsLoading ? (
            <div className="py-14 flex flex-col items-center justify-center text-text-tertiary">
              <Activity className="animate-spin h-7 w-7 text-[#38BDF8] mb-3" />
              <p className="text-xs font-medium">Caricamento prossimi eventi...</p>
            </div>
          ) : nextEvent ? (
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 md:gap-8">
              
              {/* Colonna Sinistra: Dettagli Evento */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider border ${
                    nextEvent.type === 'MATCH' 
                      ? 'bg-amber-500/15 text-amber-400 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]' 
                      : nextEvent.type === 'TRAINING'
                      ? 'bg-[#38BDF8]/15 text-[#38BDF8] border border-[#2A7EA2]/30 shadow-[0_0_10px_rgba(56,189,248,0.2)]'
                      : 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                    <span>{nextEvent.type === 'MATCH' ? 'Partita Ufficiale' : nextEvent.type === 'TRAINING' ? 'Allenamento' : 'Ritrovo / Social'}</span>
                  </span>

                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-text-primary bg-[#070B12]/80 px-2.5 py-1 rounded-md border border-white/10 shadow-inner">
                    <Clock className="w-3 h-3 text-[#38BDF8]" />
                    <span>{getEventTimeLeft(nextEvent.date)}</span>
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight text-[#F8FAFC] leading-tight">
                    {nextEvent.title}
                  </h2>
                  
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs md:text-sm text-text-secondary mt-2.5">
                    <div className="flex items-center gap-1.5 font-medium text-text-primary">
                      <CalendarIcon className="w-4 h-4 text-[#38BDF8]" />
                      <span className="capitalize">
                        {new Date(nextEvent.date).toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </span>
                      <span>·</span>
                      <span className="font-mono">{new Date(nextEvent.date).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    {nextEvent.location && (
                      <div className="flex items-center gap-1 text-text-secondary hover:text-[#38BDF8] transition-colors">
                        <MapPin className="w-4 h-4 text-danger shrink-0" />
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(nextEvent.location)}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="hover:underline font-normal truncate max-w-[200px] sm:max-w-[280px]"
                        >
                          {nextEvent.location}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Convocazione / Presenza Info Box (Gestito esclusivamente dallo Staff) */}
                <div className="pt-2">
                  {isCoachOrAdmin ? (
                    <div>
                      <p className="text-[11px] font-black text-text-tertiary uppercase tracking-wider mb-2">
                        Pannello Coach / Staff:
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
                        <Link 
                          to="/events" 
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#38BDF8] hover:bg-[#0284C7] text-[#070B12] text-xs font-black uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-[0_0_20px_rgba(56,189,248,0.4)]"
                        >
                          {nextEvent.type === 'MATCH' ? (
                            <>
                              <Users className="w-4 h-4 stroke-[2.5]" />
                              <span>Gestisci Convocati Gara</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4 stroke-[3]" />
                              <span>Fai Appello Presenze</span>
                            </>
                          )}
                        </Link>
                        <span className="text-xs text-text-tertiary">
                          {nextEvent.type === 'MATCH' ? 'Le convocazioni ufficiali le decidi tu' : 'Segna chi è presente in palestra'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-[11px] font-black text-text-tertiary uppercase tracking-wider mb-2">
                        Il tuo stato convocazione:
                      </p>
                      {nextEvent.type === 'MATCH' ? (
                        myAttendance?.isPresent === true ? (
                          <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                              <ShieldCheck className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                              <p className="text-xs font-black uppercase tracking-wider text-emerald-300">Sei Convocato!</p>
                              <p className="text-[11px] text-emerald-400/80">Il mister ti ha inserito nella lista ufficiale della partita</p>
                            </div>
                          </div>
                        ) : myAttendance?.isPresent === false ? (
                          <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-300">
                            <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center shrink-0">
                              <X className="w-5 h-5 text-slate-400" />
                            </div>
                            <div>
                              <p className="text-xs font-black uppercase tracking-wider text-slate-300">A Riposo</p>
                              <p className="text-[11px] text-slate-400">Non convocato per questa gara</p>
                            </div>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface border border-white/10 text-text-secondary">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                              <Clock className="w-5 h-5 text-[#38BDF8]" />
                            </div>
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider text-text-primary">Convocazioni in attesa</p>
                              <p className="text-[11px] text-text-tertiary">Il mister pubblicherà a breve la lista convocati</p>
                            </div>
                          </div>
                        )
                      ) : (
                        myAttendance?.isPresent === true ? (
                          <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                            <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                            <span className="text-xs font-bold">Presente all'appello dell'allenamento</span>
                          </div>
                        ) : myAttendance?.isPresent === false ? (
                          <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-danger/15 border border-danger/30 text-danger">
                            <X className="w-4 h-4 stroke-[2.5]" />
                            <span className="text-xs font-bold">Segnato assente dal mister</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-surface border border-white/10 text-text-tertiary">
                            <Clock className="w-4 h-4 text-[#38BDF8]" />
                            <span className="text-xs font-medium">In attesa dell'appello presenze</span>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Colonna Destra: Roster Status Card */}
              <div className="lg:w-72 bg-[#070B12]/90 rounded-2xl p-5 border border-white/10 flex flex-col justify-between space-y-4 shadow-inner">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-[11px] font-black text-text-tertiary uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]"></span>
                    <span>{nextEvent.type === 'MATCH' ? 'Lista Convocati' : 'Presenze Registrate'}</span>
                  </span>
                  <Link to={`/events`} className="text-[11px] font-bold text-[#38BDF8] hover:underline flex items-center gap-1">
                    <span>Vedi Roster</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="bg-[#0F1726] rounded-xl p-4 border border-white/5 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
                      {nextEvent.type === 'MATCH' ? 'Convocati dal Mister' : 'Presenti in Palestra'}
                    </p>
                    <p className="text-2xl font-black text-[#38BDF8] font-mono leading-tight mt-1">
                      {convocatiCount} <span className="text-xs font-normal text-text-tertiary">/ {teamMembers?.length || '—'} rosa</span>
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#38BDF8]/10 border border-[#2A7EA2]/30 flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#38BDF8]" />
                  </div>
                </div>

                <Link 
                  to="/events" 
                  className="w-full py-2 px-3 rounded-lg bg-surface hover:bg-surface-hover border border-border text-center text-xs font-bold text-text-secondary hover:text-text-primary transition-colors block"
                >
                  {isCoachOrAdmin ? 'Gestisci Elenco' : 'Consulta Lista Convocati'}
                </Link>
              </div>

            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-surface-hover border border-border flex items-center justify-center mb-3">
                <CalendarIcon className="h-7 w-7 text-text-tertiary" />
              </div>
              <h3 className="text-lg font-bold text-text-primary">Nessun evento in programma</h3>
              <p className="text-xs text-text-secondary mt-1 max-w-sm">
                La stagione o la settimana non ha partite o allenamenti calendarizzati. Il coach pubblicherà a breve i prossimi impegni.
              </p>
              <Link 
                to="/events" 
                className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-[#04060A] text-xs font-extrabold uppercase tracking-wider hover:bg-slate-100 transition-colors shadow-[0_4px_18px_rgba(255,255,255,0.2)]"
              >
                <span>Apri Calendario Completo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </motion.div>

      {/* 4. Row Widget Metriche (Telemetry Style: Obsidian & Electric Volt) */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-5">
        
        {/* Widget 1: Tax & Cassa Multe */}
        <Link 
          to="/treasury" 
          className="saas-card bg-[#0F1726] p-4 md:p-5 flex flex-col justify-between hover:border-amber-500/40 active:scale-[0.99] transition-all group shadow-md"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/25 group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(245,158,11,0.15)]">
              <Euro className="h-5 w-5" />
            </div>
            {myFines.length > 0 ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-danger/15 text-danger border border-danger/30 shadow-[0_0_8px_rgba(239,68,68,0.25)]">
                <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse"></span>
                <span>Da saldare</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#38BDF8]/15 text-[#38BDF8] border border-[#2A7EA2]/30 shadow-[0_0_8px_rgba(56,189,248,0.25)]">
                <Check className="w-3 h-3 stroke-[3px]" />
                <span>In regola</span>
              </span>
            )}
          </div>

          <div>
            <p className="text-[11px] font-black text-text-tertiary uppercase tracking-wider">Cassa & Multe Personali</p>
            <h3 className="text-xl md:text-2xl font-black text-[#F8FAFC] tracking-tight mt-1 font-mono">
              € {(totalFineAmount / 100).toFixed(2)}
            </h3>
            <p className="text-xs text-text-secondary mt-1 flex items-center justify-between">
              <span>{myFines.length === 0 ? 'Tutto pagato' : `${myFines.length} multe da pagare`}</span>
              <ChevronRight className="w-3.5 h-3.5 text-text-tertiary group-hover:translate-x-0.5 group-hover:text-[#38BDF8] transition-all" />
            </p>
          </div>
        </Link>

        {/* Widget 2: Debito Paste */}
        <Link 
          to="/pastes" 
          className="saas-card bg-[#0F1726] p-4 md:p-5 flex flex-col justify-between hover:border-[#FF4D94]/40 active:scale-[0.99] transition-all group shadow-md relative overflow-hidden"
        >
          <div className="flex justify-between items-start mb-3 relative z-10">
            <div className="w-9 h-9 rounded-xl bg-[#FF4D94]/10 flex items-center justify-center text-[#FF4D94] border border-[#FF4D94]/25 group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(255,77,148,0.15)]">
              <Croissant className="h-5 w-5" />
            </div>
            {myPendingPastes.length > 0 ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FF4D94]/15 text-[#FF4D94] border border-[#FF4D94]/30 shadow-[0_0_8px_rgba(255,77,148,0.25)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D94] animate-pulse"></span>
                <span>Da portare</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#070B12] text-text-tertiary border border-white/5">
                <span>In pari</span>
              </span>
            )}
          </div>

          <div className="relative z-10">
            <p className="text-[11px] font-black text-text-tertiary uppercase tracking-wider">Turno delle Paste</p>
            <h3 className="text-xl md:text-2xl font-black text-[#F8FAFC] tracking-tight mt-1 font-mono">
              {myPendingPastes.length} {myPendingPastes.length === 1 ? 'vassoio' : 'vassoi'}
            </h3>
            <p className="text-xs text-text-secondary mt-1 flex items-center justify-between">
              <span>{myPendingPastes.length === 0 ? 'Nessun debito paste' : 'Tocca a te portare le paste!'}</span>
              <ChevronRight className="w-3.5 h-3.5 text-text-tertiary group-hover:translate-x-0.5 group-hover:text-[#FF4D94] transition-all" />
            </p>
          </div>
        </Link>

        {/* Widget 3: Percentuale Presenze */}
        <Link 
          to="/stats" 
          className="saas-card bg-[#0F1726] p-4 md:p-5 flex flex-col justify-between hover:border-[#2A7EA2]/40 active:scale-[0.99] transition-all group shadow-md"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="w-9 h-9 rounded-xl bg-[#38BDF8]/10 flex items-center justify-center text-[#38BDF8] border border-[#2A7EA2]/25 group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(56,189,248,0.15)]">
              <UserCheck className="h-5 w-5" />
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#38BDF8]/15 text-[#38BDF8] border border-[#2A7EA2]/30 shadow-[0_0_8px_rgba(56,189,248,0.2)]">
              <span>Stagione 26/27</span>
            </span>
          </div>

          <div>
            <p className="text-[11px] font-black text-text-tertiary uppercase tracking-wider">Presenze Stagione</p>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-xl md:text-2xl font-black text-[#F8FAFC] tracking-tight font-mono">
                94%
              </h3>
              <div className="flex items-end gap-1 h-5 pb-0.5">
                <span className="w-1.5 h-2 rounded-sm bg-[#38BDF8]/40"></span>
                <span className="w-1.5 h-3 rounded-sm bg-[#38BDF8]/60"></span>
                <span className="w-1.5 h-4.5 rounded-sm bg-[#38BDF8] shadow-[0_0_6px_rgba(56,189,248,0.6)]"></span>
                <span className="w-1.5 h-5 rounded-sm bg-[#38BDF8] shadow-[0_0_8px_rgba(56,189,248,0.8)]"></span>
                <span className="w-1.5 h-4 rounded-sm bg-[#38BDF8] shadow-[0_0_6px_rgba(56,189,248,0.6)]"></span>
              </div>
            </div>
            <p className="text-xs text-text-secondary mt-1 flex items-center justify-between">
              <span>Ottima continuità</span>
              <ChevronRight className="w-3.5 h-3.5 text-text-tertiary group-hover:translate-x-0.5 group-hover:text-[#38BDF8] transition-all" />
            </p>
          </div>
        </Link>

      </motion.div>

      {/* 5. Sezione Inferiore: Feed Attività dello Spogliatoio & Accessi Rapidi */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* Feed Attività (Occupa 2 colonne su Desktop) */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-3.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-black text-text-tertiary uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]"></span>
              <span>Ultime dallo Spogliatoio</span>
            </h2>
            <span className="text-[11px] font-mono text-[#38BDF8] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-ping"></span> In tempo reale
            </span>
          </div>

          <div className="saas-card bg-[#0F1726] divide-y divide-white/5 overflow-hidden shadow-md">
            
            <div className="flex items-center gap-3.5 p-3.5 md:p-4 hover:bg-[#162238]/60 transition-colors">
              <div className="w-8 h-8 rounded-full bg-[#38BDF8]/10 border border-[#2A7EA2]/25 flex items-center justify-center text-[#38BDF8] shrink-0 shadow-[0_0_10px_rgba(56,189,248,0.15)]">
                <Check className="w-4 h-4 stroke-[2.5px]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm text-text-primary font-medium truncate">
                  <span className="font-bold text-[#F8FAFC]">Marco</span> ha confermato la presenza al prossimo allenamento
                </p>
                <p className="text-[11px] font-mono text-text-tertiary mt-0.5">2 ore fa</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 md:p-4 hover:bg-[#162238]/60 transition-colors">
              <div className="w-8 h-8 rounded-full bg-[#38BDF8]/15 border border-[#2A7EA2]/30 flex items-center justify-center text-[#38BDF8] shrink-0 shadow-[0_0_10px_rgba(56,189,248,0.2)]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm text-text-primary font-medium truncate">
                  Il Tesoriere ha registrato il saldo quota di <span className="font-bold text-[#F8FAFC]">Luca</span>
                </p>
                <p className="text-[11px] font-mono text-text-tertiary mt-0.5">Ieri alle 19:40</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 md:p-4 hover:bg-[#162238]/60 transition-colors">
              <div className="w-8 h-8 rounded-full bg-danger/15 border border-danger/30 flex items-center justify-center text-danger shrink-0 shadow-[0_0_10px_rgba(239,68,68,0.15)]">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm text-text-primary font-medium truncate">
                  Nuova multa assegnata a <span className="font-bold text-[#F8FAFC]">Andrea</span> · Ritardo allenamento
                </p>
                <p className="text-[11px] font-mono text-text-tertiary mt-0.5">2 giorni fa</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 md:p-4 hover:bg-[#162238]/60 transition-colors">
              <div className="w-8 h-8 rounded-full bg-[#FF4D94]/15 border border-[#FF4D94]/30 flex items-center justify-center text-[#FF4D94] shrink-0 shadow-[0_0_10px_rgba(255,77,148,0.15)]">
                <Croissant className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm text-text-primary font-medium truncate">
                  Turno paste per <span className="font-bold text-[#F8FAFC]">Lorenzo</span> · Battuta lisciata
                </p>
                <p className="text-[11px] font-mono text-text-tertiary mt-0.5">3 giorni fa</p>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Card Scorciatoie Squadra */}
        <motion.div variants={itemVariants} className="space-y-3.5">
          <h2 className="text-xs font-black text-text-tertiary uppercase tracking-wider px-1">
            Accesso Rapido
          </h2>

          <div className="saas-card bg-[#0F1726] p-4 space-y-2.5 shadow-md border-white/10">
            <Link 
              to="/treasury" 
              className="flex items-center justify-between p-3 rounded-xl hover:bg-[#162238] border border-transparent hover:border-white/10 transition-all text-xs font-bold text-text-primary group"
            >
              <div className="flex items-center gap-2.5">
                <Euro className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>Regolamento Multe</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-text-tertiary group-hover:text-[#38BDF8] transition-colors" />
            </Link>

            <Link 
              to="/events" 
              className="flex items-center justify-between p-3 rounded-xl hover:bg-[#162238] border border-transparent hover:border-white/10 transition-all text-xs font-bold text-text-primary group"
            >
              <div className="flex items-center gap-2.5">
                <CalendarIcon className="w-4 h-4 text-[#38BDF8] group-hover:scale-110 transition-transform" />
                <span>Calendario Convocazioni</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-text-tertiary group-hover:text-[#38BDF8] transition-colors" />
            </Link>

            <Link 
              to="/pastes" 
              className="flex items-center justify-between p-3 rounded-xl hover:bg-[#162238] border border-transparent hover:border-white/10 transition-all text-xs font-bold text-text-primary group"
            >
              <div className="flex items-center gap-2.5">
                <Croissant className="w-4 h-4 text-[#FF4D94] group-hover:scale-110 transition-transform" />
                <span>Classifica Paste</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-text-tertiary group-hover:text-[#FF4D94] transition-colors" />
            </Link>

            <div className="pt-2 border-t border-white/5">
              <div className="p-3 rounded-xl bg-[#070B12] border border-white/5 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  <strong className="text-[#F8FAFC]">Volley AI Coach:</strong> Assistente tattico e motivazionale attivo su tutte le convocazioni.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>

    </motion.div>
  );
}
