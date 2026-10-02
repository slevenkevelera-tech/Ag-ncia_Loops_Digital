import React from 'react';
import { Award, Terminal, MapPin } from 'lucide-react';
import { FOUNDER_IMAGE, COP30_IMAGE, PROJECT_CASES } from '../data/mockData';

export const BiographyCop30: React.FC = () => {
  return (
    <section id="cop30-bio" className="py-24 border-t border-white/[0.06] bg-[#06080d]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Lead */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">
            <Terminal className="w-3.5 h-3.5" />
            <span>Liderança Técnica & Arquitetura</span>
            <span aria-hidden="true">·</span>
            <span>Trajetória Comprovada</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-display mb-4">
            Engenharia sênior orientada a problemas de altíssima escala.
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg">
            Mais de uma década construindo sistemas de missão crítica, inteligência artificial aplicada ao mundo real e esteiras digitais de alto rendimento.
          </p>
        </div>

        {/* Founder Bio Card */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#0a0e16] p-8 sm:p-12 mb-20 shadow-2xl relative overflow-hidden">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* Portrait Column */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden border border-white/10 aspect-[3/4] bg-neutral-950 shadow-2xl relative">
                <img
                  src={FOUNDER_IMAGE}
                  alt="Lorenzo Cardoso - Engenheiro Sênior & CTO Loops Digital"
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/15 text-xs shadow-2xl">
                  <div className="text-cyan-400 font-mono text-[11px] uppercase tracking-wider font-semibold">
                    Engenheiro Sênior & CTO
                  </div>
                  <div className="text-white font-extrabold text-base tracking-tight font-display mt-0.5">
                    Lorenzo Cardoso
                  </div>
                </div>
              </div>
            </div>

            {/* Biography Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-3">
                <div className="text-xs font-mono text-neutral-400 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>São Paulo · Belém · Atuação Global</span>
                </div>
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300 font-semibold tracking-wider uppercase">
                    <span>Engenheiro Sênior & CTO</span>
                  </div>
                  <h3 className="text-3xl sm:text-5xl font-extrabold text-white font-display tracking-tight pt-1">
                    Lorenzo Cardoso
                  </h3>
                </div>
                <p className="text-base sm:text-lg text-neutral-300 font-medium pt-1">
                  Soluções completas onde tecnologia encontra viabilidade comercial extrema.
                </p>
              </div>

              <p className="text-neutral-300 leading-relaxed text-sm sm:text-base">
                Como Engenheiro de Software Sênior e CTO da <strong>Loops Digital</strong>, eu, <strong>Lorenzo Cardoso</strong>, atuo no cruzamento exato entre a vanguarda da <strong>Inteligência Artificial</strong> e a eficiência de negócios. Ao longo da carreira, auxiliei no desenho de arquiteturas que suportaram desde cúpulas climáticas globais como a <strong>COP 30</strong> até operações comerciais que transacionam múltiplos 6 dígitos mensais.
              </p>

              <p className="text-neutral-300 leading-relaxed text-sm sm:text-base">
                Na <strong>Loops Digital</strong>, transformo a complexidade em vantagem competitiva para nossos clientes: concebemos agentes de IA que assumem conversas humanas sem soar artificiais, assim como aprendem através de algoritmos de <strong>retropropagação (backpropagation)</strong>, ou seja — uma metodologia que utiliza o gradiente do erro para ajustar os pesos da rede de forma eficiente durante o treinamento; além disso, desenvolvemos <strong>CRMs</strong> que eliminam o caos operacional, <strong>aplicativos Android</strong> com padrão internacional e estratégias de <strong>tráfego pago</strong> baseadas em ciência de dados e algoritmos preditivos.
              </p>

              {/* Core Skill Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3">
                <div className="p-3 rounded-xl bg-neutral-900/60 border border-white/5">
                  <div className="text-xs font-semibold text-white mb-0.5">Agentes de I.A</div>
                  <div className="text-[11px] text-neutral-400 font-mono">Gemini & Multimodal LLMs</div>
                </div>
                <div className="p-3 rounded-xl bg-neutral-900/60 border border-white/5">
                  <div className="text-xs font-semibold text-white mb-0.5">Tráfego Pago CAPI</div>
                  <div className="text-[11px] text-neutral-400 font-mono">Meta Ads & Google Ads</div>
                </div>
                <div className="p-3 rounded-xl bg-neutral-900/60 border border-white/5">
                  <div className="text-xs font-semibold text-white mb-0.5">CRMs Customizados</div>
                  <div className="text-[11px] text-neutral-400 font-mono">OAuth & Realtime Sync</div>
                </div>
                <div className="p-3 rounded-xl bg-neutral-900/60 border border-white/5">
                  <div className="text-xs font-semibold text-white mb-0.5">Apps Android Nativo</div>
                  <div className="text-[11px] text-neutral-400 font-mono">Kotlin & Jetpack Compose</div>
                </div>
                <div className="p-3 rounded-xl bg-neutral-900/60 border border-white/5">
                  <div className="text-xs font-semibold text-white mb-0.5">Web Sites de Alto Padrão</div>
                  <div className="text-[11px] text-neutral-400 font-mono">React / Vite / Node.js</div>
                </div>
                <div className="p-3 rounded-xl bg-neutral-900/60 border border-white/5">
                  <div className="text-xs font-semibold text-white mb-0.5">Telemetria & Big Data</div>
                  <div className="text-[11px] text-neutral-400 font-mono">Infraestruturas Críticas</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deep Dive: Special Showcase on COP 30 */}
        <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-b from-[#0a1614] to-[#070d10] p-8 sm:p-12 mb-16 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-10 items-center justify-between">
            <div className="max-w-2xl space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
                <Award className="w-4 h-4" />
                <span>CASE DE ENGENHARIA DE ESCALA MUNDIAL</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-bold text-white font-display leading-tight">
                COP 30 Belém: Telemetria e Inteligência Ambiental na Amazônia
              </h3>
              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
                Durante a Conferência das Partes sobre Mudanças Climáticas (COP 30) em Belém, no coração da Amazônia brasileira, desenvolvemos a espinha dorsal de software para telemetria e análise em tempo real de dados ambientais e operacionais em escala global.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-500/20">
                  <div className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono">99.998%</div>
                  <div className="text-xs text-neutral-400">Disponibilidade durante a cúpula</div>
                </div>
                <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-500/20">
                  <div className="text-xl sm:text-2xl font-bold text-white font-mono">&lt; 45ms</div>
                  <div className="text-xs text-neutral-400">Latência de telemetria satelital</div>
                </div>
                <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-500/20">
                  <div className="text-xl sm:text-2xl font-bold text-cyan-400 font-mono">Zero</div>
                  <div className="text-xs text-neutral-400">Downtime ou perda de dados</div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-96 rounded-2xl overflow-hidden border border-emerald-500/30 shadow-2xl relative">
              <img
                src={COP30_IMAGE}
                alt="Central de Telemetria Climática COP 30"
                className="w-full h-64 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="p-4 bg-black/80 backdrop-blur-sm border-t border-emerald-500/20">
                <div className="text-xs font-mono text-emerald-300">DELEGATE TELEMETRY HUB · COP 30</div>
                <div className="text-[11px] text-neutral-400 mt-1">Belém do Pará, Brasil · Padrão Internacional ONU</div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Notable Projects */}
        <div className="space-y-6">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
            OUTROS PROJETOS EMBLEMÁTICOS
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {PROJECT_CASES.slice(1).map((project) => (
              <div
                key={project.id}
                className="rounded-2xl border border-white/[0.08] bg-[#0a0d14] p-6 hover:border-white/20 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-2 font-mono">
                    <span className="text-cyan-400">{project.category}</span>
                    <span className="text-neutral-500">{project.highlightTag}</span>
                  </div>
                  <h4 className="text-xl font-bold text-white font-display mb-2">{project.title}</h4>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-4">
                    {project.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.06]">
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.technologies.map((t) => (
                      <span key={t} className="text-[11px] font-mono text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-white/5">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-300">
                    {project.metrics.map((m) => (
                      <div key={m.label}>
                        <span className="text-neutral-500">{m.label}: </span>
                        <span className="text-white font-semibold">{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
