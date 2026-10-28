import { Activity, Clock } from 'lucide-react';

export default function Stats() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative flex flex-col items-center justify-center min-h-[70vh]">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#00F59B] to-[#00DF89] rounded-full blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
        <div className="h-24 w-24 bg-surface border border-[#00F59B]/30 rounded-full flex items-center justify-center relative shadow-[0_0_30px_rgba(0,245,155,0.2)]">
          <Activity className="w-10 h-10 text-[#00F59B]" />
        </div>
      </div>
      
      <div className="text-center max-w-lg mt-8">
        <h1 className="text-3xl md:text-5xl font-black text-text-primary tracking-tight mb-4">Statistiche</h1>
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#00F59B]/15 border border-[#00F59B]/30 text-[#00F59B] text-xs font-bold uppercase tracking-wider mb-6 shadow-[0_0_12px_rgba(0,245,155,0.2)]">
          <Clock className="w-3.5 h-3.5" />
          <span>In Arrivo</span>
        </div>
        <p className="text-text-secondary text-base leading-relaxed">
          Stiamo preparando il modulo statistiche per la tua squadra.
          A breve potrai consultare le presenze stagionali, la classifica delle multe e l'andamento della squadra nel campionato.
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
