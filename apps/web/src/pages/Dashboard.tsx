import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Activity, 
  Calendar as CalendarIcon, 
  Euro, 
  UserCheck, 
  Croissant, 
  Check, 
  X, 
  HelpCircle, 
  MapPin, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  ChevronRight,
  Users,
  Sparkles
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

export default function Dashboard() {
  const { user } = useAuthStore();
  const membership = user?.memberships?.[0];
  const teamId = membership?.teamId;

  const queryClient = useQueryClient();

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ['events', teamId],
    queryFn: () => api.get(`/teams/${teamId}/events`).then(res => res.data),
    enabled: !!teamId,
  });

  const rsvp = useMutation({
    mutationFn: ({ eventId, status }: { eventId: string, status: string }) => 
      api.post(`/teams/${teamId}/events/${eventId}/rsvp`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', teamId] });
    }
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

  // RSVP Status for current user on next event
  const myRsvpStatus = nextEvent?.rsvps?.find((r: any) => r.teamMemberId === membership?.id)?.status;

  // Attendance stats for next event
  const attendingCount = nextEvent?.rsvps?.filter((r: any) => r.status === 'ATTENDING').length || 0;
  const absentCount = nextEvent?.rsvps?.filter((r: any) => r.status === 'ABSENT').length || 0;
  const maybeCount = nextEvent?.rsvps?.filter((r: any) => r.status === 'MAYBE').length || 0;

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
    return `Tra ${diffHours} ${diffHours === 1 ? 'ora' : 'ore'}`;
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
      {/* 1. Header con Profilo Squadra & Data Odierna */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-brand-blue/10 text-brand-blue border border-brand-blue/20">
              {membership.team?.name || 'Volley Club'}
            </span>
            {membership.roles?.[0]?.role && (
              <span className="text-[11px] font-bold text-text-tertiary uppercase">
                {membership.roles[0].role.replace('_', ' ')}
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-text-primary">
            Bentornato, {user?.name?.split(' ')[0] || 'Atleta'}
          </h1>
          <p className="text-xs md:text-sm text-text-tertiary capitalize mt-0.5">
            {todayFormatted}
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
            className="relative overflow-hidden rounded-2xl p-4 md:p-5 bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 text-white shadow-[0_8px_25px_rgba(236,72,153,0.25)] border border-white/20"
          >
            <div className="flex items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
                  <Croissant className="h-5 w-5 md:h-6 md:md-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-white/25 px-2 py-0.5 rounded-full">
                      Debito Spogliatoio
                    </span>
                    {pasteReminder.deadline && (
                      <span className="text-[11px] text-white/90">
                        Entro il {new Date(pasteReminder.deadline).toLocaleDateString('it-IT')}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-sm md:text-base mt-0.5">
                    Tocca a te portare le paste al prossimo allenamento!
                  </h3>
                  <p className="text-white/80 text-xs mt-0.5 line-clamp-1">
                    Motivazione: <span className="font-semibold text-white italic">"{pasteReminder.reason}"</span>
                  </p>
                </div>
              </div>
              <Link 
                to="/pastes" 
                className="shrink-0 bg-white text-pink-600 hover:bg-white/95 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 shadow-md flex items-center gap-1.5"
              >
                <span>Dettagli</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {/* Ambient subtle glow */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Event Hero Card (Prossimo Evento in Primo Piano) */}
      <motion.div variants={itemVariants} className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden border border-border bg-surface shadow-md">
        {/* Subtle Ambient Light Banner */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-brand-blue/5 blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="p-5 md:p-8 relative z-10">
          {eventsLoading ? (
            <div className="py-14 flex flex-col items-center justify-center text-text-tertiary">
              <Activity className="animate-spin h-7 w-7 text-brand-blue mb-3" />
              <p className="text-xs font-medium">Caricamento programma gare e allenamenti...</p>
            </div>
          ) : nextEvent ? (
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 md:gap-8">
              
              {/* Colonna Sinistra: Dettagli Evento */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${
                    nextEvent.type === 'MATCH' 
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' 
                      : nextEvent.type === 'TRAINING'
                      ? 'bg-brand-blue/10 text-brand-blue border-brand-blue/20'
                      : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
                  }`}>
                    {nextEvent.type === 'MATCH' ? 'Partita Ufficiale' : nextEvent.type === 'TRAINING' ? 'Allenamento' : 'Ritrovo / Social'}
                  </span>

                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-text-tertiary bg-surface-hover px-2 py-0.5 rounded-md border border-border">
                    <Clock className="w-3 h-3 text-text-tertiary" />
                    <span>{getEventTimeLeft(nextEvent.date)}</span>
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-text-primary leading-tight">
                    {nextEvent.title}
                  </h2>
                  
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs md:text-sm text-text-secondary mt-2.5">
                    <div className="flex items-center gap-1.5 font-medium text-text-primary">
                      <CalendarIcon className="w-4 h-4 text-brand-blue" />
                      <span className="capitalize">
                        {new Date(nextEvent.date).toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </span>
                      <span>·</span>
                      <span>{new Date(nextEvent.date).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    {nextEvent.location && (
                      <div className="flex items-center gap-1 text-text-secondary hover:text-brand-blue transition-colors">
                        <MapPin className="w-4 h-4 text-danger shrink-0" />
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(nextEvent.location)}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="hover:underline font-normal truncate max-w-[280px]"
                        >
                          {nextEvent.location}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* RSVP Control Bar */}
                <div className="pt-2">
                  <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider mb-2">
                    La tua presenza:
                  </p>
                  <div className="flex items-center gap-2.5 max-w-md">
                    {/* Bottone Ci Sono */}
                    <button 
                      onClick={() => rsvp.mutate({ eventId: nextEvent.id, status: 'ATTENDING' })}
                      className={`flex-1 min-h-[44px] px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all duration-150 active:scale-95 border ${
                        myRsvpStatus === 'ATTENDING'
                          ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                          : 'bg-surface hover:bg-emerald-500/10 text-text-primary border-border hover:border-emerald-500/40'
                      }`}
                    >
                      <Check className={`h-4 w-4 ${myRsvpStatus === 'ATTENDING' ? 'text-white' : 'text-emerald-500'}`} />
                      <span>Ci sono</span>
                    </button>

                    {/* Bottone Assente */}
                    <button 
                      onClick={() => rsvp.mutate({ eventId: nextEvent.id, status: 'ABSENT' })}
                      title="Segna Assenza"
                      className={`h-[44px] px-3.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-150 active:scale-95 border ${
                        myRsvpStatus === 'ABSENT'
                          ? 'bg-danger text-white border-danger shadow-sm'
                          : 'bg-surface hover:bg-danger/10 text-text-secondary hover:text-danger border-border hover:border-danger/30'
                      }`}
                    >
                      <X className="h-4 w-4" />
                      <span className="hidden sm:inline">Assente</span>
                    </button>

                    {/* Bottone In Dubbio */}
                    <button 
                      onClick={() => rsvp.mutate({ eventId: nextEvent.id, status: 'MAYBE' })}
                      title="Segna In Dubbio"
                      className={`h-[44px] px-3.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-150 active:scale-95 border ${
                        myRsvpStatus === 'MAYBE'
                          ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                          : 'bg-surface hover:bg-amber-500/10 text-text-secondary hover:text-amber-500 border-border hover:border-amber-500/30'
                      }`}
                    >
                      <HelpCircle className="h-4 w-4" />
                      <span className="hidden sm:inline">In dubbio</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Colonna Destra: Roster Status Card */}
              <div className="lg:w-72 bg-bg-primary/70 dark:bg-bg-primary/40 rounded-xl p-4 md:p-5 border border-border flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <span className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Stato Convocazioni</span>
                  <Link to={`/events`} className="text-[11px] font-semibold text-brand-blue hover:underline">
                    Dettagli
                  </Link>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-surface rounded-lg p-2 border border-border">
                    <p className="text-lg font-extrabold text-emerald-500 leading-none">{attendingCount}</p>
                    <p className="text-[10px] font-semibold text-text-tertiary mt-1">Confermati</p>
                  </div>
                  <div className="bg-surface rounded-lg p-2 border border-border">
                    <p className="text-lg font-extrabold text-danger leading-none">{absentCount}</p>
                    <p className="text-[10px] font-semibold text-text-tertiary mt-1">Assenti</p>
                  </div>
                  <div className="bg-surface rounded-lg p-2 border border-border">
                    <p className="text-lg font-extrabold text-amber-500 leading-none">{maybeCount}</p>
                    <p className="text-[10px] font-semibold text-text-tertiary mt-1">In attesa</p>
                  </div>
                </div>

                {/* Progress bar visuale presenze */}
                <div>
                  <div className="flex justify-between text-[11px] font-medium text-text-tertiary mb-1">
                    <span>Quorum convocati</span>
                    <span className="font-bold text-text-primary">
                      {Math.round((attendingCount / Math.max(attendingCount + absentCount + maybeCount, 1)) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-hover overflow-hidden border border-border">
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                      style={{ 
                        width: `${Math.min(100, (attendingCount / Math.max(attendingCount + absentCount + maybeCount, 1)) * 100)}%` 
                      }}
                    />
                  </div>
                </div>
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
                className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-blue text-white text-xs font-semibold hover:bg-brand-blue-bright transition-colors"
              >
                <span>Apri Calendario Completo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </motion.div>

      {/* 4. Row Widget Metriche (Responsive: 1 colonna su mobile, 3 su tablet/desktop) */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-5">
        
        {/* Widget 1: Tax & Cassa Multe */}
        <Link 
          to="/treasury" 
          className="saas-card p-4 md:p-5 flex flex-col justify-between hover:bg-surface-hover hover:border-brand-blue/30 active:scale-[0.99] transition-all group shadow-sm"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 group-hover:scale-105 transition-transform">
              <Euro className="h-5 w-5" />
            </div>
            {myFines.length > 0 ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-danger/10 text-danger border border-danger/20">
                <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse"></span>
                <span>Da saldare</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <Check className="w-3 h-3" />
                <span>In regola</span>
              </span>
            )}
          </div>

          <div>
            <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">Cassa & Multe Personali</p>
            <h3 className="text-xl md:text-2xl font-black text-text-primary tracking-tight mt-1 font-mono">
              € {(totalFineAmount / 100).toFixed(2)}
            </h3>
            <p className="text-xs text-text-secondary mt-1 flex items-center justify-between">
              <span>{myFines.length === 0 ? 'Nessun debito aperto' : `${myFines.length} multe in attesa`}</span>
              <ChevronRight className="w-3.5 h-3.5 text-text-tertiary group-hover:translate-x-0.5 transition-transform" />
            </p>
          </div>
        </Link>

        {/* Widget 2: Debito Paste */}
        <Link 
          to="/pastes" 
          className="saas-card p-4 md:p-5 flex flex-col justify-between hover:bg-surface-hover hover:border-pink-500/30 active:scale-[0.99] transition-all group shadow-sm relative overflow-hidden"
        >
          <div className="flex justify-between items-start mb-3 relative z-10">
            <div className="w-9 h-9 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-500 border border-pink-500/20 group-hover:scale-105 transition-transform">
              <Croissant className="h-5 w-5" />
            </div>
            {myPendingPastes.length > 0 ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/15 text-pink-600 dark:text-pink-400 border border-pink-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse"></span>
                <span>Da portare</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-surface-hover text-text-tertiary border border-border">
                <span>Saldo zero</span>
              </span>
            )}
          </div>

          <div className="relative z-10">
            <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">Paste & Pasticcini</p>
            <h3 className="text-xl md:text-2xl font-black text-text-primary tracking-tight mt-1">
              {myPendingPastes.length} {myPendingPastes.length === 1 ? 'vassoio' : 'vassoi'}
            </h3>
            <p className="text-xs text-text-secondary mt-1 flex items-center justify-between">
              <span>{myPendingPastes.length === 0 ? 'Spogliatoio a credito' : 'Porta la colazione!'}</span>
              <ChevronRight className="w-3.5 h-3.5 text-text-tertiary group-hover:translate-x-0.5 transition-transform" />
            </p>
          </div>
        </Link>

        {/* Widget 3: Percentuale Presenze */}
        <Link 
          to="/stats" 
          className="saas-card p-4 md:p-5 flex flex-col justify-between hover:bg-surface-hover hover:border-brand-blue/30 active:scale-[0.99] transition-all group shadow-sm"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="w-9 h-9 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue border border-brand-blue/20 group-hover:scale-105 transition-transform">
              <UserCheck className="h-5 w-5" />
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-blue/10 text-brand-blue border border-brand-blue/20">
              <span>Stagione 25/26</span>
            </span>
          </div>

          <div>
            <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">Fedeltà Convocazioni</p>
            <h3 className="text-xl md:text-2xl font-black text-text-primary tracking-tight mt-1 font-mono">
              87%
            </h3>
            <p className="text-xs text-text-secondary mt-1 flex items-center justify-between">
              <span>Trend presenze eccellente</span>
              <ChevronRight className="w-3.5 h-3.5 text-text-tertiary group-hover:translate-x-0.5 transition-transform" />
            </p>
          </div>
        </Link>

      </motion.div>

      {/* 5. Sezione Inferiore: Feed Attività dello Spogliatoio & Accessi Rapidi */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* Feed Attività (Occupa 2 colonne su Desktop) */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-3.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold text-text-tertiary uppercase tracking-wider">
              Attività Recente Spogliatoio
            </h2>
            <span className="text-[11px] text-text-tertiary">Live sync</span>
          </div>

          <div className="saas-card divide-y divide-border overflow-hidden shadow-sm">
            
            <div className="flex items-center gap-3.5 p-3.5 md:p-4 hover:bg-surface-hover/70 transition-colors">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm text-text-primary font-medium truncate">
                  <span className="font-bold text-text-primary">Marco</span> ha confermato la presenza al prossimo allenamento
                </p>
                <p className="text-[11px] text-text-tertiary mt-0.5">2 ore fa</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 md:p-4 hover:bg-surface-hover/70 transition-colors">
              <div className="w-8 h-8 rounded-full bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm text-text-primary font-medium truncate">
                  Il Tesoriere ha registrato il saldo quota di <span className="font-bold text-text-primary">Luca</span>
                </p>
                <p className="text-[11px] text-text-tertiary mt-0.5">Ieri alle 19:40</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 md:p-4 hover:bg-surface-hover/70 transition-colors">
              <div className="w-8 h-8 rounded-full bg-danger/10 border border-danger/20 flex items-center justify-center text-danger shrink-0">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm text-text-primary font-medium truncate">
                  Nuova Tax assegnata a <span className="font-bold text-text-primary">Andrea</span> · Ritardo allenamento
                </p>
                <p className="text-[11px] text-text-tertiary mt-0.5">2 giorni fa</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 md:p-4 hover:bg-surface-hover/70 transition-colors">
              <div className="w-8 h-8 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-500 shrink-0">
                <Croissant className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm text-text-primary font-medium truncate">
                  Debito Paste assegnato a <span className="font-bold text-text-primary">Lorenzo</span> · Battuta lisciata
                </p>
                <p className="text-[11px] text-text-tertiary mt-0.5">3 giorni fa</p>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Card Scorciatoie Squadra */}
        <motion.div variants={itemVariants} className="space-y-3.5">
          <h2 className="text-xs font-bold text-text-tertiary uppercase tracking-wider px-1">
            Accesso Rapido
          </h2>

          <div className="saas-card p-4 space-y-2.5 shadow-sm">
            <Link 
              to="/treasury" 
              className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-hover border border-transparent hover:border-border transition-all text-xs font-semibold text-text-primary"
            >
              <div className="flex items-center gap-2.5">
                <Euro className="w-4 h-4 text-amber-500" />
                <span>Regolamento Multe</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-text-tertiary" />
            </Link>

            <Link 
              to="/events" 
              className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-hover border border-transparent hover:border-border transition-all text-xs font-semibold text-text-primary"
            >
              <div className="flex items-center gap-2.5">
                <CalendarIcon className="w-4 h-4 text-brand-blue" />
                <span>Calendario Convocazioni</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-text-tertiary" />
            </Link>

            <Link 
              to="/pastes" 
              className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-hover border border-transparent hover:border-border transition-all text-xs font-semibold text-text-primary"
            >
              <div className="flex items-center gap-2.5">
                <Croissant className="w-4 h-4 text-pink-500" />
                <span>Classifica Paste</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-text-tertiary" />
            </Link>

            <div className="pt-2 border-t border-border">
              <div className="p-3 rounded-xl bg-bg-primary border border-border flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  <strong className="text-text-primary">Volley AI Coach:</strong> I suggerimenti automatici per annunci e motivazioni pre-partita sono attivi in tutte le sezioni.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>

    </motion.div>
  );
}
