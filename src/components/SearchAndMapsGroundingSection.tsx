import React, { useState } from 'react';
import { Search, MapPin, Globe, ExternalLink, Sparkles, Navigation, CheckCircle2, ArrowRight } from 'lucide-react';

export const SearchAndMapsGroundingSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'maps'>('search');

  // Search Grounding State
  const [searchQuery, setSearchQuery] = useState<string>('Últimos avanços em agentes de IA multimodais e COP 30');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);

  // Maps Grounding State
  const [mapLocationQuery, setMapLocationQuery] = useState<string>('Hangar Centro de Convenções da Amazônia, Belém - PA (Sede COP 30)');
  const [mapResult, setMapResult] = useState<any>(null);
  const [mapLoading, setMapLoading] = useState<boolean>(false);

  const handleSearchSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim() || searchLoading) return;

    setSearchLoading(true);
    try {
      const res = await fetch('/api/gemini/search-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await res.json();
      setSearchResult(data);
    } catch (err) {
      console.error('Search grounding error:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleMapsSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!mapLocationQuery.trim() || mapLoading) return;

    setMapLoading(true);
    try {
      const res = await fetch('/api/gemini/maps-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locationQuery: mapLocationQuery }),
      });
      const data = await res.json();
      setMapResult(data);
    } catch (err) {
      console.error('Maps grounding error:', err);
    } finally {
      setMapLoading(false);
    }
  };

  return (
    <section id="google-grounding" className="py-24 border-t border-white/[0.06] bg-[#07090f]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>LOOPS REAL-TIME GROUNDING ENGINE</span>
            <span aria-hidden="true">·</span>
            <span>GEMINI-3.5-FLASH</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-display mb-4">
            Inteligência Fundamentada em Google Search & Google Maps.
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg">
            Consultas em tempo real com validação factual na web mundial e geolocalização de sedes tecnológicas e infraestruturas como a COP 30.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 p-1.5 bg-neutral-900/60 rounded-xl border border-white/[0.08] max-w-md mb-8">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'search'
                ? 'bg-neutral-800 text-white shadow-sm border border-white/10'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-emerald-400" />
            <span>Google Search Grounding</span>
          </button>

          <button
            onClick={() => setActiveTab('maps')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'maps'
                ? 'bg-neutral-800 text-white shadow-sm border border-white/10'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            <span>Google Maps Grounding</span>
          </button>
        </div>

        {/* Content Box */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#0a0e16] p-6 sm:p-10 shadow-xl">
          {activeTab === 'search' ? (
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 space-y-4">
                <div className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  <span>BUSCA NA WEB COM FONTES VERIFICADAS</span>
                </div>
                <h3 className="text-xl font-bold text-white font-display">
                  Fatos atualizados da indústria de tecnologia e mercado.
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  Utiliza o modelo <strong>gemini-3.5-flash</strong> acoplado ao motor oficial do Google Search para fundamentar respostas com dados em tempo real e links para as fontes primárias.
                </p>

                <div className="space-y-1.5 pt-2">
                  <div className="text-[11px] font-mono text-neutral-500">SUGESTÕES DE PESQUISA:</div>
                  {[
                    'Quais são os principais projetos de tecnologia sustentável na COP 30 Belém?',
                    'Como a Meta Conversion API server-side impacta o ROAS em 2026?',
                    'Evolução dos agentes autônomos em atendimento ao cliente no WhatsApp',
                  ].map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSearchQuery(sug)}
                      className="block text-left text-xs text-neutral-400 hover:text-cyan-300 transition-colors py-1 truncate max-w-full"
                    >
                      → {sug}
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-7 space-y-4">
                <form onSubmit={handleSearchSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Faça uma pergunta para fundamentação no Google..."
                    className="flex-1 bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    disabled={searchLoading || !searchQuery.trim()}
                    className="px-5 py-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    {searchLoading ? 'Buscando...' : 'Fundamentar'}
                  </button>
                </form>

                {/* Result Window */}
                <div className="rounded-2xl bg-neutral-950 border border-white/5 p-5 min-h-[220px] flex flex-col justify-between">
                  {searchLoading ? (
                    <div className="py-12 text-center text-xs text-neutral-400 font-mono space-y-2">
                      <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <div>Consultando Google Search API com gemini-3.5-flash...</div>
                    </div>
                  ) : searchResult ? (
                    <div className="space-y-4">
                      <div className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
                        {searchResult.text}
                      </div>

                      {searchResult.sources && searchResult.sources.length > 0 && (
                        <div className="pt-3 border-t border-white/5">
                          <div className="text-[10px] font-mono text-neutral-500 mb-2">
                            FONTES RETORNADAS VIA SEARCH GROUNDING:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {searchResult.sources.map((src: any, i: number) => (
                              <a
                                key={i}
                                href={src.uri}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-[11px] font-mono text-cyan-300 transition-colors"
                              >
                                <ExternalLink className="w-3 h-3 text-cyan-400" />
                                <span className="truncate max-w-[200px]">{src.title}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-xs text-neutral-500 font-mono">
                      Envie uma pergunta ou clique em uma sugestão para verificar a fundamentação em tempo real.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 space-y-4">
                <div className="text-xs font-mono text-blue-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>MAPEAMENTO GEOGRÁFICO DE INFRAESTRUTURA</span>
                </div>
                <h3 className="text-xl font-bold text-white font-display">
                  Geolocalização de Polos Técnicos & Sedes da COP 30.
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  O Google Maps Grounding permite contextualizar a presença territorial dos projetos da Loops, como o Hangar Centro de Convenções em Belém (Amazônia) e sedes corporativas em São Paulo.
                </p>

                <div className="space-y-1.5 pt-2">
                  <div className="text-[11px] font-mono text-neutral-500">LOCAIS DESTACADOS:</div>
                  {[
                    'Hangar Centro de Convenções da Amazônia, Belém - PA (Sede COP 30)',
                    'Avenida Brigadeiro Faria Lima, São Paulo - Polo Tech Loops',
                    'Parque de Ciência e Tecnologia do Guamá (PCT Guamá), Belém - PA',
                  ].map((loc, idx) => (
                    <button
                      key={idx}
                      onClick={() => setMapLocationQuery(loc)}
                      className="block text-left text-xs text-neutral-400 hover:text-cyan-300 transition-colors py-1 truncate max-w-full"
                    >
                      📍 {loc}
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-7 space-y-4">
                <form onSubmit={handleMapsSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={mapLocationQuery}
                    onChange={(e) => setMapLocationQuery(e.target.value)}
                    placeholder="Digite um local para fundamentação com Google Maps..."
                    className="flex-1 bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    disabled={mapLoading || !mapLocationQuery.trim()}
                    className="px-5 py-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    {mapLoading ? 'Mapeando...' : 'Localizar'}
                  </button>
                </form>

                {/* Result Window */}
                <div className="rounded-2xl bg-neutral-950 border border-white/5 p-5 min-h-[220px] flex flex-col justify-between">
                  {mapLoading ? (
                    <div className="py-12 text-center text-xs text-neutral-400 font-mono space-y-2">
                      <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <div>Consultando Google Maps Grounding com gemini-3.5-flash...</div>
                    </div>
                  ) : mapResult ? (
                    <div className="space-y-4">
                      <div className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
                        {mapResult.text}
                      </div>

                      <div className="p-3 rounded-xl bg-neutral-900/60 border border-white/5 flex items-center justify-between text-xs font-mono text-neutral-400">
                        <span className="text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Coordenadas Verificadas
                        </span>
                        <span>Motor: gemini-3.5-flash (Maps API)</span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-xs text-neutral-500 font-mono">
                      Selecione um local ou digite uma coordenada para inspecionar com Google Maps Grounding.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
