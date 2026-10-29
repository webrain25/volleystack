import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import VolleyLogo from './VolleyLogo';

export default function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-[#070B12] border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand Col */}
          <div className="space-y-6">
            <Link to="/" className="inline-block transition-transform hover:scale-105">
              <VolleyLogo size="md" />
            </Link>
            <p className="text-sm text-text-tertiary leading-relaxed max-w-xs mt-4">
              L'hub avanzato per le performance della tua squadra. Gestisci eventi, statistiche, finanze e molto altro in un'unica piattaforma integrata.
            </p>
          </div>

          {/* Links Col 1 */}
          <div>
            <h4 className="font-bold text-text-primary mb-6">Piattaforma</h4>
            <ul className="space-y-4">
              <li><Link to="/dashboard" className="text-sm text-text-secondary hover:text-[#38BDF8] transition-colors">Dashboard</Link></li>
              <li><Link to="/events" className="text-sm text-text-secondary hover:text-[#38BDF8] transition-colors">Calendario & Eventi</Link></li>
              <li><Link to="/team" className="text-sm text-text-secondary hover:text-[#38BDF8] transition-colors">Gestione Squadra</Link></li>
              <li><Link to="/stats" className="text-sm text-text-secondary hover:text-[#38BDF8] transition-colors">Statistiche</Link></li>
              <li><Link to="/treasury" className="text-sm text-text-secondary hover:text-[#38BDF8] transition-colors">Finanze & Cassa</Link></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div>
            <h4 className="font-bold text-text-primary mb-6">Risorse</h4>
            <ul className="space-y-4">
              <li><Link to="/support" className="text-sm text-text-secondary hover:text-[#38BDF8] transition-colors">Centro Assistenza</Link></li>
              <li><Link to="/guides" className="text-sm text-text-secondary hover:text-[#38BDF8] transition-colors">Guide e Tutorial</Link></li>
              <li>
                <div className="flex items-center text-sm text-text-tertiary cursor-not-allowed">
                  Blog <span className="ml-2 px-2.5 py-0.5 text-[10px] bg-[#38BDF8]/15 text-[#38BDF8] border border-[#2A7EA2]/30 font-bold rounded-full uppercase tracking-wider shadow-[0_0_8px_rgba(56,189,248,0.2)]">In Arrivo</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="font-bold text-text-primary mb-6">Contattaci</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-sm text-text-secondary">
                <Mail className="h-5 w-5 text-[#38BDF8] shrink-0" />
                <span>support@volleystack.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-3">
            <img src="/webrain25.jpg" alt="Webrain25" className="h-6 w-6 rounded-md object-cover shadow-sm" />
            <span className="text-xs font-semibold tracking-wider text-text-tertiary uppercase">Powered by WEBRAIN25</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-xs text-text-tertiary">
            <Link to="/terms" className="hover:text-text-primary transition-colors">Termini di Servizio</Link>
            <Link to="/privacy" className="hover:text-text-primary transition-colors">Informativa sulla Privacy</Link>
            <Link to="/cookie-policy" className="hover:text-text-primary transition-colors">Cookie Policy</Link>
            <span>&copy; {new Date().getFullYear()} VolleyStack. Tutti i diritti riservati.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
