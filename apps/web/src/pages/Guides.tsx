import DocumentPage from '../components/DocumentPage';
import { BookOpen, Users, Wallet, Trophy } from 'lucide-react';

export default function Guides() {
  return (
    <DocumentPage title="Guide e Tutorial" lastUpdated="25 Settembre 2026">
      <p className="text-lg">Esplora i nostri tutorial per imparare a sfruttare al massimo VolleyStack.</p>
      
      <div className="grid sm:grid-cols-2 gap-6 mt-12">
        <div className="border border-border rounded-2xl p-6 bg-surface hover:border-[#00F59B]/50 transition-all hover:shadow-[0_0_20px_rgba(0,245,155,0.15)] cursor-pointer">
          <BookOpen className="h-8 w-8 text-[#00F59B] mb-4" />
          <h3 className="text-xl font-bold text-text-primary mt-0">Guida Rapida</h3>
          <p className="text-sm text-text-secondary mb-0">Tutto ciò che devi sapere per configurare la tua squadra in 5 minuti.</p>
        </div>
        
        <div className="border border-border rounded-2xl p-6 bg-surface hover:border-[#00F59B]/50 transition-all hover:shadow-[0_0_20px_rgba(0,245,155,0.15)] cursor-pointer">
          <Users className="h-8 w-8 text-[#00F59B] mb-4" />
          <h3 className="text-xl font-bold text-text-primary mt-0">Gestione Atleti</h3>
          <p className="text-sm text-text-secondary mb-0">Scopri come gestire presenze, ruoli e permessi per la tua rosa.</p>
        </div>

        <div className="border border-border rounded-2xl p-6 bg-surface hover:border-[#00F59B]/50 transition-all hover:shadow-[0_0_20px_rgba(0,245,155,0.15)] cursor-pointer">
          <Trophy className="h-8 w-8 text-[#00F59B] mb-4" />
          <h3 className="text-xl font-bold text-text-primary mt-0">Eventi & Partite</h3>
          <p className="text-sm text-text-secondary mb-0">Crea eventi, convoca giocatori e tieni traccia delle risposte.</p>
        </div>

        <div className="border border-border rounded-2xl p-6 bg-surface hover:border-[#00F59B]/50 transition-all hover:shadow-[0_0_20px_rgba(0,245,155,0.15)] cursor-pointer">
          <Wallet className="h-8 w-8 text-[#00F59B] mb-4" />
          <h3 className="text-xl font-bold text-text-primary mt-0">Cassa & Quote</h3>
          <p className="text-sm text-text-secondary mb-0">Come usare la tesoreria per tenere sotto controllo le finanze della squadra.</p>
        </div>
      </div>
    </DocumentPage>
  );
}
