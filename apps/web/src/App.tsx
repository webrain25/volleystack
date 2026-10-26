import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Home, Users, Calendar, WalletCards, User, Bell, LogOut, Croissant, BarChart2, Sun, Moon } from 'lucide-react';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Team from './pages/Team';
import Treasury from './pages/Treasury';
import Pastes from './pages/Pastes';
import Stats from './pages/Stats';
import Profile from './pages/Profile';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import CookiePolicy from './pages/CookiePolicy';
import Support from './pages/Support';
import Guides from './pages/Guides';
import Footer from './components/Footer';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/useThemeStore';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((state) => state.token);
  if (!token) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
}

export default function App() {
  const { token, user, logout } = useAuthStore();
  const location = useLocation();

  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const isActive = (path: string) => location.pathname.startsWith(path);

  const getBackgroundImage = () => {
    if (location.pathname.startsWith('/treasury')) return '/backgrounds/office.jpg';
    if (location.pathname.startsWith('/stats')) return '/backgrounds/stats.jpg';
    if (location.pathname.startsWith('/team') || location.pathname.startsWith('/profile')) return '/backgrounds/locker_room.jpg';
    return '/backgrounds/court.jpg';
  };

  if (!token) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Landing />} />
        <Route path="/register" element={<Landing />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/support" element={<Support />} />
        <Route path="/guides" element={<Guides />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  // Mobile Bottom Nav Item
  const BottomNavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
    const active = isActive(to) && (to !== '/dashboard' || location.pathname === '/dashboard');
    return (
      <Link 
        to={to} 
        className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200 ${
          active ? 'text-brand-blue' : 'text-text-tertiary hover:text-text-secondary'
        }`}
      >
        <div className="relative flex flex-col items-center justify-center">
          <Icon className={`h-5 w-5 flex-shrink-0 ${active ? 'stroke-[2.5px]' : 'stroke-2'}`} />
          {active && (
            <motion.div 
              layoutId="bottom-nav-indicator"
              className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-blue rounded-full shadow-[0_0_8px_rgba(22,131,255,0.8)]"
            />
          )}
        </div>
        <span className="text-[10px] font-semibold tracking-wide">{label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex flex-col text-text-primary overflow-hidden">
      
      {/* Ambient Animated Background */}
      <div className="ambient-bg-container">
        <motion.div 
          key={getBackgroundImage()}
          initial={{ opacity: 0 }}
          animate={{ opacity: theme === 'dark' ? 0.25 : 0.08 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0"
        >
          <img src={getBackgroundImage()} alt="Background" className="w-full h-full object-cover mix-blend-luminosity" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/50 to-bg-primary z-0"></div>
        <div className="ambient-court-lines"></div>
        <div className="ambient-light-orb"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      {/* Desktop Top Navbar */}
      <nav className="hidden md:flex items-center justify-between h-16 w-full glass-panel border-b border-border sticky top-0 z-40 px-6 transition-all">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-lg flex items-center justify-center mr-3 overflow-hidden">
            <img src="/logo.jpg" alt="VolleyStack Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-lg tracking-tight text-text-primary mr-8">VolleyStack</span>
          
          <div className="flex items-center space-x-1">
            <Link to="/dashboard" className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${isActive('/dashboard') && location.pathname === '/dashboard' ? 'bg-surface border border-border text-text-primary' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'}`}>
              <Home className="h-4 w-4 flex-shrink-0" /> <span>Home</span>
            </Link>
            <Link to="/events" className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${isActive('/events') ? 'bg-surface border border-border text-text-primary' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'}`}>
              <Calendar className="h-4 w-4 flex-shrink-0" /> <span>Calendario</span>
            </Link>
            <Link to="/treasury" className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${isActive('/treasury') ? 'bg-surface border border-border text-text-primary' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'}`}>
              <WalletCards className="h-4 w-4 flex-shrink-0" /> <span>Tax & Cassa</span>
            </Link>
            <Link to="/team" className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${isActive('/team') ? 'bg-surface border border-border text-text-primary' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'}`}>
              <Users className="h-4 w-4 flex-shrink-0" /> <span>Squadra</span>
            </Link>
            <Link to="/pastes" className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${isActive('/pastes') ? 'bg-surface border border-border text-text-primary' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'}`}>
              <Croissant className="h-4 w-4 flex-shrink-0" /> <span>Paste</span>
            </Link>
            <Link to="/stats" className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${isActive('/stats') ? 'bg-surface border border-border text-text-primary' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'}`}>
              <BarChart2 className="h-4 w-4 flex-shrink-0" /> <span>Statistiche</span>
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button onClick={toggleTheme} className="h-8 w-8 flex items-center justify-center text-text-secondary hover:text-text-primary rounded-full transition-colors hover:bg-surface border border-transparent hover:border-border">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          
          <button onClick={logout} className="h-8 w-8 flex items-center justify-center text-text-secondary hover:text-danger rounded-full transition-colors hover:bg-danger/10">
            <LogOut className="h-4 w-4" />
          </button>

          <Link to="/profile" className="flex items-center hover:bg-surface-hover rounded-xl py-1 px-2 transition-colors cursor-pointer border border-transparent hover:border-border ml-1">
            <div className="h-8 w-8 rounded-full bg-surface border border-border flex items-center justify-center text-sm font-bold text-text-primary">
              {user?.name?.[0]?.toUpperCase() || user?.email[0].toUpperCase()}
            </div>
            <div className="ml-2 overflow-hidden hidden lg:block">
              <p className="text-sm font-medium text-text-primary truncate max-w-[100px]">{user?.name || 'Utente'}</p>
            </div>
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 relative min-h-screen pb-20 md:pb-0 overflow-y-auto">
        {/* TopBar (Mobile Header) */}
        <header className="md:hidden sticky top-0 z-30 h-14 glass-panel border-b border-border px-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-7 w-7 rounded-md flex items-center justify-center mr-2 overflow-hidden">
              <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-[17px] tracking-tight">VolleyStack</span>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={toggleTheme} className="h-8 w-8 rounded-full bg-surface border border-border flex items-center justify-center text-text-secondary active:scale-95 transition-transform">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button className="h-8 w-8 rounded-full bg-surface border border-border flex items-center justify-center text-text-secondary active:scale-95 transition-transform">
              <Bell className="h-4 w-4" />
            </button>
            <Link to="/profile" className="h-8 w-8 rounded-full bg-surface border border-border flex items-center justify-center text-xs font-bold active:scale-95 transition-transform cursor-pointer">
              {user?.name?.[0]?.toUpperCase()}
            </Link>
          </div>
        </header>

        {/* Page Content with AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, filter: 'blur(8px)', scale: 0.98 }}
            animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(8px)', scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="p-4 md:p-8 max-w-5xl mx-auto h-full"
          >
            <Routes>
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
              <Route path="/team" element={<ProtectedRoute><Team /></ProtectedRoute>} />
              <Route path="/treasury" element={<ProtectedRoute><Treasury /></ProtectedRoute>} />
              <Route path="/pastes" element={<ProtectedRoute><Pastes /></ProtectedRoute>} />
              <Route path="/stats" element={<ProtectedRoute><Stats /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/support" element={<Support />} />
              <Route path="/guides" element={<Guides />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </motion.div>
        </AnimatePresence>

        <Footer />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full h-16 glass-panel border-t border-border z-50 px-2 pb-safe">
        <div className="flex items-center justify-around h-full">
          <BottomNavItem to="/dashboard" icon={Home} label="Home" />
          <BottomNavItem to="/events" icon={Calendar} label="Eventi" />
          <BottomNavItem to="/treasury" icon={WalletCards} label="Tax" />
          <BottomNavItem to="/team" icon={Users} label="Squadra" />
          <BottomNavItem to="/profile" icon={User} label="Profilo" />
        </div>
      </nav>

    </div>
  );
}
