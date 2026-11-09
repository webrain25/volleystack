import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

interface SocialAuthButtonsProps {
  mode: 'login' | 'register';
}

export default function SocialAuthButtons({ mode }: SocialAuthButtonsProps) {
  const [providerNotice, setProviderNotice] = useState<string | null>(null);

  const handleFacebookLogin = () => {
    const fbAppId = import.meta.env.VITE_FACEBOOK_APP_ID || '28923588113936792';
    const redirectUri = `${window.location.origin}/auth/facebook/callback`;
    const fbAuthUrl = `https://www.facebook.com/v20.0/dialog/oauth?client_id=${fbAppId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=email,public_profile&response_type=code`;
    
    // Redirect to official Facebook OAuth dialog
    window.location.href = fbAuthUrl;
  };

  const handleGoogleLogin = () => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!googleClientId) {
      setProviderNotice(
        "L'accesso con Google è pronto nel codice! Serve solo inserire il tuo Google Client ID (ottenibile gratis da Google Cloud Console)."
      );
      return;
    }
    const redirectUri = `${window.location.origin}/auth/google/callback`;
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=openid%20profile%20email&prompt=select_account`;

    window.location.href = googleAuthUrl;
  };

  const handleSocialClick = (provider: string) => {
    if (provider === 'Facebook') {
      handleFacebookLogin();
      return;
    }

    if (provider === 'Google') {
      handleGoogleLogin();
      return;
    }

    setProviderNotice(
      `L'autenticazione diretta con ${provider} richiede un account sviluppatore Apple a pagamento ($99/anno). Per Facebook puoi già accedere con 1 click o usare la registrazione rapida con email!`
    );
  };

  return (
    <div className="space-y-3">
      {/* Notice Dialog if user taps a social button */}
      {providerNotice && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-700 dark:text-amber-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
          <Sparkles className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
          <div className="flex-1 text-left leading-relaxed">
            {providerNotice}
          </div>
          <button
            type="button"
            onClick={() => setProviderNotice(null)}
            className="text-amber-500 hover:text-amber-700 dark:hover:text-amber-200 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3 Social Buttons */}
      <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
        {/* Google Button */}
        <button
          type="button"
          onClick={() => handleSocialClick('Google')}
          className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-white dark:bg-[#0B132B] hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-300 dark:border-white/15 rounded-xl text-slate-800 dark:text-slate-100 text-xs font-bold shadow-xs hover:shadow-sm active:scale-[0.98] transition-all cursor-pointer"
          title="Continua con Google"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span className="truncate">Google</span>
        </button>

        {/* Apple Button */}
        <button
          type="button"
          onClick={() => handleSocialClick('Apple')}
          className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-white dark:bg-[#0B132B] hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-300 dark:border-white/15 rounded-xl text-slate-800 dark:text-slate-100 text-xs font-bold shadow-xs hover:shadow-sm active:scale-[0.98] transition-all cursor-pointer"
          title="Continua con Apple"
        >
          <svg className="w-4 h-4 shrink-0 fill-current text-slate-900 dark:text-white" viewBox="0 0 170 170">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.59-7.79-11.71-14.25-6.3-9.76-11.12-20.94-14.47-33.52-3.35-12.59-5.03-24.32-5.03-35.19 0-16.14 4.09-29.6 12.27-40.38 8.18-10.77 18.39-16.28 30.64-16.53 4.58 0 9.77 1.25 15.58 3.75 5.81 2.5 9.77 3.75 11.89 3.75 1.74 0 5.86-1.29 12.35-3.86 6.5-2.58 11.97-3.72 16.42-3.44 14.59.88 26.24 6.22 34.96 16.03-12.87 7.73-19.16 18.42-18.87 32.07.28 10.66 4.34 19.64 12.18 26.94 7.84 7.3 17.26 11.39 28.26 12.26-2.39 7.42-5.34 14.86-8.86 22.33zm-41.97-106.6c0-6.97 2.56-13.62 7.69-19.95 5.12-6.33 11.44-10.22 18.96-11.66 1.09 7.85-1.14 15.17-6.69 21.96-5.55 6.8-12.2 10.68-19.96 11.65v-2z" />
          </svg>
          <span className="truncate">Apple</span>
        </button>

        {/* Facebook Button */}
        <button
          type="button"
          onClick={() => handleSocialClick('Facebook')}
          className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-white dark:bg-[#0B132B] hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-300 dark:border-white/15 rounded-xl text-slate-800 dark:text-slate-100 text-xs font-bold shadow-xs hover:shadow-sm active:scale-[0.98] transition-all cursor-pointer"
          title="Continua con Facebook"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#1877F2"
              d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
            />
          </svg>
          <span className="truncate">Facebook</span>
        </button>
      </div>

      {/* Divider */}
      <div className="relative flex py-1 items-center">
        <div className="flex-grow border-t border-slate-200 dark:border-white/10" />
        <span className="shrink-0 mx-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          {mode === 'register' ? 'oppure con email' : 'oppure con credenziali'}
        </span>
        <div className="flex-grow border-t border-slate-200 dark:border-white/10" />
      </div>
    </div>
  );
}
