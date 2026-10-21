import React, { useState } from 'react';
import { Bot, Database, Zap, Smartphone, Globe, CheckCircle2, ChevronRight, Layers, ArrowUpRight } from 'lucide-react';
import { OMNICHANNEL_IMAGE, COP30_IMAGE } from '../data/mockData';

interface TechShowcaseProps {
  onOpenCrm: () => void;
  onOpenQuote: () => void;
}

export const TechShowcase: React.FC<TechShowcaseProps> = ({ onOpenCrm, onOpenQuote }) => {
  const [activeTab, setActiveTab] = useState<'agents' | 'crm' | 'traffic' | 'mobile' | 'cop30'>('agents');

  const capabilities = [
    {
      id: 'agents' as const,
      number: '01',
      title: 'Agentes de IA Autônomos',
      shortDesc: 'Atendimento instantâneo em Instagram, WhatsApp e LinkedIn.',
      badge: 'Multicanal 24/7',
      icon: Bot,
    },
    {
      id: 'crm' as const,
      number: '02',
      title: 'CRM Omnichannel Proprietário',
      shortDesc: 'Google OAuth, esteira unificada e qualificação preditiva.',
      badge: 'Bespoke Software',
      icon: Database,
    },
    {
      id: 'traffic' as const,
      number: '03',
      title: 'Tráfego Pago & CAPI Server-Side',
      shortDesc: 'Machine Learning para LTV e campanhas de escala 7 dígitos.',
      badge: 'Performance Real',
      icon: Zap,
    },
    {
      id: 'mobile' as const,
      number: '04',
      title: 'Web & Aplicativos Android',
      shortDesc: 'Kotlin nativo, Jetpack e ecossistemas web de alta vazão.',
      badge: 'Mobile Engineering',
      icon: Smartphone,
    },
    {
      id: 'cop30' as const,
      number: '05',
      title: 'Soluções Críticas & COP 30',
      shortDesc: 'Telemetria ambiental e arquitetura de dados imutável.',
      badge: 'ONU / Amazônia',
      icon: Globe,
    },
  ];

  return (
    <section id="solucoes" className="py-24 border-t border-white/[0.06] bg-[#07090e]/50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-mono text-cyan-400 tracking-wider uppercase mb-2">
            Capacidades de Engenharia
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-display mb-4">
            Construído para operações que não toleram limites.
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg">
            Combinamos inteligência artificial de última geração, data engineering e código de nível enterprise para resolver gargalos reais de receita e escala.
          </p>
        </div>

        {/* Interactive Segmented Tabs (Apple style) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 p-1.5 bg-neutral-900/60 rounded-2xl border border-white/[0.08] mb-8">
          {capabilities.map((cap) => {
            const Icon = cap.icon;
            const isActive = activeTab === cap.id;
            return (
              <button
                key={cap.id}
                onClick={() => setActiveTab(cap.id)}
                className={`text-left p-3.5 rounded-xl transition-all duration-200 flex flex-col justify-between ${
                  isActive
                    ? 'bg-neutral-800 text-white shadow-md border border-white/10'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-neutral-500 font-semibold">{cap.number}</span>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-neutral-500'}`} />
                </div>
                <div className="text-xs sm:text-sm font-semibold tracking-tight text-white mb-1">
                  {cap.title}
                </div>
                <div className="text-[11px] text-neutral-400 line-clamp-1">
                  {cap.badge}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Tab Detailed Showcase Stage */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c1017] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          {activeTab === 'agents' && (
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                  <span>01. AGENTES DE IA MULTIMODAIS</span>
                  <span aria-hidden="true">·</span>
                  <span>TEMPO MÉDIO DE RESPOSTA: 6s</span>
                </div>
                <h3 className="text-2xl sm:text-4xl font-bold text-white font-display">
                  Atendimento e qualificação autônoma no Instagram, WhatsApp e LinkedIn.
                </h3>
                <p className="text-neutral-300 leading-relaxed text-sm sm:text-base">
                  Seus clientes em potencial não querem esperar 3 horas por uma resposta no direct. Criamos agentes com modelos neurais treinados na sua proposta de valor que conversam naturalmente, entendem áudios, filtram orçamentos desqualificados e marcam reuniões no seu Google Calendar instantaneamente.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-neutral-300">
                      <strong className="text-white">Conexão Oficial com as 4 Maiores Redes:</strong> Webhooks nativos do Instagram Graph API, WhatsApp Cloud API, LinkedIn B2B e X.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-neutral-300">
                      <strong className="text-white">Lead Scoring Inteligente:</strong> O agente avalia poder aquisitivo, urgência e perfil da empresa antes de transferir ao consultor.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-neutral-300">
                      <strong className="text-white">Alimentação Direta no CRM:</strong> Cada diálogo gera uma ficha enriquecida com intenção de compra e resumo executivo.
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                  <a
                    href="#ai-simulator"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-black bg-white hover:bg-neutral-200 rounded-lg transition-colors"
                  >
                    <span>Testar Simulador ao Vivo</span>
                    <ChevronRight className="w-4 h-4 text-black" />
                  </a>
                  <button
                    onClick={onOpenCrm}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-lg transition-colors"
                  >
                    <span>Ver Painel no CRM</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-xl border border-white/10 bg-[#090c12] p-5 shadow-lg relative">
                  <div className="text-xs font-mono text-neutral-400 pb-3 border-b border-white/10 flex items-center justify-between">
                    <span>SIMULAÇÃO DE ENTRADA MULTICANAL</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      ONLINE
                    </span>
                  </div>

                  {/* Mock live conversation bubble */}
                  <div className="space-y-4 py-4">
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-pink-600/20 text-pink-400 border border-pink-500/30 flex items-center justify-center text-xs font-mono">
                        IG
                      </div>
                      <div className="bg-neutral-900 border border-white/10 rounded-2xl rounded-tl-none p-3 text-xs text-neutral-200 max-w-[85%]">
                        <div className="text-[10px] text-neutral-400 font-mono mb-1">@diretora.clinica · Direct</div>
                        Olá! Gostaria de saber como a Loops pode automatizar o atendimento dos nossos pacientes de cirurgia plástica. Temos 400 DMs/dia.
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 justify-end">
                      <div className="bg-cyan-950/40 border border-cyan-500/30 rounded-2xl rounded-tr-none p-3 text-xs text-cyan-100 max-w-[85%]">
                        <div className="text-[10px] text-cyan-400 font-mono mb-1">LOOPS AI AGENT · 4.8s resposta</div>
                        Olá Doutora! Desenvolvemos agentes autônomos com triagem médica confidencial que já agendam consultas e integram ao prontuário. Nosso case na área elevou o faturamento em 312%. Posso reservar um slot na quinta às 15h com nosso Engenheiro Sênior?
                      </div>
                      <div className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center justify-center text-xs font-mono">
                        AI
                      </div>
                    </div>
                  </div>

                  <div className="bg-neutral-950/80 p-3 rounded-lg border border-white/5 text-[11px] font-mono text-neutral-400 flex items-center justify-between">
                    <span>SCORE DE QUALIFICAÇÃO:</span>
                    <span className="text-emerald-400 font-bold">96/100 (HIGH INTENT)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'crm' && (
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                  <span>02. CRM OMNICHANNEL PROPRIETÁRIO</span>
                  <span aria-hidden="true">·</span>
                  <span>OAUTH GOOGLE NATIVO</span>
                </div>
                <h3 className="text-2xl sm:text-4xl font-bold text-white font-display">
                  Toda a sua operação comercial em uma visão unificada.
                </h3>
                <p className="text-neutral-300 leading-relaxed text-sm sm:text-base">
                  Chega de assinar múltiplos softwares que não conversam entre si. Criamos sistemas de CRM customizados com autenticação segura Google OAuth, esteira Kanban dinâmica, gestão de tags e monitoramento de conversão em tempo real.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-white/5">
                    <div className="text-xs font-mono text-cyan-400 mb-1">GOOGLE OAUTH & SYNC</div>
                    <div className="text-xs text-neutral-300">Login sem senhas frágeis, sincronização de contatos e agendamentos no Google Calendar.</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-white/5">
                    <div className="text-xs font-mono text-cyan-400 mb-1">PIPELINE AUTÔNOMO</div>
                    <div className="text-xs text-neutral-300">Movimentação automática de estágios conforme o lead responde e atinge o score de compra.</div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={onOpenCrm}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-black bg-white hover:bg-neutral-200 rounded-lg transition-colors"
                  >
                    <span>Acessar Demonstração do CRM</span>
                    <ArrowUpRight className="w-4 h-4 text-black" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-xl border border-white/10 bg-[#090c12] p-5 shadow-lg">
                  <div className="text-xs font-mono text-neutral-400 pb-3 border-b border-white/10 flex items-center justify-between">
                    <span>ESTEIRA DE VENDAS (KANBAN PREVIEW)</span>
                    <span className="text-cyan-400 text-[11px]">R$ 290.000 PIPELINE</span>
                  </div>
                  <div className="space-y-3 py-3">
                    <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-700/60 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-white">Logix Amazônia Transportes</div>
                        <div className="text-[11px] text-neutral-400">Origem: WhatsApp API · Score 98</div>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-400 font-semibold">Proposta R$ 120k</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-700/60 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-white">BioHealth Clínicas Premium</div>
                        <div className="text-[11px] text-neutral-400">Origem: Instagram Direct · Score 94</div>
                      </div>
                      <span className="text-[11px] font-mono text-cyan-400 font-semibold">Qualificado R$ 45k/m</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-700/60 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-white">Nexus Capital Partners</div>
                        <div className="text-[11px] text-neutral-400">Origem: LinkedIn B2B · Score 89</div>
                      </div>
                      <span className="text-[11px] font-mono text-purple-400 font-semibold">Negociação R$ 60k</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'traffic' && (
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                  <span>03. TRÁFEGO PAGO DE ALTA DENSIDADE</span>
                  <span aria-hidden="true">·</span>
                  <span>CAPI SERVER-SIDE & IA</span>
                </div>
                <h3 className="text-2xl sm:text-4xl font-bold text-white font-display">
                  Algoritmos preditivos que maximizam o retorno sobre investimento (ROAS).
                </h3>
                <p className="text-neutral-300 leading-relaxed text-sm sm:text-base">
                  Não rodamos apenas anúncios convencionais. Desenvolvemos esteiras de dados com APIs de conversão no servidor (Meta CAPI e Google Enhanced Conversions), alimentadas por modelos que prevêem o Lifetime Value do cliente antes da concorrência dar o lance.
                </p>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-neutral-900/60 border border-white/5">
                    <div className="text-xl font-bold text-white font-mono">4.8x</div>
                    <div className="text-[11px] text-neutral-400">ROAS Médio Histórico</div>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-900/60 border border-white/5">
                    <div className="text-xl font-bold text-white font-mono">-54%</div>
                    <div className="text-[11px] text-neutral-400">Custo por Lead Qualificado</div>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-900/60 border border-white/5">
                    <div className="text-xl font-bold text-white font-mono">99.7%</div>
                    <div className="text-[11px] text-neutral-400">Precisão de Rastreio Server-Side</div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={onOpenQuote}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-black bg-white hover:bg-neutral-200 rounded-lg transition-colors"
                  >
                    <span>Auditar Nossas Campanhas</span>
                    <ChevronRight className="w-4 h-4 text-black" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-xl border border-white/10 bg-[#090c12] p-5 shadow-lg">
                  <div className="text-xs font-mono text-neutral-400 pb-3 border-b border-white/10 flex items-center justify-between">
                    <span>CLUSTER DE CONVERSÃO SERVER-SIDE</span>
                    <span className="text-emerald-400 font-mono text-[11px]">100% CAPI MATCH</span>
                  </div>
                  <div className="py-4 space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between text-neutral-300">
                      <span>Meta Conversion API:</span>
                      <span className="text-emerald-400">Event Quality 9.8/10</span>
                    </div>
                    <div className="flex items-center justify-between text-neutral-300">
                      <span>Google Ads Smart Bidding:</span>
                      <span className="text-cyan-400">Algoritmo LTV Ativo</span>
                    </div>
                    <div className="flex items-center justify-between text-neutral-300">
                      <span>Perda de Dados por Bloqueadores:</span>
                      <span className="text-white">0% (Server-to-Server)</span>
                    </div>
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-neutral-400">
                      <span>Receita Atribuída no Mês:</span>
                      <span className="text-white font-bold text-sm">R$ 1.840.500</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'mobile' && (
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                  <span>04. ENGENHARIA MOBILE & WEB</span>
                  <span aria-hidden="true">·</span>
                  <span>KOTLIN JETPACK & REACT</span>
                </div>
                <h3 className="text-2xl sm:text-4xl font-bold text-white font-display">
                  Aplicativos Android e plataformas web construídos para performance extrema.
                </h3>
                <p className="text-neutral-300 leading-relaxed text-sm sm:text-base">
                  Construímos aplicações nativas para ecossistemas Android e web apps modernos orientados a eventos. Cada tela é desenhada com precisão estética no padrão Apple, garantindo taxas de retenção e usabilidade incomparáveis.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 text-sm text-neutral-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>Android Nativo (Kotlin / Jetpack Compose / Coroutines)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>Modo Offline-First com sincronização em background</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>Websites e Web Apps com arquitetura serverless de baixa latência</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-xl border border-white/10 bg-[#090c12] p-5 shadow-lg">
                  <div className="text-xs font-mono text-neutral-400 pb-3 border-b border-white/10">
                    ANDROID ARCHITECTURE MATRIX
                  </div>
                  <div className="py-4 space-y-2 text-xs font-mono text-neutral-300">
                    <div className="p-2 rounded bg-neutral-900 border border-white/5 flex justify-between">
                      <span>UI Toolkit:</span>
                      <span className="text-white">Jetpack Compose</span>
                    </div>
                    <div className="p-2 rounded bg-neutral-900 border border-white/5 flex justify-between">
                      <span>On-Device AI:</span>
                      <span className="text-cyan-400">TensorFlow Lite / Gemini Nano</span>
                    </div>
                    <div className="p-2 rounded bg-neutral-900 border border-white/5 flex justify-between">
                      <span>Frame Rate:</span>
                      <span className="text-emerald-400">120 FPS Fluid Motion</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cop30' && (
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                  <span>05. SOLUÇÕES CRÍTICAS & CASE COP 30</span>
                  <span aria-hidden="true">·</span>
                  <span>BELÉM / AMAZÔNIA</span>
                </div>
                <h3 className="text-2xl sm:text-4xl font-bold text-white font-display">
                  Engenharia de dados que suportou a maior conferência climática do planeta.
                </h3>
                <p className="text-neutral-300 leading-relaxed text-sm sm:text-base">
                  Desenvolvemos a camada de telemetria satelital e inteligência climática utilizada durante os preparativos e a realização da COP 30 em Belém do Pará. Uma infraestrutura tolerante a falhas na Amazônia, capaz de processar milhões de registros geoespaciais em tempo real.
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-300">
                  <div className="px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400">
                    99.998% Uptime Registrado
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-400">
                    45k Sensores IoT Integrados
                  </div>
                </div>

                <div className="pt-4">
                  <a
                    href="#cop30-bio"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-black bg-white hover:bg-neutral-200 rounded-lg transition-colors"
                  >
                    <span>Ver Estudo de Caso Completo</span>
                    <ChevronRight className="w-4 h-4 text-black" />
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-xl overflow-hidden border border-white/10 relative">
                  <img
                    src={COP30_IMAGE}
                    alt="COP 30 Telemetry Center"
                    className="w-full h-56 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="p-3 bg-neutral-950/90 border-t border-white/10 text-xs font-mono flex items-center justify-between">
                    <span className="text-neutral-400">NÚCLEO CLIMÁTICO COP 30</span>
                    <span className="text-emerald-400">ESTÁVEL</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
