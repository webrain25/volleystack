import DocumentPage from '../components/DocumentPage';
import { Mail } from 'lucide-react';

export default function Support() {
  return (
    <DocumentPage title="Centro Assistenza" lastUpdated="25 Settembre 2026">
      <h2>Come possiamo aiutarti?</h2>
      <p>Il team di VolleyStack è qui per assicurarsi che tu e la tua squadra abbiate tutto il supporto necessario.</p>
      
      <div className="bg-brand-blue/10 border border-brand-blue/20 rounded-2xl p-8 mt-8 flex flex-col items-center text-center">
        <Mail className="h-12 w-12 text-brand-blue mb-4" />
        <h3 className="text-xl font-bold text-text-primary mb-2 mt-0">Contattaci via Email</h3>
        <p className="text-text-secondary mb-6">Il nostro team risponde solitamente entro 24-48 ore lavorative.</p>
        <a href="mailto:support@volleystack.com" className="bg-brand-blue text-white px-8 py-3 rounded-full font-bold hover:bg-brand-blue-bright transition-colors no-underline">
          support@volleystack.com
        </a>
      </div>
    </DocumentPage>
  );
}
