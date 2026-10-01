import React from 'react';
import { ArrowRight, Terminal, Cpu, Radio, Sparkles } from 'lucide-react';
import { HERO_IMAGE } from '../data/mockData';

interface HeroProps {
  onOpenCrm: () => void;
  onOpenQuote: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenCrm, onOpenQuote }) => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Subtle background ambient radial gradient */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-cyan-950/20 via-blue-900/10 to-transparent blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Editorial Subtitle / Domain Kicker */}
        <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-cyan-400 mb-4 uppercase">
          <span>Loops Digital</span>
          <span aria-hidden="true">·</span>
          <span>Engenharia de Software & IA Sênior</span>
          <span aria-hidden="true">·</span>
          <span>Arquitetura de Alto Impacto</span>
        </div>

        {/* Primary Headline with text-wrap: balance */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white font-display max-w-5xl leading-[1.08] mb-6 [text-wrap:balance]">
          Inteligência Artificial, Automação & Tráfego de Alta Densidade.
        </h1>

        {/* Concrete Value Proposition (No generic SaaS slop) */}
        <p className="text-lg sm:text-xl text-neutral-300 max-w-3xl leading-relaxed mb-8 font-normal">
          Desenvolvemos agentes autônomos de I.A conectados diretamente às suas redes sociais, CRMs sob medida, aplicativos móveis de alta escala e esteiras de conversão server-side que multiplicam o faturamento de operações líderes.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 mb-14">
          <button
            onClick={onOpenQuote}
            className="flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-black bg-white hover:bg-neutral-200 rounded-xl transition-all duration-200 shadow-lg shadow-white/5 active:scale-[0.98] whitespace-nowrap"
          >
            <span>Iniciar Projeto Técnico</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>

          <button
            onClick={onOpenCrm}
            className="flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-neutral-200 bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/80 rounded-xl transition-all duration-200 hover:border-neutral-500 whitespace-nowrap"
          >
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Abrir CRM Administrativo</span>
          </button>
        </div>

        {/* Proof Ribbon - Clean unboxed text with typographic separators */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm font-medium text-neutral-400 border-t border-white/[0.08] pt-6 mb-12">
          <span className="text-neutral-200 font-semibold">+R$ 18.4M Faturamento Gerado</span>
          <span aria-hidden="true" className="text-neutral-600">·</span>
          <span>+450k Leads Qualificados</span>
          <span aria-hidden="true" className="text-neutral-600">·</span>
          <span className="text-cyan-300">Infraestrutura Oficial COP 30 Belém</span>
          <span aria-hidden="true" className="text-neutral-600">·</span>
          <span>Tempo de Resposta em IA &lt; 8s</span>
        </div>

        {/* Apple-style Titanium Visual Showcase Container */}
        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0a0d14] shadow-2xl">
          <div className="aspect-[16/9] w-full max-h-[580px] overflow-hidden relative">
            <img
              src={HERO_IMAGE}
              alt="Loops Digital Visual Sculpture - Futuristic AI Architecture"
              className="w-full h-full object-cover object-center scale-100 hover:scale-[1.02] transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            {/* Scrim Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#060709] via-transparent to-black/20 pointer-events-none" />

            {/* Apple-style Interactive Telemetry Cards floating inside the showcase */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-neutral-900 flex items-center justify-center border border-white/10">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <div className="text-xs text-neutral-400 font-mono">ARQUITETURA CORE</div>
                  <div className="text-sm font-semibold text-white">Loops Multi-Agent Neural Engine v2.6</div>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs text-neutral-300 font-mono">
                <div>
                  <span className="text-neutral-500">CONEXÕES: </span>
                  <span className="text-emerald-400">4 Redes Ativas</span>
                </div>
                <div>
                  <span className="text-neutral-500">LATÊNCIA: </span>
                  <span className="text-cyan-400">38ms P95</span>
                </div>
                <div>
                  <span className="text-neutral-500">COP 30 STACK: </span>
                  <span className="text-white">Operacional</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
