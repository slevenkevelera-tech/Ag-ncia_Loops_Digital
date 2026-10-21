import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onOpenCrm: () => void;
  onOpenQuote: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCrm, onOpenQuote }) => {
  return (
    <footer className="border-t border-white/[0.08] bg-[#050608] text-neutral-400 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/[0.06]">
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <div className="text-xl font-bold tracking-tight text-white font-display">
              Loops Digital
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              Agência digital e estúdio de engenharia fundado por Engenheiro de Software Sênior. Especializada em Inteligência Artificial, Agentes Autônomos multicanais, CRMs sob medida, Tráfego Pago de alta densidade e aplicações críticas como a COP 30.
            </p>
            <div className="text-[11px] font-mono text-neutral-500">
              PADRÃO APPLE DE INTERFACE · RESPOSTA &lt; 8S EM IA
            </div>
          </div>

          {/* Navigation Mirrors */}
          <div className="md:col-span-2 space-y-3">
            <div className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              Soluções
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#solucoes" className="hover:text-white transition-colors">
                  Agentes de IA
                </a>
              </li>
              <li>
                <a href="#solucoes" className="hover:text-white transition-colors">
                  CRM Omnichannel
                </a>
              </li>
              <li>
                <a href="#solucoes" className="hover:text-white transition-colors">
                  Tráfego & CAPI
                </a>
              </li>
              <li>
                <a href="#solucoes" className="hover:text-white transition-colors">
                  Android & Web
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              Projetos & Dados
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#cop30-bio" className="hover:text-white transition-colors">
                  Case Oficial COP 30 Belém
                </a>
              </li>
              <li>
                <a href="#tech-news" className="hover:text-white transition-colors">
                  Radar Tech News API
                </a>
              </li>
              <li>
                <a href="#depoimentos" className="hover:text-white transition-colors">
                  Depoimentos de Faturamento
                </a>
              </li>
              <li>
                <a href="#ai-simulator" className="hover:text-white transition-colors">
                  Simulador de Agente
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              Acesso Executivo
            </div>
            <div className="space-y-2">
              <button
                onClick={onOpenCrm}
                className="w-full text-left py-2 px-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-xs text-white border border-white/5 flex items-center justify-between"
              >
                <span>Painel CRM (Google OAuth)</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
              </button>
              <button
                onClick={onOpenQuote}
                className="w-full text-left py-2 px-3 rounded-lg bg-white hover:bg-neutral-200 text-xs text-black font-semibold flex items-center justify-between"
              >
                <span>Solicitar Proposta Técnica</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-black" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-500">
          <div>
            © {new Date().getFullYear()} Loops Digital. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-4">
            <span>Privacidade & LGPD</span>
            <span aria-hidden="true">·</span>
            <span>Segurança Server-Side</span>
            <span aria-hidden="true">·</span>
            <span>São Paulo / Belém, Brasil</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
