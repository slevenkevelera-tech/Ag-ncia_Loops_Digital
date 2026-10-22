import React, { useState } from 'react';
import {
  TrendingUp,
  Instagram,
  MessageSquare,
  Globe,
  DollarSign,
  Users,
  Target,
  Zap,
  Clock,
  Sparkles,
  Download,
  Filter,
  Layers,
  ChevronRight,
  ArrowUpRight,
  CheckCircle2,
  PieChart,
  BarChart3,
  Calendar,
  Send,
  FileText,
  Calculator,
  RefreshCw,
} from 'lucide-react';
import { CrmLead } from '../types';

interface PowerBiAnalyticsSectionProps {
  leads: CrmLead[];
  onOpenNewLead: () => void;
}

export const PowerBiAnalyticsSection: React.FC<PowerBiAnalyticsSectionProps> = ({
  leads,
  onOpenNewLead,
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d' | 'cop30'>('30d');
  const [selectedChannelSlicer, setSelectedChannelSlicer] = useState<string>('all');
  const [selectedSimulationLeads, setSelectedSimulationLeads] = useState<number>(350);
  const [selectedTicketMedio, setSelectedTicketMedio] = useState<number>(35000);
  const [showProposalModal, setShowProposalModal] = useState<boolean>(false);
  const [proposalClientName, setProposalClientName] = useState<string>('Empresa Líder COP 30');
  const [proposalScope, setProposalScope] = useState<string>('Agentes Autônomos de IA 24/7 + CRM + CAPI Server-side');
  const [proposalValue, setProposalValue] = useState<string>('R$ 48.000,00');
  const [copiedProposal, setCopiedProposal] = useState<boolean>(false);

  // Channels Intelligence Data (Sources of Leads)
  const channelMetrics = [
    {
      id: 'instagram',
      name: 'Instagram Direct & Reels Ads',
      icon: <Instagram className="w-4 h-4 text-pink-400" />,
      leadsCount: 158,
      percentage: 43.8,
      pipelineValue: 225000,
      conversionRate: '32.4%',
      cpl: 'R$ 18,50',
      roas: '14.8x',
      growth: '+46%',
      badge: 'MAIOR VOLUME',
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business API (Agentes 24/7)',
      icon: <MessageSquare className="w-4 h-4 text-emerald-400" />,
      leadsCount: 106,
      percentage: 29.4,
      pipelineValue: 152000,
      conversionRate: '38.2%',
      cpl: 'R$ 12,30',
      roas: '21.4x',
      growth: '+62%',
      badge: 'MAIOR CONVERSÃO',
    },
    {
      id: 'google-maps',
      name: 'Google Maps & Search Grounding (Belém/Amazônia)',
      icon: <Globe className="w-4 h-4 text-blue-400" />,
      leadsCount: 57,
      percentage: 15.8,
      pipelineValue: 86000,
      conversionRate: '26.8%',
      cpl: 'R$ 24,00',
      roas: '11.2x',
      growth: '+88%',
      badge: 'POLO COP 30',
    },
    {
      id: 'meta-capi',
      name: 'Meta Ads Server-Side (CAPI de Alta Densidade)',
      icon: <Target className="w-4 h-4 text-indigo-400" />,
      leadsCount: 27,
      percentage: 7.5,
      pipelineValue: 38000,
      conversionRate: '24.1%',
      cpl: 'R$ 29,80',
      roas: '8.6x',
      growth: '+18%',
      badge: 'QUALIFICAÇÃO ALTA',
    },
    {
      id: 'linkedin',
      name: 'LinkedIn B2B Enterprise & Outbound',
      icon: <Layers className="w-4 h-4 text-cyan-400" />,
      leadsCount: 13,
      percentage: 3.5,
      pipelineValue: 19000,
      conversionRate: '19.5%',
      cpl: 'R$ 65,00',
      roas: '5.2x',
      growth: '+12%',
      badge: 'TICKET ENTERPRISE',
    },
  ];

  // Monthly Revenue Forecasting (Power BI Trend Forecast)
  const revenueForecast = [
    { month: 'Mai/26', realizado: 48000, projetado: 48000, status: 'Fechado' },
    { month: 'Jun/26', realizado: 65000, projetado: 65000, status: 'Fechado' },
    { month: 'Jul/26', realizado: 84500, projetado: 84500, status: 'Mês Atual' },
    { month: 'Ago/26', realizado: null, projetado: 118000, status: 'Projeção Preditiva' },
    { month: 'Set/26', realizado: null, projetado: 165000, status: 'Projeção Preditiva' },
    { month: 'Out/26', realizado: null, projetado: 235000, status: 'Aceleração COP 30' },
    { month: 'Nov/26', realizado: null, projetado: 380000, status: 'Pico COP 30 Belém' },
  ];

  // Client ROI Calculator for Business Scale
  const leadsPerdidosSemIa = Math.round(selectedSimulationLeads * 0.38); // 38% leads lost due to delay
  const faturamentoRecuperado = leadsPerdidosSemIa * 0.15 * selectedTicketMedio; // 15% closed by 24/7 AI agents
  const economiaEquipe = 18000; // Economia em equipe de atendimento humano

  const handleCopyProposal = () => {
    const text = `PROPOSTA TÉCNICA EXECUTIVA — LOOPS DIGITAL\nCliente: ${proposalClientName}\nEscopo: ${proposalScope}\nInvestimento: ${proposalValue}\nGarantia: Entrega em até 14 dias com telemetria 24/7 e agentes conectados às suas redes.\nPolos: Belém/Cametá - PA · Atuação Global.\nContato Direto: Lorenzo Cardoso (Engenheiro Sênior & CTO)`;
    navigator.clipboard.writeText(text);
    setCopiedProposal(true);
    setTimeout(() => setCopiedProposal(false), 2500);
  };

  const handleExportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Rede Social,Leads,Porcentagem,Pipeline Estimado,Taxa de Conversao,CPL,ROAS\n' +
      channelMetrics
        .map(
          (c) =>
            `"${c.name}",${c.leadsCount},"${c.percentage}%","R$ ${c.pipelineValue.toLocaleString('pt-BR')}",${c.conversionRate},"${c.cpl}","${c.roas}"`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `loops_digital_power_bi_relatorio_${selectedTimeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#07090e] text-[#f1f3f7]">
      {/* Power BI Title & Action Ribbon */}
      <div className="p-4 rounded-2xl bg-[#0b0f19] border border-white/10 flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#F2C811]/15 border border-[#F2C811]/30 text-[#F2C811] flex items-center justify-center font-bold font-mono text-sm shadow-sm">
            BI
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white font-display">
                Power BI Executive Cockpit · Inteligência de Tráfego & Projeções
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                LIVE DIRECTQUERY
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Mapeamento em tempo real dos canais que mais geram clientes e modelo preditivo de escala.
            </p>
          </div>
        </div>

        {/* Power BI Action Ribbon Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Time Slicers */}
          <div className="flex items-center bg-black/60 p-1 rounded-xl border border-white/10 text-xs font-mono">
            {(['7d', '30d', '90d', 'cop30'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setSelectedTimeRange(range)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedTimeRange === range
                    ? 'bg-[#118DFF] text-white font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {range === '7d' && 'Últimos 7D'}
                {range === '30d' && 'Últimos 30D'}
                {range === '90d' && 'Trimestre'}
                {range === 'cop30' && 'COP 30 2026'}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowProposalModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold rounded-xl shadow-md transition-all active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gerar Proposta 1-Clique</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-white/10 text-xs font-semibold rounded-xl transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-neutral-400" />
            <span>Exportar CSV / BI</span>
          </button>
        </div>
      </div>

      {/* Top 5 KPI Scorecards (Power BI Metric Tiles) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl bg-[#0a0e18] border border-white/10 relative overflow-hidden group hover:border-[#118DFF]/40 transition-colors">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono mb-1">
            <span>PIPELINE TOTAL</span>
            <DollarSign className="w-4 h-4 text-[#118DFF]" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-display">
            R$ 520.350
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 mt-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+38.4% vs meta anterior</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#118DFF]/40" />
        </div>

        <div className="p-4 rounded-2xl bg-[#0a0e18] border border-white/10 relative overflow-hidden group hover:border-pink-500/40 transition-colors">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono mb-1">
            <span>LEADS QUALIFICADOS</span>
            <Users className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-display">
            361 leads
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono text-pink-300 mt-1">
            <span>43.8% via Instagram Direct</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-pink-500/40" />
        </div>

        <div className="p-4 rounded-2xl bg-[#0a0e18] border border-white/10 relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono mb-1">
            <span>TAXA DE CONVERSÃO</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400 font-display">
            31.8%
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono text-neutral-400 mt-1">
            <span>Benchmark mercado: 6.5%</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500/40" />
        </div>

        <div className="p-4 rounded-2xl bg-[#0a0e18] border border-white/10 relative overflow-hidden group hover:border-[#F2C811]/40 transition-colors">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono mb-1">
            <span>CAC MÉDIO (AQUISIÇÃO)</span>
            <TrendingUp className="w-4 h-4 text-[#F2C811]" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-display">
            R$ 385,00
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 mt-1">
            <span>Redução de 64% com IA</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#F2C811]/40" />
        </div>

        <div className="p-4 rounded-2xl bg-[#0a0e18] border border-white/10 relative overflow-hidden group hover:border-cyan-500/40 transition-colors">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono mb-1">
            <span>TEMPO RESPOSTA IA</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-cyan-300 font-display">
            2.4s
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono text-neutral-400 mt-1">
            <span>Atendimento 24/7 ininterrupto</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-500/40" />
        </div>
      </div>

      {/* Primary BI Section: Lead Generation by Social Channel & Revenue Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 Cols): Social Channel Attribution Visual (As Solicitadas no Prompt) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#0a0e18] border border-white/10 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
              <PieChart className="w-4 h-4" />
              <span>Origem dos Leads por Rede Social (Atribuição Multi-Touch)</span>
            </div>
            <span className="text-[10px] font-mono text-neutral-400 bg-white/5 px-2.5 py-1 rounded">
              TOTAL: 361 LEADS
            </span>
          </div>

          <div className="space-y-4">
            {channelMetrics.map((channel) => (
              <div
                key={channel.id}
                className="p-3.5 rounded-2xl bg-black/40 border border-white/5 hover:border-white/20 transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-neutral-900 border border-white/10">
                      {channel.icon}
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                        <span>{channel.name}</span>
                        <span className="px-2 py-0.5 text-[9px] font-mono font-medium rounded bg-white/10 text-cyan-300 border border-white/10">
                          {channel.badge}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-neutral-400 mt-0.5">
                        {channel.leadsCount} leads · Pipeline: R$ {channel.pipelineValue.toLocaleString('pt-BR')} · CPL: {channel.cpl}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base sm:text-lg font-black text-white font-mono">
                      {channel.percentage}%
                    </div>
                    <div className="text-[10px] font-mono text-emerald-400 font-semibold">
                      {channel.growth} MoM
                    </div>
                  </div>
                </div>

                {/* Density Bar */}
                <div className="w-full h-2 rounded-full bg-neutral-900 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-cyan-500 to-[#118DFF]"
                    style={{ width: `${channel.percentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 pt-0.5">
                  <span>Conversão: {channel.conversionRate}</span>
                  <span>ROAS Estimado: {channel.roas}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-neutral-300 leading-relaxed">
            🎯 <strong className="text-cyan-300">Conclusão Analítica Power BI:</strong> O <strong>Instagram Direct</strong> e o <strong>WhatsApp Business</strong> respondem por <strong>73.2%</strong> de todos os leads qualificados da agência. A resposta automática dos agentes de IA em menos de 3 segundos no Direct é o principal motor de conversão de alto valor.
          </div>
        </div>

        {/* Right Column (5 Cols): Predictive Revenue Forecast & COP 30 Curve */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#0a0e18] border border-white/10 space-y-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
                <BarChart3 className="w-4 h-4" />
                <span>Projeção Preditiva de Faturamento (R$)</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 rounded">
                CURVA EXPONENCIAL
              </span>
            </div>

            {/* Visual Forecast Bars */}
            <div className="space-y-3 pt-4">
              {revenueForecast.map((item, idx) => {
                const maxVal = 380000;
                const pct = Math.round((item.projetado / maxVal) * 100);
                const isReal = item.realizado !== null;

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className={`${isReal ? 'text-white font-bold' : 'text-neutral-400'}`}>
                        {item.month} ({item.status})
                      </span>
                      <span className={`${isReal ? 'text-cyan-300 font-bold' : 'text-emerald-400'}`}>
                        R$ {item.projetado.toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-900 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          isReal
                            ? 'bg-cyan-400'
                            : 'bg-gradient-to-r from-emerald-500 via-[#F2C811] to-emerald-400'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Regional Territory Breakdown (Belém/Cametá & Global) */}
          <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2">
            <div className="text-xs font-mono text-neutral-300 font-semibold flex items-center justify-between">
              <span>Distribuição Geográfica de Contratos</span>
              <span className="text-cyan-400">AMAZÔNIA & GLOBAL</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="p-2 rounded-lg bg-neutral-900 border border-white/5">
                <div className="text-white font-bold">54%</div>
                <div className="text-[10px] text-neutral-400">Belém/Cametá - PA</div>
              </div>
              <div className="p-2 rounded-lg bg-neutral-900 border border-white/5">
                <div className="text-white font-bold">32%</div>
                <div className="text-[10px] text-neutral-400">Sudeste / SP</div>
              </div>
              <div className="p-2 rounded-lg bg-neutral-900 border border-white/5">
                <div className="text-white font-bold">14%</div>
                <div className="text-[10px] text-neutral-400">Contratos Internac.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Business Scale Engine: Client ROI Simulator & Lead Conversion Booster */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0c101c] via-[#090d18] to-[#0a1220] border border-cyan-500/30 shadow-2xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-display">
                Simulador de Escala Comercial & Multiplicador de Faturamento
              </h3>
              <p className="text-xs text-neutral-400">
                Apresente esta ferramenta na reunião de vendas para demonstrar ao cliente quanto ele perde por dia sem a Loops Digital.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold">
            ARGUMENTO IRREFUTÁVEL DE VENDA
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Sliders */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-neutral-300 mb-1.5">
                <span>Volume Mensal de Mensagens / Leads do Cliente:</span>
                <span className="text-cyan-400 font-bold text-sm">{selectedSimulationLeads} leads/mês</span>
              </div>
              <input
                type="range"
                min={50}
                max={2000}
                step={50}
                value={selectedSimulationLeads}
                onChange={(e) => setSelectedSimulationLeads(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-mono text-neutral-300 mb-1.5">
                <span>Ticket Médio do Serviço do Cliente:</span>
                <span className="text-emerald-400 font-bold text-sm">
                  R$ {selectedTicketMedio.toLocaleString('pt-BR')},00
                </span>
              </div>
              <input
                type="range"
                min={5000}
                max={150000}
                step={5000}
                value={selectedTicketMedio}
                onChange={(e) => setSelectedTicketMedio(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Results Badge */}
          <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/40 space-y-2 text-center">
            <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
              FATURAMENTO EXTRA ESTIMADO / ANO
            </div>
            <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-300 to-white font-display">
              R$ {(faturamentoRecuperado * 12).toLocaleString('pt-BR')},00
            </div>
            <div className="text-xs text-neutral-300 font-mono">
              Com retenção imediata em 2.4s via agentes Loops Digital
            </div>
          </div>
        </div>
      </div>

      {/* 1-Click Proposal Generation Modal */}
      {showProposalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-xl bg-neutral-950 border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-white font-display">
                  Gerador Automático de Proposta Comercial Executiva
                </h4>
              </div>
              <button
                onClick={() => setShowProposalModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">Nome da Empresa / Cliente</label>
                <input
                  type="text"
                  value={proposalClientName}
                  onChange={(e) => setProposalClientName(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">Escopo Técnico Proposto</label>
                <input
                  type="text"
                  value={proposalScope}
                  onChange={(e) => setProposalScope(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">Valor do Projeto / Contrato</label>
                <input
                  type="text"
                  value={proposalValue}
                  onChange={(e) => setProposalValue(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs font-mono text-neutral-300 leading-relaxed whitespace-pre-line">
                {`PROPOSTA TÉCNICA EXECUTIVA — LOOPS DIGITAL
Cliente: ${proposalClientName}
Escopo: ${proposalScope}
Investimento: ${proposalValue}
Garantia: SLA 99.9% com agentes de IA multicanais e esteira de conversão server-side.
Liderança: Lorenzo Cardoso (CTO & Engenheiro Sênior)`}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowProposalModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-neutral-400 hover:text-white hover:bg-neutral-900"
              >
                Cancelar
              </button>
              <button
                onClick={handleCopyProposal}
                className="flex items-center gap-1.5 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold rounded-xl shadow-lg transition-all"
              >
                {copiedProposal ? <CheckCircle2 className="w-3.5 h-3.5 text-black" /> : <Send className="w-3.5 h-3.5 text-black" />}
                <span>{copiedProposal ? 'Copiada para o Clipboard!' : 'Copiar Proposta para Enviar'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
