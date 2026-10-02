import React from 'react';
import { Award, Terminal, MapPin, Zap, Brain, TrendingUp } from 'lucide-react';
import { FOUNDER_IMAGE, COP30_IMAGE, PROJECT_CASES } from '../data/mockData';

export const BiographyCop30: React.FC = () => {
  return (
    <section id="cop30-bio" className="py-24 border-t border-white/[0.06] bg-[#06080d]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Lead */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">
            <Terminal className="w-3.5 h-3.5" />
            <span>Visão Estratégica & Excelência Técnica</span>
            <span aria-hidden="true">·</span>
            <span>Pioneirismo Comprovado</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-display mb-4">
            Arquitetura de sistemas em escala global. Transformação de negócios através de tecnologia.
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg">
            Liderança técnica estratégica em projetos de missão crítica, inteligência artificial de ponta e infraestruturas digitais de alto desempenho que geram valor mensurável.
          </p>
        </div>

        {/* Founder Bio Card - Premium Layout */}
        <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-[#0a0e16] via-[#060a11] to-[#0a0d14] p-8 sm:p-12 mb-20 shadow-2xl relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl -z-10" />
          
          <div className="grid lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Portrait Column */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden border border-cyan-500/30 aspect-[3/4] bg-neutral-950 shadow-2xl relative group">
                <img
                  src={FOUNDER_IMAGE}
                  alt="Lorenzo Cardoso - Engenheiro Sênior & CTO Loops Digital"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black via-black/80 to-transparent">
                  <div className="text-cyan-300 font-mono text-[10px] uppercase tracking-widest font-bold mb-1">
                    Principal Architect & CTO
                  </div>
                  <div className="text-white font-extrabold text-lg tracking-tight font-display">
                    Lorenzo Cardoso
                  </div>
                  <div className="text-cyan-400 text-[11px] font-mono mt-2">
                    Loops Digital
                  </div>
                </div>
              </div>
            </div>

            {/* Biography Content Column */}
            <div className="lg:col-span-7 space-y-7">
              <div className="space-y-4">
                <div className="text-xs font-mono text-neutral-500 flex items-center gap-2 uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span>São Paulo · Belém · Cobertura Global</span>
                </div>
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/15 to-blue-500/15 border border-cyan-500/40 text-xs font-mono text-cyan-200 font-semibold tracking-wider uppercase">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Engenheiro Sênior & CTO</span>
                  </div>
                  <h3 className="text-4xl sm:text-5xl font-extrabold text-white font-display tracking-tight">
                    Lorenzo Cardoso
                  </h3>
                </div>
                <p className="text-lg text-cyan-300 font-semibold">
                  Catalisador de Inovação · Arquiteto de Soluções Empresariais
                </p>
              </div>

              <div className="h-px bg-gradient-to-r from-cyan-500/20 via-cyan-500/40 to-transparent" />

              <p className="text-neutral-300 leading-relaxed text-sm sm:text-base font-medium">
                Como <strong>Engenheiro de Software Sênior e CTO da Loops Digital</strong>, eu, <strong>Lorenzo Cardoso</strong>, lidero a convergência estratégica entre a <strong>Inteligência Artificial de vanguarda</strong> e a <strong>eficiência operacional</strong> para transformar desafios comerciais complexos em vantagens competitivas mensuráveis. Com mais de uma década de experiência, construí arquiteturas que alimentaram desde <strong>cúpulas climáticas de relevância global</strong> — como a <strong>COP 30</strong> — até operações comerciais que processam transações de sete dígitos mensais com confiabilidade absoluta.
              </p>

              <p className="text-neutral-300 leading-relaxed text-sm sm:text-base">
                Na <strong>Loops Digital</strong>, materializo a complexidade em diferencial competitivo: orquestramos <strong>agentes de IA conversacional</strong> que mantêm diálogos naturais e aprendem através de algoritmos de <strong>retropropagação (backpropagation)</strong> — uma metodologia que otimiza redes neurais artificiais calculando gradientes de erro para ajustes precisos de pesos — enquanto desenvolvemos <strong>CRMs empresariais</strong> que eliminam fricção operacional, <strong>aplicativos Android</strong> em padrão internacional, e <strong>estratégias de tráfego pago</strong> fundamentadas em ciência de dados e algoritmos preditivos que geram ROI exponencial.
              </p>

              {/* Expertise Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-4 rounded-xl bg-cyan-500/8 border border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
                  <div className="text-xs font-bold text-cyan-300 mb-1 uppercase tracking-wider">Agentes de IA</div>
                  <div className="text-[11px] text-neutral-400 font-mono">Gemini · LLMs Multimodal</div>
                </div>
                <div className="p-4 rounded-xl bg-blue-500/8 border border-blue-500/20 hover:border-blue-500/40 transition-colors">
                  <div className="text-xs font-bold text-blue-300 mb-1 uppercase tracking-wider">CRMs Customizados</div>
                  <div className="text-[11px] text-neutral-400 font-mono">OAuth · Sync Real-time</div>
                </div>
                <div className="p-4 rounded-xl bg-purple-500/8 border border-purple-500/20 hover:border-purple-500/40 transition-colors">
                  <div className="text-xs font-bold text-purple-300 mb-1 uppercase tracking-wider">Tráfego Pago CAPI</div>
                  <div className="text-[11px] text-neutral-400 font-mono">Meta · Google · Predictive</div>
                </div>
                <div className="p-4 rounded-xl bg-emerald-500/8 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
                  <div className="text-xs font-bold text-emerald-300 mb-1 uppercase tracking-wider">Apps Android Nativo</div>
                  <div className="text-[11px] text-neutral-400 font-mono">Kotlin · Jetpack Compose</div>
                </div>
                <div className="p-4 rounded-xl bg-pink-500/8 border border-pink-500/20 hover:border-pink-500/40 transition-colors">
                  <div className="text-xs font-bold text-pink-300 mb-1 uppercase tracking-wider">Infraestrutura Web</div>
                  <div className="text-[11px] text-neutral-400 font-mono">React · Vite · Node.js</div>
                </div>
                <div className="p-4 rounded-xl bg-orange-500/8 border border-orange-500/20 hover:border-orange-500/40 transition-colors">
                  <div className="text-xs font-bold text-orange-300 mb-1 uppercase tracking-wider">Telemetria & BI</div>
                  <div className="text-[11px] text-neutral-400 font-mono">Big Data · Crítica</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deep Dive: COP 30 Showcase - Premium Edition */}
        <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-[#0a1614] via-[#081210] to-[#070d10] p-8 sm:p-12 mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl -z-10" />
          
          <div className="flex flex-col lg:flex-row gap-12 items-center justify-between relative z-10">
            <div className="max-w-2xl space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider font-bold">
                <Award className="w-5 h-5" />
                <span>Engenharia de Escala Planetária</span>
              </div>
              
              <div>
                <h3 className="text-3xl sm:text-5xl font-bold text-white font-display leading-tight mb-2">
                  COP 30 Belém
                </h3>
                <p className="text-emerald-400 text-sm sm:text-base font-semibold">
                  Telemetria & Inteligência Ambiental na Amazônia
                </p>
              </div>

              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
                Durante a <strong>Conferência das Partes sobre Mudanças Climáticas (COP 30)</strong> em Belém, epicentro da Amazônia brasileira, arquitetei a espinha dorsal de software para telemetria ambiental e inteligência operacional em tempo real — um sistema crítico que sustentou a conferência global com <strong>confiabilidade de 99.998%</strong> e processamento de dados de múltiplas fontes satelitais com latência inferior a 45 milissegundos.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/15 to-emerald-600/10 border border-emerald-500/30">
                  <div className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono mb-1">99.998%</div>
                  <div className="text-xs text-emerald-300 font-medium">Uptime durante cúpula</div>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/15 to-cyan-600/10 border border-cyan-500/30">
                  <div className="text-2xl sm:text-3xl font-bold text-cyan-400 font-mono mb-1">&lt;45ms</div>
                  <div className="text-xs text-cyan-300 font-medium">Latência satelital</div>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/15 to-blue-600/10 border border-blue-500/30">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-400 font-mono mb-1">Zero</div>
                  <div className="text-xs text-blue-300 font-medium">Downtime · Perda zero</div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-80 rounded-2xl overflow-hidden border border-emerald-500/40 shadow-2xl relative group">
              <img
                src={COP30_IMAGE}
                alt="Centro de Telemetria Ambiental - COP 30"
                className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="p-5 bg-gradient-to-t from-black via-black/60 to-transparent border-t border-emerald-500/30">
                <div className="text-xs font-mono text-emerald-300 font-bold uppercase tracking-wider mb-1">
                  ⚡ Centro de Telemetria Global
                </div>
                <div className="text-[12px] text-emerald-200 font-medium">Belém do Pará · Padrão ONU Internacional</div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Notable Projects */}
        <div className="space-y-7">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">Portfólio Técnico</span>
            </div>
            <h3 className="text-2xl font-bold text-white font-display">Projetos Emblemáticos</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {PROJECT_CASES.slice(1).map((project) => (
              <div
                key={project.id}
                className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#0a0d14] to-[#060a10] p-6 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-3 font-mono">
                    <span className="text-cyan-400 font-semibold uppercase">{project.category}</span>
                    <span className="text-neutral-500 bg-neutral-900/60 px-2 py-1 rounded">{project.highlightTag}</span>
                  </div>
                  <h4 className="text-xl font-bold text-white font-display mb-3 group-hover:text-cyan-300 transition-colors">{project.title}</h4>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-4">
                    {project.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.06] space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((t) => (
                      <span key={t} className="text-[11px] font-mono text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-300 pt-2 border-t border-white/[0.06]">
                    {project.metrics.map((m) => (
                      <div key={m.label}>
                        <span className="text-neutral-500">{m.label}: </span>
                        <span className="text-cyan-400 font-bold">{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/20">
          <div className="flex items-center gap-3 mb-3">
            <Brain className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">Loops Digital</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white font-display mb-3">
            Transforme seu negócio com arquitetura de escala global
          </h3>
          <p className="text-neutral-400 text-sm sm:text-base">
            A Loops Digital combina expertise técnica de ponta com visão estratégica para construir soluções que geram valor real. De agentes de IA conversacional até infraestruturas críticas, entregamos excelência.
          </p>
        </div>
      </div>
    </section>
  );
};
