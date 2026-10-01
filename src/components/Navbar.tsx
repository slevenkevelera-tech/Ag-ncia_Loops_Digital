import React, { useState } from 'react';
import { ShieldCheck, Menu, X, Terminal, Sparkles, Mic, MessageSquare } from 'lucide-react';

interface NavbarProps {
  onOpenCrm: () => void;
  onOpenQuote: () => void;
  onOpenVoice: () => void;
  onOpenChat: () => void;
  isGoogleAuthenticated: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCrm,
  onOpenQuote,
  onOpenVoice,
  onOpenChat,
  isGoogleAuthenticated,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.08] bg-[#060709]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a href="#" className="text-xl font-bold tracking-tight text-white font-display flex items-center gap-2 hover:opacity-90 transition-opacity">
          <span>Loops Digital</span>
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-300">
          <a href="#solucoes" className="hover:text-white transition-colors">Soluções</a>
          <a href="#cop30-bio" className="hover:text-white transition-colors">Cases & COP 30</a>
          <a href="#google-grounding" className="hover:text-white transition-colors">Grounding IA</a>
          <a href="#tech-news" className="hover:text-white transition-colors flex items-center gap-1.5">
            <span>Tech News</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          </a>
          <a href="#depoimentos" className="hover:text-white transition-colors">Resultados</a>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenVoice}
            title="Conversar por Voz (Gemini-3.8-Live)"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 rounded-lg transition-all whitespace-nowrap"
          >
            <Mic className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="hidden sm:inline">Voz ao Vivo</span>
          </button>

          <button
            onClick={onOpenChat}
            title="Chatbot Gemini Multi-turn"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-200 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 rounded-lg transition-all whitespace-nowrap"
          >
            <MessageSquare className="w-3.5 h-3.5 text-neutral-400" />
            <span className="hidden sm:inline">Chat IA</span>
          </button>

          <button
            onClick={onOpenCrm}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-neutral-200 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 rounded-lg transition-all duration-200 hover:border-neutral-500 whitespace-nowrap"
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${isGoogleAuthenticated ? 'text-emerald-400' : 'text-neutral-400'}`} />
            <span>CRM</span>
          </button>

          <button
            onClick={onOpenQuote}
            className="hidden lg:inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-black bg-white hover:bg-neutral-200 rounded-lg transition-all duration-200 shadow-sm whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>Proposta</span>
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-400 hover:text-white"
            aria-label="Abrir Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-800 bg-[#07090e] px-6 py-4 space-y-3">
          <a
            href="#solucoes"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-neutral-300 hover:text-white py-1"
          >
            Soluções
          </a>
          <a
            href="#cop30-bio"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-neutral-300 hover:text-white py-1"
          >
            Cases & COP 30
          </a>
          <a
            href="#google-grounding"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-neutral-300 hover:text-white py-1"
          >
            Grounding Google (Search & Maps)
          </a>
          <a
            href="#tech-news"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-neutral-300 hover:text-white py-1"
          >
            Tech News API
          </a>
          <a
            href="#depoimentos"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-neutral-300 hover:text-white py-1"
          >
            Resultados & Clientes
          </a>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenVoice();
              }}
              className="w-full text-center px-4 py-2 text-xs font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 rounded-lg flex items-center justify-center gap-2"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Modo Voz (Live API gemini-3.8-live)</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenChat();
              }}
              className="w-full text-center px-4 py-2 text-xs font-semibold text-neutral-200 bg-neutral-900 border border-neutral-700 rounded-lg flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chatbot Gemini</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuote();
              }}
              className="w-full text-center px-4 py-2 text-xs font-semibold text-black bg-white rounded-lg"
            >
              Solicitar Proposta
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
