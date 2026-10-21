import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Play, Pause, Cpu, ShieldCheck, Sparkles, Orbit, Radio, Zap } from 'lucide-react';
import { BlackHoleSimulation } from './BlackHoleSimulation';
import aiDatacenterImage from '../assets/images/ai_datacenter_cop30_1792581694517.jpg';
import aiAgentsImage from '../assets/images/ai_autonomous_agents_1792581695351.jpg';
import quantumNeuralImage from '../assets/images/ai_quantum_neural_synapse_1792581695238.jpg';
import cosmicSingularityImage from '../assets/images/ai_cosmic_singularity_1792581695608.jpg';

export interface CarouselSlide {
  id: string;
  title: string;
  category: string;
  subtitle: string;
  imageSrc: string;
  badge: string;
  stats: {
    label: string;
    value: string;
    accentColor: string;
  }[];
}

const SLIDES: CarouselSlide[] = [
  {
    id: 'ai-datacenter',
    category: 'INFRAESTRUTURA VERDE & SUPERCOMPUTAÇÃO',
    title: 'Data Centers de IA Sustentáveis · Hub COP 30 Belém',
    subtitle: 'Arquiteturas de processamento hiper-escalar alimentadas por matrizes limpas, refrigeradas biometricamente para sustentar a próxima geração de modelos fundamentais na Amazônia.',
    imageSrc: aiDatacenterImage,
    badge: 'COP 30 INFRASTRUCTURE',
    stats: [
      { label: 'EFICIÊNCIA PUE', value: '1.08 P99', accentColor: 'text-emerald-400' },
      { label: 'ENERGIA LIMPA', value: '100% Renovável', accentColor: 'text-cyan-400' },
      { label: 'CLUSTERS H100/B200', value: '12.800 Nós', accentColor: 'text-white' },
    ],
  },
  {
    id: 'ai-agents',
    category: 'COCOGNIÇÃO HUMANO-MÁQUINA & AUTONOMIA',
    title: 'Agentes Autônomos Multimodais de Missão Crítica',
    subtitle: 'Sistemas que vão além de prompts passivos: agentes com raciocínio encadeado, tomada de decisão estratégica em tempo real e integração direta aos fluxos executivos das maiores empresas.',
    imageSrc: aiAgentsImage,
    badge: 'AUTONOMOUS REASONING',
    stats: [
      { label: 'TEMPO RESPOSTA', value: '< 800ms', accentColor: 'text-cyan-400' },
      { label: 'PRECISÃO COGNITIVA', value: '99.4%', accentColor: 'text-emerald-400' },
      { label: 'ROUTING DINÂMICO', value: 'Ativo 24/7', accentColor: 'text-white' },
    ],
  },
  {
    id: 'quantum-neural',
    category: 'FRONTEIRA CIENTÍFICA & NEUROTECNOLOGIA',
    title: 'Redes Neurais Quânticas & Bio-Sinapses Sintéticas',
    subtitle: 'Mapeamento de manifolds multidimensionais e backpropagation acelerado, permitindo convergência de pesos em frações de segundo e compreensão semântica profunda.',
    imageSrc: quantumNeuralImage,
    badge: 'QUANTUM SYNAPSE',
    stats: [
      { label: 'PARÂMETROS ATIVOS', value: '1.8 Trilhões', accentColor: 'text-purple-400' },
      { label: 'TOPOLOGIA', value: 'Manifold Quântico', accentColor: 'text-cyan-300' },
      { label: 'RETROPROPAGAÇÃO', value: 'Sub-microssegundo', accentColor: 'text-white' },
    ],
  },
  {
    id: 'cosmic-singularity',
    category: 'SINGULARIDADE & HORIZONTE DE EVENTOS',
    title: 'Singularidade Digital · Atração de Dados Relativística',
    subtitle: 'A convergência inevitável onde dados massivos, automação algorítmica e inteligência artificial formam um horizonte de eventos de produtividade e escala inatingíveis no modelo tradicional.',
    imageSrc: cosmicSingularityImage,
    badge: 'EVENT HORIZON',
    stats: [
      { label: 'DENSIDADE DADOS', value: '100% Cobertura', accentColor: 'text-cyan-400' },
      { label: 'GRAVITAÇÃO DE ESCALA', value: 'ExaFLOPs Tier', accentColor: 'text-amber-400' },
      { label: 'HORIZONTE LUZ', value: 'Fótons em Fuga', accentColor: 'text-white' },
    ],
  },
];

