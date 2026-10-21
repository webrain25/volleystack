import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function DocumentPage({ title, lastUpdated, children }: { title: string, lastUpdated: string, children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary overflow-x-hidden flex flex-col">
      {/* Simple Public Navbar */}
      <nav className="w-full bg-surface/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl overflow-hidden shadow-sm">
              <img src="/logo.jpg" alt="VolleyStack Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-xl tracking-tight">VolleyStack</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors px-4 py-2 hidden sm:block">
              Accedi
            </Link>
            <Link to="/register" className="bg-brand-blue text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-sm hover:bg-brand-blue-bright transition-colors">
              Inizia Gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Content Header */}
      <div className="bg-surface border-b border-border py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">{title}</h1>
          <p className="text-text-tertiary">Ultimo aggiornamento: {lastUpdated}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow max-w-3xl mx-auto px-6 py-12 w-full">
        <div className="prose prose-blue dark:prose-invert max-w-none text-text-secondary">
          {children}
        </div>
      </div>

      <Footer />
    </div>
  );
}
