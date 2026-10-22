import React from 'react';
import { ArrowRight, Terminal, Cpu, Radio, Sparkles, Bot, Link } from 'lucide-react';
import { AiShowcaseCarousel } from './AiShowcaseCarousel';
import { Neural3DBackground } from './Neural3DBackground';

interface HeroProps {
  onOpenCrm: () => void;
  onOpenQuote: () => void;
  onOpenExternalAgents: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenCrm, onOpenQuote, onOpenExternalAgents }) => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* 3D WebGL Neural Network Animation in Three.js (non-intrusive ambient depth) */}
      <Neural3DBackground />

      {/* Subtle background ambient radial gradient to ensure dark backdrop & 100% text readability */}
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

          <button
            onClick={onOpenExternalAgents}
            className="flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-500/40 rounded-xl transition-all duration-200 hover:border-cyan-400 shadow-lg shadow-cyan-500/5 whitespace-nowrap"
          >
            <Bot className="w-4 h-4 text-cyan-400" />
            <span>Conectar Agentes Externos (OAuth)</span>
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

        {/* 4K AI Showcase Carousel with 4 Impactful Modern AI Themes & Live Simulator */}
        <AiShowcaseCarousel />
      </div>
    </section>
  );
};