export const AiShowcaseCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showInteractiveShader, setShowInteractiveShader] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = SLIDES.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Autoplay functionality
  useEffect(() => {
    if (isPlaying && !showInteractiveShader) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, 6000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, showInteractiveShader, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showInteractiveShader) return;
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, showInteractiveShader]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const currentSlide = SLIDES[currentIndex];

  return (
    <div
      ref={containerRef}
      className={`relative rounded-3xl overflow-hidden border border-white/10 bg-[#06080d] shadow-2xl transition-all duration-500 group select-none ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen' : 'aspect-[16/9] max-h-[620px]'
      }`}
    >
      {/* If interactive simulation view is enabled, render the 4K Drael WebGL black hole */}
      {showInteractiveShader ? (
        <div className="relative w-full h-full">
          <BlackHoleSimulation className="h-full max-h-none rounded-none border-0" />
          <button
            onClick={() => setShowInteractiveShader(false)}
            className="absolute top-5 right-16 z-20 px-3.5 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/20 text-xs font-mono text-white hover:border-[#00FFC0] hover:text-[#00FFC0] transition-colors flex items-center gap-1.5 shadow-xl"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00FFC0]" />
            <span>Voltar ao Carrossel 4K</span>
          </button>
        </div>
      ) : (
        /* 4K Image Carousel View */
        <div className="relative w-full h-full overflow-hidden">
          {/* Active 4K Image with Smooth Transition */}
          {SLIDES.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentIndex ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'
              }`}
            >
              <img
                src={slide.imageSrc}
                alt={slide.title}
                className="w-full h-full object-cover object-center scale-100 group-hover:scale-[1.015] transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />

              {/* Multi-tier Cinematic Scrim & Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#06080d] via-black/35 to-black/30 pointer-events-none" />
              <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/60 pointer-events-none" />
            </div>
          ))}

          {/* Top Header Badge & Quick Action Toolbar */}
          <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10 pointer-events-auto">
            {/* Left Category & Slide Number */}
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 rounded-md bg-black/80 backdrop-blur-md border border-white/20 text-[11px] font-mono text-cyan-300 font-semibold flex items-center gap-2 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>{currentSlide.badge}</span>
                <span className="text-white/30">|</span>
                <span className="text-white font-mono">{currentIndex + 1} / {totalSlides}</span>
              </div>

              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-neutral-400">
                <span className="text-neutral-500 font-sans">RESOLUÇÃO:</span>
                <span className="text-white font-semibold">4K UHD</span>
              </div>
            </div>

            {/* Right Controls: Interactive Mode, Play/Pause, Fullscreen */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowInteractiveShader(true)}
                className="px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-[#00FFC0]/40 text-xs font-mono text-white hover:border-[#00FFC0] hover:text-[#00FFC0] transition-colors flex items-center gap-1.5 shadow-lg"
                title="Ativar simulação interativa com gravitação via mouse (estilo Drael)"
              >
                <Orbit className="w-3.5 h-3.5 text-[#00FFC0]" />
                <span className="hidden md:inline">Simulador Gravitacional</span>
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-lg bg-black/75 backdrop-blur-md border border-white/15 text-neutral-300 hover:text-white transition-colors"
                title={isPlaying ? 'Pausar rotação automática' : 'Retomar rotação automática'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-lg bg-black/75 backdrop-blur-md border border-white/15 text-neutral-300 hover:text-white transition-colors"
                title={isFullscreen ? 'Sair de tela cheia' : 'Tela cheia'}
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Navigation Arrows on Left and Right (Subtle and Sleek) */}
          <button
            onClick={prevSlide}
            aria-label="Slide anterior"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-black/65 backdrop-blur-md border border-white/15 text-white/80 hover:text-white hover:bg-black/90 hover:scale-105 transition-all flex items-center justify-center opacity-70 group-hover:opacity-100 shadow-xl"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={nextSlide}
            aria-label="Próximo slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-black/65 backdrop-blur-md border border-white/15 text-white/80 hover:text-white hover:bg-black/90 hover:scale-105 transition-all flex items-center justify-center opacity-70 group-hover:opacity-100 shadow-xl"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Bottom Card Overlay: Title, Description & Telemetry Stats */}
          <div className="absolute bottom-5 left-5 right-5 p-5 sm:p-6 rounded-2xl bg-black/80 backdrop-blur-md border border-white/15 z-10 flex flex-col md:flex-row md:items-end justify-between gap-5 shadow-2xl">
            <div className="space-y-1.5 max-w-2xl">
              <div className="text-[10px] sm:text-[11px] font-mono text-cyan-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>{currentSlide.category}</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-bold text-white font-display tracking-tight leading-tight">
                {currentSlide.title}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed line-clamp-2 sm:line-clamp-none">
                {currentSlide.subtitle}
              </p>
            </div>

            {/* Telemetry Stats Column & Slide Thumbnails/Dots */}
            <div className="flex flex-col md:items-end gap-3 shrink-0">
              {/* Stats Ribbon */}
              <div className="flex items-center gap-4 text-xs font-mono bg-neutral-950/70 px-3.5 py-2 rounded-xl border border-white/10">
                {currentSlide.stats.map((stat, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-[9px] text-neutral-400 uppercase">{stat.label}</span>
                    <span className={`text-xs font-bold ${stat.accentColor}`}>{stat.value}</span>
                  </div>
                ))}
              </div>

              {/* Progress Dots with Active Indicator */}
              <div className="flex items-center gap-2">
                {SLIDES.map((slide, idx) => (
                  <button
                    key={slide.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentIndex ? 'w-8 bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]' : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                    title={`Ir para ${slide.title}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
