import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Check, X, Settings2 } from 'lucide-react';
import { initConsentMode } from '../lib/tracking';

interface CookieConsentBannerProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({
  onOpenPrivacy,
  onOpenTerms,
}) => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    initConsentMode();
    const consent = localStorage.getItem('loops_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setShowBanner(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('loops_cookie_consent', 'all');
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        ad_storage: 'granted',
        analytics_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
      });
    }
    setShowBanner(false);
  };

  const handleAcceptEssential = () => {
    localStorage.setItem('loops_cookie_consent', 'essential');
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        ad_storage: 'denied',
        analytics_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
    }
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <aside
      aria-label="Consentimento de Cookies e Privacidade"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-lg z-50 p-5 rounded-2xl bg-[#080c14]/95 border border-cyan-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-start gap-3.5">
        <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
              <span>Privacidade & LGPD · Consent Mode v2</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </h3>
            <button
              onClick={handleAcceptEssential}
              className="text-neutral-400 hover:text-white p-1"
              title="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed font-sans">
            Utilizamos cookies e telemetria server-side criptografada com SHA-256 para otimizar sua navegação, personalizar soluções de IA e garantir total conformidade com a LGPD e diretrizes de tráfego pago da Meta e Google.
          </p>

          <div className="flex items-center gap-3 text-[11px] font-mono text-cyan-400 pt-1">
            <button onClick={onOpenPrivacy} className="hover:underline">
              Política de Privacidade
            </button>
            <span className="text-neutral-600">·</span>
            <button onClick={onOpenTerms} className="hover:underline">
              Termos de Uso
            </button>
          </div>

          <div className="flex items-center gap-2.5 pt-2">
            <button
              onClick={handleAcceptAll}
              className="flex-1 py-2 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-all shadow-md active:scale-[0.98]"
            >
              Aceitar Todos
            </button>
            <button
              onClick={handleAcceptEssential}
              className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 text-xs font-medium transition-colors"
            >
              Apenas Essenciais
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
