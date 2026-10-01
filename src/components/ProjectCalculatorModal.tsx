import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, ShieldCheck } from 'lucide-react';

interface ProjectCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCrm: () => void;
}

export const ProjectCalculatorModal: React.FC<ProjectCalculatorModalProps> = ({
  isOpen,
  onClose,
  onOpenCrm,
}) => {
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'Agentes de I.A Omnichannel',
    'Tráfego Pago & CAPI',
  ]);
  const [leadVolume, setLeadVolume] = useState<number>(3000);
  const [contactName, setContactName] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const servicesList = [
    { id: 'Agentes de I.A Omnichannel', desc: 'Atendimento e qualificação 24/7 no Instagram, WhatsApp e LinkedIn', baseCost: 12000 },
    { id: 'Tráfego Pago & CAPI', desc: 'Estratégia de escala, esteira server-side e inteligência de ROAS', baseCost: 14000 },
    { id: 'CRM Customizado', desc: 'Sistema proprietário com Google OAuth e esteira de vendas', baseCost: 18000 },
    { id: 'App Android Nativo', desc: 'Kotlin Jetpack Compose com sincronização em tempo real', baseCost: 22000 },
    { id: 'Web Site Futurista & SEO', desc: 'Front-end padrão Apple com máxima pontuação no Core Web Vitals', baseCost: 15000 },
    { id: 'Consultoria de Arquitetura', desc: 'Direcionamento técnico sênior e infraestrutura crítica (estilo COP 30)', baseCost: 20000 },
  ];

  const toggleService = (name: string) => {
    if (selectedServices.includes(name)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter((s) => s !== name));
      }
    } else {
      setSelectedServices([...selectedServices, name]);
    }
  };

  const calculatedBase = selectedServices.reduce((acc, s) => {
    const item = servicesList.find((i) => i.id === s);
    return acc + (item ? item.baseCost : 10000);
  }, 0);

  const estimatedTotal = Math.round(calculatedBase * (1 + (leadVolume / 10000) * 0.4));
  const estimatedWeeks = Math.max(3, Math.round(selectedServices.length * 1.5));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await fetch('/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName,
          company: 'Projeto Calculado Online',
          email: contactEmail,
          phone: contactPhone,
          channel: 'instagram',
          channelHandle: '@prospect.web',
          intent: `Demanda de Projeto: ${selectedServices.join(', ')} | Estimativa R$ ${estimatedTotal.toLocaleString('pt-BR')}`,
          budgetTier: `R$ ${estimatedTotal.toLocaleString('pt-BR')}`,
          status: 'qualificado',
          leadScore: 95,
          lastMessage: `Solicitou proposta personalizada para: ${selectedServices.join(', ')} com volume de ${leadVolume.toLocaleString('pt-BR')} leads/mês.`,
          tags: ['Calculadora', ...selectedServices],
        }),
      });

      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting calculated lead:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl">
      <div className="relative w-full max-w-3xl rounded-3xl border border-white/10 bg-[#0a0d14] shadow-2xl p-6 sm:p-10 text-neutral-200 overflow-y-auto max-h-[92vh]">
        <div className="flex items-center justify-between pb-6 border-b border-white/[0.08] mb-6">
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
              ESTRUTURADOR DE ESCOPO TÉCNICO
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Dimensionar Arquitetura Loops
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <Check className="w-7 h-7" />
            </div>
            <h4 className="text-2xl font-bold text-white font-display">
              Escopo Enviado com Sucesso!
            </h4>
            <p className="text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
              O Agente de IA da Loops já qualificou sua demanda e disponibilizou a proposta no nosso CRM. O Engenheiro Sênior entrará em contato em minutos.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  onOpenCrm();
                }}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-semibold"
              >
                Visualizar no CRM Administrativo
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-neutral-300 text-xs font-semibold"
              >
                Fechar
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Services Selector */}
            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-3">
                1. SELECIONE OS COMPONENTES DO SEU PROJETO:
              </label>
              <div className="grid sm:grid-cols-2 gap-3">
                {servicesList.map((srv) => {
                  const isSelected = selectedServices.includes(srv.id);
                  return (
                    <div
                      key={srv.id}
                      onClick={() => toggleService(srv.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-cyan-500/80 bg-cyan-950/20 text-white'
                          : 'border-white/5 bg-neutral-900/50 text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white">{srv.id}</span>
                        {isSelected ? (
                          <div className="w-4 h-4 rounded-full bg-cyan-500 text-black flex items-center justify-center text-[10px] font-bold">
                            ✓
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-neutral-600" />
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-tight">{srv.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Slider for Volume */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-2">
                <span className="text-neutral-400">2. VOLUME MENSAL ESTIMADO DE LEADS:</span>
                <span className="text-cyan-400 font-bold">{leadVolume.toLocaleString('pt-BR')} leads/mês</span>
              </div>
              <input
                type="range"
                min={500}
                max={25000}
                step={500}
                value={leadVolume}
                onChange={(e) => setLeadVolume(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Scope Summary Card */}
            <div className="p-4 rounded-2xl bg-[#0e131d] border border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-neutral-500 block uppercase">
                  INVESTIMENTO ESTIMADO
                </span>
                <span className="text-2xl font-bold text-white font-mono">
                  R$ {estimatedTotal.toLocaleString('pt-BR')}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono text-neutral-500 block uppercase">
                  CRONOGRAMA DE IMPLANTAÇÃO
                </span>
                <span className="text-base font-bold text-cyan-400 font-mono">
                  ~{estimatedWeeks} semanas (Sprint Ágil)
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-neutral-500 block uppercase">
                  ENGENHEIRO RESPONSÁVEL
                </span>
                <span className="text-xs text-neutral-300 font-semibold">
                  Fundador Sênior (Ex-COP 30)
                </span>
              </div>
            </div>

            {/* Contact Input Fields */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-mono text-neutral-400">
                3. SEUS DADOS PARA RECEBER A PROPOSTA COMPLETA:
              </label>
              <div className="grid sm:grid-cols-3 gap-3">
                <input
                  required
                  type="text"
                  placeholder="Seu Nome"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
                <input
                  required
                  type="email"
                  placeholder="Seu E-mail Corporativo"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
                <input
                  required
                  type="text"
                  placeholder="Seu WhatsApp"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>{submitting ? 'Gerando Diagnóstico...' : 'Receber Proposta Técnica Personalizada'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
