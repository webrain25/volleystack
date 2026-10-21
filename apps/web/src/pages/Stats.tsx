import { Activity, Clock } from 'lucide-react';

export default function Stats() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative flex flex-col items-center justify-center min-h-[70vh]">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-brand-blue to-accent-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
        <div className="h-24 w-24 bg-surface border border-border rounded-full flex items-center justify-center relative shadow-[0_0_40px_rgba(255,255,255,0.05)]">
          <Activity className="w-10 h-10 text-brand-blue" />
        </div>
      </div>
      
      <div className="text-center max-w-lg mt-8">
        <h1 className="text-3xl md:text-5xl font-bold text-text-primary tracking-tight mb-4">Statistiche</h1>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue-bright text-xs font-semibold uppercase tracking-widest mb-6">
          <Clock className="w-3 h-3" />
          <span>Coming Soon</span>
        </div>
        <p className="text-text-secondary text-base leading-relaxed">
          Stiamo costruendo un hub avanzato per le performance della tua squadra. 
          Presto potrai analizzare in dettaglio le presenze, monitorare la disciplina (multe) e scoprire i migliori giocatori della stagione.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 w-full max-w-3xl opacity-50 pointer-events-none">
        <div className="saas-card p-4 blur-[1px]">
          <div className="h-4 w-24 bg-surface-hover rounded mb-4"></div>
          <div className="h-10 w-16 bg-surface-hover rounded mb-2"></div>
          <div className="h-2 w-full bg-surface-hover rounded"></div>
        </div>
        <div className="saas-card p-4 blur-[2px]">
          <div className="h-4 w-24 bg-surface-hover rounded mb-4"></div>
          <div className="h-10 w-16 bg-surface-hover rounded mb-2"></div>
          <div className="h-2 w-full bg-surface-hover rounded"></div>
        </div>
        <div className="saas-card p-4 blur-[1px]">
          <div className="h-4 w-24 bg-surface-hover rounded mb-4"></div>
          <div className="h-10 w-16 bg-surface-hover rounded mb-2"></div>
          <div className="h-2 w-full bg-surface-hover rounded"></div>
        </div>
      </div>
    </div>
  );
}
