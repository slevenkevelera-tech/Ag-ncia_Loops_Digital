import React, { useState } from 'react';
import { Quote, TrendingUp, Users, DollarSign, Star } from 'lucide-react';
import { CLIENT_TESTIMONIALS } from '../data/mockData';

export const ClientResults: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');

  const filteredTestimonials = filter === 'all'
    ? CLIENT_TESTIMONIALS
    : CLIENT_TESTIMONIALS.filter((t) => t.category.toLowerCase().includes(filter.toLowerCase()));

  return (
    <section id="depoimentos" className="py-24 border-t border-white/[0.06] bg-[#07090e]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Métricas & Retorno Financeiro</span>
            <span aria-hidden="true">·</span>
            <span>Auditoria de Clientes</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-display mb-4">
            Aumento de faturamento e prospecção em escala.
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg">
            Os resultados obtidos por empresas que integraram a engenharia da Loops Digital em suas rotinas comerciais e tecnológicas.
          </p>
        </div>

        {/* Global Impact Numbers (Bento style metrics) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0a0d14]">
            <div className="text-2xl sm:text-4xl font-bold text-white font-mono tracking-tight mb-1">
              +310%
            </div>
            <div className="text-xs text-neutral-400 leading-snug">
              Média de Aumento em Faturamento nos 6 primeiros meses de operação.
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0a0d14]">
            <div className="text-2xl sm:text-4xl font-bold text-cyan-400 font-mono tracking-tight mb-1">
              450k+
            </div>
            <div className="text-xs text-neutral-400 leading-snug">
              Leads Qualificados processados via Agentes de IA nos canais sociais.
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0a0d14]">
            <div className="text-2xl sm:text-4xl font-bold text-emerald-400 font-mono tracking-tight mb-1">
              4.8x
            </div>
            <div className="text-xs text-neutral-400 leading-snug">
              ROAS Médio Auditado em campanhas de tráfego com esteira CAPI.
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0a0d14]">
            <div className="text-2xl sm:text-4xl font-bold text-purple-400 font-mono tracking-tight mb-1">
              &lt; 8s
            </div>
            <div className="text-xs text-neutral-400 leading-snug">
              Tempo de Resposta 24/7 para clientes no WhatsApp e Instagram.
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {filteredTestimonials.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-white/[0.08] bg-[#0a0e16] p-8 hover:border-white/20 transition-all duration-300 flex flex-col justify-between shadow-xl group"
            >
              <div>
                {/* Metric Header Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-5 border-b border-white/[0.06] mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-white font-mono tracking-tight">
                      {item.revenueIncrease}
                    </span>
                    <span aria-hidden="true" className="text-neutral-600">·</span>
                    <span className="text-xs text-emerald-400 font-mono">
                      {item.leadsGrowth}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-500">
                    {item.timeframe}
                  </span>
                </div>

                {/* Quote Content */}
                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed italic mb-8">
                  "{item.quote}"
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center font-mono text-xs font-bold text-cyan-400">
                    {item.avatarText}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white font-display">
                      {item.name}
                    </div>
                    <div className="text-xs text-neutral-400">
                      {item.role} · <span className="text-neutral-300">{item.company}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-mono text-neutral-500 block">SOLUÇÃO</span>
                  <span className="text-xs text-cyan-400 font-medium">{item.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
