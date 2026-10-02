import React from 'react';
import { Award, Terminal, MapPin, Zap, Brain, TrendingUp, Crown, Briefcase } from 'lucide-react';
import { FOUNDER_IMAGE, COP30_IMAGE, PROJECT_CASES } from '../data/mockData';

export const BiographyCop30: React.FC = () => {
  return (
    <section id="cop30-bio" className="py-24 border-t border-white/[0.06] bg-[#06080d]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Premium Section Lead - Luxo / Executive */}
        <div className="max-w-4xl mb-20">
          <div className="flex items-center gap-3 text-xs font-mono text-amber-500 uppercase tracking-wider mb-4">
            <Crown className="w-4 h-4" />
            <span>Liderança Executiva · Visão Estratégica de Classe Mundial</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-white font-display mb-6 leading-tight">
            Engenharia que define padrões globais.
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-300"> Estratégia que gera valor.</span>
          </h2>
          <p className="text-neutral-300 text-base sm:text-lg font-light leading-relaxed max-w-3xl">
            Mais de uma década na vanguarda da transformação digital, construindo infraestruturas de missão crítica que sustentam operações de escala global e estabelecendo novos paradigmas em inteligência artificial aplicada ao contexto empresarial.
          </p>
        </div>

        {/* Founder Bio Card - Luxury Executive Edition */}
        <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-[#0f0a06] via-[#0a0e16] to-[#06080d] p-10 sm:p-16 mb-24 shadow-2xl relative overflow-hidden">
          {/* Premium Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/8 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl -z-10" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_25%,rgba(217,119,6,0.05)_25%,rgba(217,119,6,0.05)_50%,transparent_50%,transparent_75%,rgba(217,119,6,0.05)_75%,rgba(217,119,6,0.05))] bg-[length:40px_40px] opacity-20 -z-10" />
          
          <div className="grid lg:grid-cols-12 gap-14 items-center relative z-10">
            {/* Portrait Column - Premium */}
            <div className="lg:col-span-5 relative">
              <div className="relative">
                {/* Gold Border Frame */}
                <div className="absolute -inset-2 bg-gradient-to-br from-amber-500/40 to-yellow-600/20 rounded-2xl blur-xl" />
                <div className="rounded-2xl overflow-hidden border-2 border-amber-500/50 aspect-[3/4] bg-neutral-950 shadow-2xl relative group">
                  <img
                    src={FOUNDER_IMAGE}
                    alt="Lorenzo Cardoso - Principal Architect & CTO Loops Digital"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                  
                  {/* Luxury Badge */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/90 to-black/40">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <div className="text-amber-300 font-serif text-[10px] uppercase tracking-widest font-bold">
                        Principal Architect
                      </div>
                    </div>
                    <div className="text-white font-serif text-2xl tracking-tight font-light mb-1">
                      Lorenzo Cardoso
                    </div>
                    <div className="text-amber-200 text-[11px] font-serif tracking-wide">
                      Chief Technology Officer · Loops Digital
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Biography Column - Luxury Premium */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-5">
                <div className="text-xs font-serif text-amber-600/80 flex items-center gap-2 uppercase tracking-widest">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  <span>São Paulo · Belém · Alcance Planetário</span>
                </div>
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-500/50 text-xs font-serif text-amber-200 font-medium tracking-wider uppercase">
                    <Crown className="w-4 h-4" />
                    <span>Estrategista Executivo · Engenheiro Sênior</span>
                  </div>
                  <h3 className="text-5xl sm:text-6xl font-light text-white font-serif tracking-tight">
                    Lorenzo Cardoso
                  </h3>
                </div>
                <p className="text-lg text-amber-300/90 font-serif italic">
                  Onde inovação encontra excelência operacional
                </p>
              </div>

              <div className="h-px bg-gradient-to-r from-amber-500/30 via-amber-500/60 to-transparent" />

              <p className="text-neutral-300 leading-relaxed text-base font-light">
                Como <strong>Principal Architect e Chief Technology Officer da Loops Digital</strong>, eu, <strong>Lorenzo Cardoso</strong>, orquestro a sinergia entre a <strong>inteligência artificial de ponta</strong> e a <strong>visão estratégica empresarial</strong>, transformando desafios operacionais de alta complexidade em diferencial competitivo durável. Com mais de uma década de liderança técnica, construí sistemas críticos que desde <strong>conferências climáticas de relevância histórica</strong> — como a <strong>COP 30</strong> — até operações comerciais de valor extraordinário estabelecem novos padrões de confiabilidade e desempenho.
              </p>

              <p className="text-neutral-300 leading-relaxed text-base font-light">
                A <strong>Loops Digital</strong> representa minha filosofia de engenharia: transformar complexidade em elegância operacional. Desenvolvemos <strong>agentes conversacionais de IA</strong> que mantêm diálogos autênticos com capacidade de aprendizado contínuo através de <strong>retropropagação neural (backpropagation)</strong> — um algoritmo que refina inteligência artificial através do cálculo preciso de gradientes de erro — enquanto orquestramos <strong>CRMs estratégicos</strong> que eliminam ineficiência operacional, <strong>aplicativos mobile</strong> de padrão internacional, e <strong>arquiteturas de marketing performance</strong> fundamentadas em ciência de dados e previsibilidade de mercado.
              </p>

              {/* Expertise Highlights - Luxury */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/12 to-amber-600/5 border border-amber-500/25 hover:border-amber-500/50 transition-all">
                  <div className="text-xs font-serif text-amber-300 mb-2 uppercase tracking-widest">Agentes de IA</div>
                  <div className="text-[11px] text-neutral-400 font-mono">Gemini · LLMs Multimodal</div>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-500/12 to-yellow-600/5 border border-yellow-500/25 hover:border-yellow-500/50 transition-all">
                  <div className="text-xs font-serif text-yellow-300 mb-2 uppercase tracking-widest">CRMs Estratégicos</div>
                  <div className="text-[11px] text-neutral-400 font-mono">OAuth · Sync Real-time</div>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-400/12 to-amber-500/5 border border-amber-400/25 hover:border-amber-400/50 transition-all">
                  <div className="text-xs font-serif text-amber-200 mb-2 uppercase tracking-widest">Performance CAPI</div>
                  <div className="text-[11px] text-neutral-400 font-mono">Meta · Google · Predictive</div>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-600/12 to-yellow-700/5 border border-yellow-600/25 hover:border-yellow-600/50 transition-all">
                  <div className="text-xs font-serif text-yellow-200 mb-2 uppercase tracking-widest">Apps Nativo Mobile</div>
                  <div className="text-[11px] text-neutral-400 font-mono">Kotlin · Jetpack Compose</div>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/12 to-amber-600/5 border border-amber-500/25 hover:border-amber-500/50 transition-all">
                  <div className="text-xs font-serif text-amber-300 mb-2 uppercase tracking-widest">Plataformas Web</div>
                  <div className="text-[11px] text-neutral-400 font-mono">React · Vite · Node.js</div>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-500/12 to-yellow-600/5 border border-yellow-500/25 hover:border-yellow-500/50 transition-all">
                  <div className="text-xs font-serif text-yellow-300 mb-2 uppercase tracking-widest">Telemetria & BI</div>
                  <div className="text-[11px] text-neutral-400 font-mono">Big Data · Crítica</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COP 30 Showcase - Executive Luxury */}
        <div className="rounded-3xl border border-amber-500/25 bg-gradient-to-br from-[#0f0a06] via-[#0a0d14] to-[#070d10] p-10 sm:p-14 mb-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/8 rounded-full blur-3xl -z-10" />
          
          <div className="flex flex-col lg:flex-row gap-12 items-center justify-between relative z-10">
            <div className="max-w-2xl space-y-7">
              <div className="inline-flex items-center gap-2.5 text-xs font-serif text-amber-500 uppercase tracking-widest font-medium">
                <Award className="w-5 h-5" />
                <span>Engenharia de Impacto Global</span>
              </div>
              
              <div>
                <h3 className="text-4xl sm:text-5xl font-light text-white font-serif leading-tight mb-3">
                  COP 30 Belém
                </h3>
                <p className="text-amber-400/90 text-sm sm:text-base font-serif italic">
                  Telemetria & Inteligência Ambiental na Amazônia
                </p>
              </div>

              <p className="text-neutral-300 leading-relaxed text-base font-light">
                Durante a <strong>Conferência das Partes sobre Mudanças Climáticas (COP 30)</strong> em Belém, no coração da Amazônia brasileira, liderei a arquitetura de software que sustentou inteligência ambiental e operacional em tempo real — um sistema de criticidade máxima que manteve <strong>99.998% de disponibilidade</strong> processando dados satelitais multifonte com latência inferior a 45 milissegundos, estabelecendo novo padrão de confiabilidade em conferências climáticas globais.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-5 rounded-xl bg-gradient-to-br from-amber-500/15 to-amber-600/8 border border-amber-500/30">
                  <div className="text-2xl sm:text-3xl font-light text-amber-300 font-serif mb-2">99.998%</div>
                  <div className="text-xs text-amber-300/70 font-serif uppercase tracking-wider">Uptime Conferência</div>
                </div>
                <div className="p-5 rounded-xl bg-gradient-to-br from-yellow-500/15 to-yellow-600/8 border border-yellow-500/30">
                  <div className="text-2xl sm:text-3xl font-light text-yellow-300 font-serif mb-2">&lt;45ms</div>
                  <div className="text-xs text-yellow-300/70 font-serif uppercase tracking-wider">Latência Satelital</div>
                </div>
                <div className="p-5 rounded-xl bg-gradient-to-br from-amber-400/15 to-amber-500/8 border border-amber-400/30">
                  <div className="text-2xl sm:text-3xl font-light text-amber-200 font-serif mb-2">Zero</div>
                  <div className="text-xs text-amber-200/70 font-serif uppercase tracking-wider">Downtime · Perda</div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-80">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-br from-amber-500/30 to-yellow-600/10 rounded-2xl blur-xl" />
                <div className="rounded-2xl overflow-hidden border border-amber-500/40 shadow-2xl relative group">
                  <img
                    src={COP30_IMAGE}
                    alt="Centro de Telemetria Ambiental - COP 30"
                    className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="p-5 bg-gradient-to-t from-black via-black/70 to-transparent border-t border-amber-500/30">
                    <div className="text-xs font-serif text-amber-300 font-medium uppercase tracking-widest mb-1">
                      ★ Centro Global de Telemetria
                    </div>
                    <div className="text-[12px] text-amber-200/80 font-serif">Belém · Padrão ONU Internacional</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Notable Projects */}
        <div className="space-y-8">
          <div className="space-y-3 border-l-2 border-amber-500/40 pl-6">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-amber-500" />
              <span className="text-xs font-serif text-amber-500 uppercase tracking-widest">Portfólio Premium</span>
            </div>
            <h3 className="text-3xl font-light text-white font-serif">Projetos Emblemáticos</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {PROJECT_CASES.slice(1).map((project) => (
              <div
                key={project.id}
                className="rounded-2xl border border-amber-500/15 bg-gradient-to-br from-[#0a0d14] via-[#060a10] to-[#050809] p-7 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-neutral-500 mb-3 font-serif">
                    <span className="text-amber-600 font-medium uppercase tracking-wider">{project.category}</span>
                    <span className="text-neutral-600 bg-neutral-900/40 px-2.5 py-1 rounded-sm text-[10px]">{project.highlightTag}</span>
                  </div>
                  <h4 className="text-lg font-light text-white font-serif mb-3 group-hover:text-amber-300 transition-colors">{project.title}</h4>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-4">
                    {project.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-amber-500/10 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((t) => (
                      <span key={t} className="text-[10px] font-mono text-amber-400/80 bg-amber-500/8 px-2.5 py-1 rounded-sm border border-amber-500/15">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs font-serif text-neutral-400 pt-2 border-t border-amber-500/10">
                    {project.metrics.map((m) => (
                      <div key={m.label}>
                        <span className="text-neutral-600">{m.label}: </span>
                        <span className="text-amber-400">{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section - Luxury Executive */}
        <div className="mt-16 p-10 rounded-3xl bg-gradient-to-r from-amber-500/12 via-yellow-500/8 to-amber-600/12 border border-amber-500/25 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/8 rounded-full blur-3xl -z-10" />
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <Crown className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-light text-white font-serif mb-3">
                Loops Digital · Excelência em Transformação Digital
              </h3>
              <p className="text-neutral-400 text-sm sm:text-base font-light leading-relaxed">
                Redefina sua operação empresarial com arquitetura de classe mundial. A Loops Digital combina expertise técnica de ponta, liderança estratégica e comprometimento com excelência para construir soluções que geram valor durável e sustentável.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
