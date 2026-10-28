import DocumentPage from '../components/DocumentPage';
import { Mail } from 'lucide-react';

export default function Support() {
  return (
    <DocumentPage title="Centro Assistenza" lastUpdated="25 Settembre 2026">
      <h2>Come possiamo aiutarti?</h2>
      <p>Il team di VolleyStack è qui per assicurarsi che tu e la tua squadra abbiate tutto il supporto necessario.</p>
      
      <div className="bg-[#00F59B]/10 border border-[#00F59B]/25 rounded-2xl p-8 mt-8 flex flex-col items-center text-center shadow-[0_0_20px_rgba(0,245,155,0.1)]">
        <Mail className="h-12 w-12 text-[#00F59B] mb-4" />
        <h3 className="text-xl font-bold text-text-primary mb-2 mt-0">Contattaci via Email</h3>
        <p className="text-text-secondary mb-6">Il nostro team risponde solitamente entro 24-48 ore lavorative.</p>
        <a href="mailto:support@volleystack.com" className="bg-gradient-to-r from-[#00F59B] via-[#00DF89] to-[#00C87E] text-[#070B12] px-8 py-3.5 rounded-xl font-black shadow-[0_0_20px_rgba(0,245,155,0.35)] hover:shadow-[0_0_25px_rgba(0,245,155,0.55)] transition-all no-underline">
          support@volleystack.com
        </a>
      </div>
    </DocumentPage>
  );
}
