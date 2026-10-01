import React, { useState, useEffect } from 'react';
import { Newspaper, RefreshCw, ExternalLink, Search, Sparkles, TrendingUp, Cpu } from 'lucide-react';
import { TechNewsItem } from '../types';

export const TechNewsTerminal: React.FC = () => {
  const [news, setNews] = useState<TechNewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<string>('Atualizado agora');

  const categories = [
    'Todos',
    'Inteligência Artificial',
    'Sustentabilidade & IA',
    'Hardware & Quantum',
    'Tráfego & Dados',
    'Mobile & Android',
  ];

  const fetchNews = async (fresh: boolean = false) => {
    try {
      if (fresh) setRefreshing(true);
      else setLoading(true);

      const url = `/api/tech-news?fresh=${fresh ? 'true' : 'false'}${
        selectedCategory !== 'Todos' ? `&category=${encodeURIComponent(selectedCategory)}` : ''
      }`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.news && Array.isArray(data.news)) {
        setNews(data.news);
        setLastUpdated(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    } catch (err) {
      console.error('Failed to load tech news:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [selectedCategory]);

  const filteredNews = news.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <section id="tech-news" className="py-24 border-t border-white/[0.06] bg-[#05070a]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">
              <Newspaper className="w-3.5 h-3.5" />
              <span>LOOPS TECH INTELLIGENCE API</span>
              <span aria-hidden="true">·</span>
              <span>FEED TEMPO REAL</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
              Radar Global de Notícias & Fatos Tecnológicos
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base mt-2 max-w-2xl">
              Nossa API de inteligência processa continuamente os acontecimentos mais recentes sobre IA, avanços na COP 30, algoritmos de tráfego e computação avançada.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-neutral-400 hidden sm:inline">
              Sincronizado: <span className="text-neutral-200">{lastUpdated}</span>
            </span>
            <button
              onClick={() => fetchNews(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-neutral-200 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Buscando...' : 'Atualizar com IA'}</span>
            </button>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          {/* Segmented Category Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-neutral-200 text-black shadow-sm'
                    : 'bg-neutral-900/60 text-neutral-400 hover:text-white border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar fatos ou palavras-chave..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900/80 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
            {[1, 2, 3].map((n) => (
              <div key={n} className="rounded-xl border border-white/5 bg-neutral-900/30 p-6 animate-pulse space-y-4">
                <div className="h-4 bg-neutral-800 rounded w-1/3"></div>
                <div className="h-6 bg-neutral-800 rounded w-4/5"></div>
                <div className="h-16 bg-neutral-800 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="text-center py-16 border border-white/5 rounded-2xl bg-neutral-900/20">
            <Cpu className="w-8 h-8 text-neutral-500 mx-auto mb-3" />
            <p className="text-neutral-400 text-sm">Nenhuma notícia encontrada para esta busca.</p>
            <button
              onClick={() => {
                setSelectedCategory('Todos');
                setSearchQuery('');
              }}
              className="mt-3 text-xs text-cyan-400 underline"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-white/[0.08] bg-[#0b0e14] p-6 hover:border-white/20 transition-all duration-300 flex flex-col justify-between group shadow-sm"
              >
                <div>
                  {/* Clean unboxed metadata with typographic separators */}
                  <div className="flex items-center gap-2 text-xs text-neutral-400 mb-3">
                    <span className="text-cyan-400 font-medium">{item.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.source}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-neutral-400">{item.timestamp}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white tracking-tight leading-snug group-hover:text-cyan-200 transition-colors mb-3">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-6 font-normal">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-neutral-400">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-neutral-300">{item.metrics}</span>
                  </div>

                  <span className="text-[11px] text-neutral-500 uppercase">
                    {item.impact}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
