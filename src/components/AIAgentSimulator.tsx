import React, { useState } from 'react';
import { Send, Bot, CheckCircle, Sparkles, MessageSquare, Instagram, Linkedin, Twitter, ArrowRight } from 'lucide-react';

interface AIAgentSimulatorProps {
  onOpenCrm: () => void;
}

export const AIAgentSimulator: React.FC<AIAgentSimulatorProps> = ({ onOpenCrm }) => {
  const [channel, setChannel] = useState<'instagram' | 'whatsapp' | 'linkedin' | 'x'>('instagram');
  const [clientName, setClientName] = useState<string>('Mariana Siqueira');
  const [clientHandle, setClientHandle] = useState<string>('@mariana.growth');
  const [message, setMessage] = useState<string>('Olá! Tenho uma clínica médica e quero saber como criar um agente de IA no Instagram para qualificar pacientes de cirurgia e agendar consultas direto no CRM.');
  const [loading, setLoading] = useState<boolean>(false);
  const [agentResult, setAgentResult] = useState<any>(null);

  const sampleMessages = [
    {
      label: 'Agente no Instagram (Saúde/Clínica)',
      channel: 'instagram' as const,
      name: 'Dra. Vanessa Lemos',
      handle: '@dra.vanessalemos',
      msg: 'Olá! Recebemos mais de 200 mensagens diárias no direct do Instagram e perdemos pacientes por demora no atendimento. É possível ter um agente de IA que entenda áudio e agende consultas?',
    },
    {
      label: 'Escala de Tráfego & E-commerce (WhatsApp)',
      channel: 'whatsapp' as const,
      name: 'Gabriel Farias',
      handle: '+5511998761234',
      msg: 'Boa tarde! Faturamos 400k/mês no e-commerce e queremos migrar nosso tráfego para CAPI server-side com agentes de IA para recuperação de vendas no WhatsApp. Qual o prazo de implantação?',
    },
    {
      label: 'CRM Customizado & B2B (LinkedIn)',
      channel: 'linkedin' as const,
      name: 'Bernardo Castilho',
      handle: 'in/bernardocastilho',
      msg: 'Olá, acompanho os projetos da Loops e o case da COP 30. Buscamos desenvolver um CRM próprio com inteligência preditiva para nossa operação de logística industrial.',
    },
  ];

  const handleTestAgent = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/ai-lead-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          channel,
          clientName,
          clientHandle,
        }),
      });

      const data = await res.json();
      if (data.agentResult) {
        setAgentResult(data.agentResult);
      }
    } catch (err) {
      console.error('Agent simulator error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="ai-simulator" className="py-24 border-t border-white/[0.06] bg-[#06080d]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">
            <Bot className="w-3.5 h-3.5" />
            <span>LOOPS AGENT PLAYGROUND</span>
            <span aria-hidden="true">·</span>
            <span>SIMULADOR AO VIVO</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-display mb-4">
            Experimente o Agente de IA em Tempo Real.
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg">
            Envie uma mensagem simulando um cliente entrando em contato pelas suas redes sociais e observe como o agente da Loops qualifica a intenção e gera a resposta imediata.
          </p>
        </div>

        {/* Quick Scenario Buttons */}
        <div className="mb-6 flex flex-wrap gap-2 items-center">
          <span className="text-xs font-mono text-neutral-500 mr-2">CENÁRIOS PRONTOS:</span>
          {sampleMessages.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => {
                setChannel(sample.channel);
                setClientName(sample.name);
                setClientHandle(sample.handle);
                setMessage(sample.msg);
                setAgentResult(null);
              }}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-neutral-900 border border-white/5 text-neutral-300 hover:text-white hover:border-neutral-600 transition-colors"
            >
              {sample.label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Simulator Form */}
          <div className="lg:col-span-6 rounded-2xl border border-white/[0.08] bg-[#0b0e14] p-6 sm:p-8 shadow-xl space-y-6">
            <div>
              <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">
                Canal de Entrada Social
              </label>
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setChannel('instagram')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-xs ${
                    channel === 'instagram'
                      ? 'border-pink-500/80 bg-pink-950/20 text-white'
                      : 'border-white/5 bg-neutral-900/60 text-neutral-400 hover:text-white'
                  }`}
                >
                  <Instagram className="w-4 h-4 mb-1 text-pink-400" />
                  <span>Instagram</span>
                </button>

                <button
                  type="button"
                  onClick={() => setChannel('whatsapp')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-xs ${
                    channel === 'whatsapp'
                      ? 'border-emerald-500/80 bg-emerald-950/20 text-white'
                      : 'border-white/5 bg-neutral-900/60 text-neutral-400 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 mb-1 text-emerald-400" />
                  <span>WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => setChannel('linkedin')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-xs ${
                    channel === 'linkedin'
                      ? 'border-blue-500/80 bg-blue-950/20 text-white'
                      : 'border-white/5 bg-neutral-900/60 text-neutral-400 hover:text-white'
                  }`}
                >
                  <Linkedin className="w-4 h-4 mb-1 text-blue-400" />
                  <span>LinkedIn</span>
                </button>

                <button
                  type="button"
                  onClick={() => setChannel('x')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-xs ${
                    channel === 'x'
                      ? 'border-neutral-400 bg-neutral-800 text-white'
                      : 'border-white/5 bg-neutral-900/60 text-neutral-400 hover:text-white'
                  }`}
                >
                  <Twitter className="w-4 h-4 mb-1 text-neutral-300" />
                  <span>X (Twitter)</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">Nome do Contato</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">Handle / Número</label>
                <input
                  type="text"
                  value={clientHandle}
                  onChange={(e) => setClientHandle(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-1">
                Mensagem enviada pelo Lead:
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ex: Gostaria de saber mais sobre as soluções de IA para automação..."
                className="w-full bg-neutral-900 border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-cyan-500 resize-none leading-relaxed"
              />
            </div>

            <button
              onClick={() => handleTestAgent()}
              disabled={loading || !message.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>{loading ? 'Agente de IA Processando...' : 'Simular Resposta do Agente IA'}</span>
            </button>
          </div>

          {/* Simulator Live Result Display */}
          <div className="lg:col-span-6 rounded-2xl border border-white/[0.08] bg-[#0c1017] p-6 sm:p-8 shadow-xl min-h-[440px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-xs font-mono text-neutral-300">LOOPS NEURAL AGENT OUTPUT</span>
                </div>
                <span className="text-xs font-mono text-neutral-500">CANAL: {channel.toUpperCase()}</span>
              </div>

              {loading ? (
                <div className="space-y-4 py-12 text-center">
                  <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <div className="text-xs font-mono text-neutral-400">
                    Inferência neural em andamento... analisando intenção de compra.
                  </div>
                </div>
              ) : agentResult ? (
                <div className="space-y-6">
                  {/* Speech Bubble */}
                  <div className="p-4 rounded-xl bg-neutral-900 border border-white/10 text-xs sm:text-sm text-neutral-200 leading-relaxed">
                    <div className="text-[10px] font-mono text-cyan-400 mb-2 flex items-center justify-between">
                      <span>RESPOSTA GERADA PELO AGENTE DE IA:</span>
                      <span className="text-emerald-400">Tempo: 4.2s</span>
                    </div>
                    {agentResult.reply}
                  </div>

                  {/* AI Metadata Analysis Card */}
                  <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                    <div className="p-3 rounded-lg bg-neutral-950/70 border border-white/5">
                      <span className="text-neutral-500 text-[10px] block">LEAD SCORE</span>
                      <span className="text-emerald-400 font-bold text-base">
                        {agentResult.leadScore}/100
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-neutral-950/70 border border-white/5">
                      <span className="text-neutral-500 text-[10px] block">TICKET ESTIMADO</span>
                      <span className="text-white font-medium text-xs">
                        {agentResult.estimatedBudget || 'Sob Medida'}
                      </span>
                    </div>

                    <div className="col-span-2 p-3 rounded-lg bg-neutral-950/70 border border-white/5">
                      <span className="text-neutral-500 text-[10px] block">INTENÇÃO DETECTADA</span>
                      <span className="text-cyan-300 text-xs font-sans">
                        {agentResult.intentDetected}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/20 text-xs text-neutral-300 flex items-center justify-between">
                    <span>Lead salvo e qualificado no CRM</span>
                    <span className="text-emerald-400 text-xs font-mono">STATUS: NOVO / QUALIFICADO</span>
                  </div>
                </div>
              ) : (
                <div className="py-20 text-center text-neutral-500 space-y-2">
                  <Bot className="w-10 h-10 mx-auto text-neutral-600" />
                  <p className="text-xs sm:text-sm">
                    Clique em "Simular Resposta do Agente IA" para ver a inferência em tempo real.
                  </p>
                </div>
              )}
            </div>

            {agentResult && (
              <div className="pt-6 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-400">
                  Sincronizado com CRM Loops
                </span>
                <button
                  onClick={onOpenCrm}
                  className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <span>Ver Este Lead no CRM</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
