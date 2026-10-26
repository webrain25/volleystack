import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Activity, CalendarIcon, Euro, UserCheck, Croissant, Check, X, HelpCircle, Gift } from 'lucide-react';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { user } = useAuthStore();
  const membership = user?.memberships?.[0];
  const teamId = membership?.teamId;

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ['events', teamId],
    queryFn: () => api.get(`/teams/${teamId}/events`).then(res => res.data),
    enabled: !!teamId,
  });

  const queryClient = useQueryClient();

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

  const nextEvent = events?.filter((e: any) => new Date(e.date) > new Date())
    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const myFines = fines?.filter((f: any) => f.status === 'UNPAID') || [];
  const totalFineAmount = myFines.reduce((acc: number, f: any) => acc + f.amountCents, 0);

  const myPendingPastes = pastes?.filter((p: any) => p.status === 'PENDING' && p.teamMemberId === membership?.id) || [];
  const pasteReminder = myPendingPastes[0];

  if (!teamId) {
    return <Navigate to="/team" replace />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: import('framer-motion').Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="show" 
      className="space-y-6 md:space-y-8"
    >
      
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col mb-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary">
          Ciao, {user?.name?.split(' ')[0] || 'Utente'}
        </h1>
        <p className="text-sm md:text-base text-text-tertiary mt-1">
          La tua stagione con <span className="text-text-primary font-medium">{membership.team?.name}</span>
        </p>
      </motion.div>

      {/* Paste Reminder Banner */}
      {pasteReminder && (
        <motion.div variants={itemVariants} className="bg-gradient-to-r from-pink-600 to-rose-500 rounded-[16px] p-4 md:p-5 flex items-center justify-between shadow-[0_4px_20px_rgba(219,39,119,0.3)]">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Gift className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm md:text-base">Tocca a te portare le paste!</h3>
              <p className="text-white/80 text-xs md:text-sm mt-0.5">
                Motivazione: <span className="font-semibold text-white">{pasteReminder.reason}</span>
                {pasteReminder.deadline && ` • Entro il: ${new Date(pasteReminder.deadline).toLocaleDateString('it-IT')}`}
              </p>
            </div>
          </div>
          <Link to="/pastes" className="hidden md:flex bg-white text-pink-600 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:scale-105 transition-transform">
            Vedi Dettagli
          </Link>
        </motion.div>
      )}

      {/* Hero Next Event */}
      <motion.div variants={itemVariants} className="relative w-full rounded-[24px] overflow-hidden border border-border bg-surface shadow-2xl">
        {/* Optional Ambient Video / Image Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/backgrounds/court.jpg" 
            alt="Court" 
            className="w-full h-full object-cover opacity-[0.25] mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/80 to-transparent"></div>
          {/* Subtle accent color based on event type */}
          <div className={`absolute top-0 right-0 w-[300px] h-[300px] rounded-full blur-[80px] opacity-20 translate-x-1/2 -translate-y-1/2 ${
            nextEvent?.type === 'MATCH' ? 'bg-accent-500' : 'bg-brand-blue'
          }`}></div>
        </div>

        <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-12">
          {eventsLoading ? (
            <div className="flex-1 py-12 flex justify-center text-text-tertiary">
              <Activity className="animate-spin h-6 w-6" />
            </div>
          ) : nextEvent ? (
            <>
              {/* Event Info */}
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-blue px-2 py-1 rounded bg-brand-blue/10 border border-brand-blue/20">
                    Prossimo Evento
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">
                    {nextEvent.type === 'MATCH' ? 'Partita' : nextEvent.type === 'TRAINING' ? 'Allenamento' : 'Social'}
                  </span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary mb-1">
                  {nextEvent.title}
                </h2>
                
                <p className="text-text-secondary text-sm md:text-base mb-6 flex items-center mt-2">
                  <span className="font-semibold text-text-primary mr-2">
                    {new Date(nextEvent.date).toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-text-tertiary mx-2"></span>
                  {new Date(nextEvent.date).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                  {nextEvent.location && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-text-tertiary mx-2"></span>
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(nextEvent.location)}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:text-brand-blue hover:underline transition-colors"
                      >
                        {nextEvent.location}
                      </a>
                    </>
                  )}
                </p>

                {/* RSVP Controls */}
                <div className="flex items-center gap-3 w-full">
                  <button 
                    onClick={() => rsvp.mutate({ eventId: nextEvent.id, status: 'ATTENDING' })}
                    className={`flex-1 relative overflow-hidden group bg-surface-hover hover:bg-success/20 border transition-all duration-200 py-3 md:py-4 rounded-[16px] flex items-center justify-center active:scale-95 ${
                      nextEvent.rsvps?.find((r: any) => r.teamMemberId === membership?.id)?.status === 'ATTENDING'
                        ? 'border-success/50 bg-success/10 text-success' 
                        : 'border-border text-text-primary hover:border-success/50'
                    }`}
                  >
                    <Check className={`h-5 w-5 mr-2 transition-colors ${nextEvent.rsvps?.find((r: any) => r.teamMemberId === membership?.id)?.status === 'ATTENDING' ? 'text-success' : 'text-text-tertiary group-hover:text-success'}`} />
                    <span className={`text-sm font-bold transition-colors ${nextEvent.rsvps?.find((r: any) => r.teamMemberId === membership?.id)?.status === 'ATTENDING' ? 'text-success' : 'group-hover:text-success'}`}>Ci sono</span>
                  </button>
                  <button 
                    onClick={() => rsvp.mutate({ eventId: nextEvent.id, status: 'ABSENT' })}
                    className={`w-[60px] md:w-[70px] bg-surface-hover hover:bg-danger/10 border transition-all duration-200 py-3 md:py-4 rounded-[16px] flex items-center justify-center active:scale-95 group ${
                      nextEvent.rsvps?.find((r: any) => r.teamMemberId === membership?.id)?.status === 'ABSENT'
                        ? 'border-danger/50 bg-danger/10'
                        : 'border-border hover:border-danger/30'
                    }`}
                  >
                    <X className={`h-5 w-5 transition-colors ${nextEvent.rsvps?.find((r: any) => r.teamMemberId === membership?.id)?.status === 'ABSENT' ? 'text-danger' : 'text-text-tertiary group-hover:text-danger'}`} />
                  </button>
                  <button 
                    onClick={() => rsvp.mutate({ eventId: nextEvent.id, status: 'MAYBE' })}
                    className={`w-[60px] md:w-[70px] bg-surface-hover hover:bg-warning/10 border transition-all duration-200 py-3 md:py-4 rounded-[16px] flex items-center justify-center active:scale-95 group ${
                      nextEvent.rsvps?.find((r: any) => r.teamMemberId === membership?.id)?.status === 'MAYBE'
                        ? 'border-warning/50 bg-warning/10'
                        : 'border-border hover:border-warning/30'
                    }`}
                  >
                    <HelpCircle className={`h-5 w-5 transition-colors ${nextEvent.rsvps?.find((r: any) => r.teamMemberId === membership?.id)?.status === 'MAYBE' ? 'text-warning' : 'text-text-tertiary group-hover:text-warning'}`} />
                  </button>
                </div>
              </div>

              {/* Roster / RSVP Stats */}
              <div className="hidden md:flex flex-col justify-end min-w-[200px] border-l border-border pl-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">Presenti</span>
                    <span className="text-lg font-bold text-text-primary">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">Assenti</span>
                    <span className="text-lg font-bold text-text-primary">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">In attesa</span>
                    <span className="text-lg font-bold text-warning">2</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 py-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-surface-hover border border-border flex items-center justify-center mb-4">
                <CalendarIcon className="h-8 w-8 text-text-tertiary" />
              </div>
              <h3 className="text-xl font-bold text-text-primary">Stagione in pausa</h3>
              <p className="text-sm text-text-secondary mt-1">Nessun evento programmato al momento.</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick Status Row */}
      <motion.div variants={containerVariants} className="grid grid-cols-3 gap-3 md:gap-4">
        
        {/* Tax Widget */}
        <Link to="/treasury" className="saas-card p-3 md:p-5 flex flex-col justify-between hover:bg-surface-hover active:scale-[0.98] transition-all">
          <div className="flex justify-between items-start mb-4">
            <Euro className="h-5 w-5 text-text-tertiary" />
            {myFines.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-danger animate-pulse"></span>
            )}
          </div>
          <div>
            <p className="text-[10px] md:text-xs font-bold text-text-tertiary uppercase tracking-wider mb-1">Tax</p>
            <h3 className="text-lg md:text-2xl font-bold text-text-primary leading-none">
              € {(totalFineAmount / 100).toFixed(2)}
            </h3>
            <p className="text-[10px] md:text-xs text-text-secondary mt-1 truncate">
              {myFines.length === 0 ? 'Tutto pagato' : `${myFines.length} multe aperte`}
            </p>
          </div>
        </Link>

        {/* Paste Widget */}
        <Link to="/pastes" className="saas-card p-3 md:p-5 flex flex-col justify-between hover:bg-surface-hover active:scale-[0.98] transition-all relative overflow-hidden">
          {myPendingPastes.length > 0 && <div className="absolute top-0 right-0 w-16 h-16 bg-pink-500/20 rounded-full blur-xl -mr-4 -mt-4"></div>}
          <div className="flex justify-between items-start mb-4 relative z-10">
            <Croissant className={`h-5 w-5 ${myPendingPastes.length > 0 ? 'text-pink-500' : 'text-text-tertiary'}`} />
            {myPendingPastes.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
            )}
          </div>
          <div className="relative z-10">
            <p className="text-[10px] md:text-xs font-bold text-text-tertiary uppercase tracking-wider mb-1">Paste</p>
            <h3 className="text-lg md:text-2xl font-bold text-text-primary leading-none">{myPendingPastes.length}</h3>
            <p className="text-[10px] md:text-xs text-text-secondary mt-1 truncate">
              {myPendingPastes.length === 0 ? 'Nessun debito' : 'Da portare!'}
            </p>
          </div>
        </Link>

        {/* Attendance Widget */}
        <Link to="/stats" className="saas-card p-3 md:p-5 flex flex-col justify-between hover:bg-surface-hover active:scale-[0.98] transition-all">
          <div className="flex justify-between items-start mb-4">
            <UserCheck className="h-5 w-5 text-brand-blue" />
          </div>
          <div>
            <p className="text-[10px] md:text-xs font-bold text-text-tertiary uppercase tracking-wider mb-1">Presenze</p>
            <h3 className="text-lg md:text-2xl font-bold text-text-primary leading-none">87%</h3>
            <p className="text-[10px] md:text-xs text-text-secondary mt-1 truncate">Stagione</p>
          </div>
        </Link>

      </motion.div>

      {/* Desktop Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        
        {/* Activity Feed */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider px-1">Feed Squadra</h2>
          <div className="saas-card p-2">
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-hover transition-colors">
              <div className="w-2 h-2 rounded-full bg-brand-blue"></div>
              <div className="flex-1">
                <p className="text-sm text-text-primary"><span className="font-semibold">Marco</span> ha confermato l'allenamento</p>
                <p className="text-[11px] text-text-tertiary mt-0.5">2 ore fa</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-hover transition-colors">
              <div className="w-2 h-2 rounded-full bg-success"></div>
              <div className="flex-1">
                <p className="text-sm text-text-primary">Il Tesoriere ha confermato il pagamento di <span className="font-semibold">Luca</span></p>
                <p className="text-[11px] text-text-tertiary mt-0.5">Ieri</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-hover transition-colors">
              <div className="w-2 h-2 rounded-full bg-danger"></div>
              <div className="flex-1">
                <p className="text-sm text-text-primary">Nuova Tax per <span className="font-semibold">Andrea</span> · Ritardo</p>
                <p className="text-[11px] text-text-tertiary mt-0.5">2 giorni fa</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

    </motion.div>
  );
}
