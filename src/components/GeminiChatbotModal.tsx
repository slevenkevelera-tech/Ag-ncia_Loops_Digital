import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Search,
  MapPin,
  Cpu,
  Layers,
  Zap,
  Globe,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'model';
  text: string;
  timestamp: string;
  sources?: { title: string; uri: string }[];
  modelUsed?: string;
}

interface GeminiChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenVoice: () => void;
}

export const GeminiChatbotModal: React.FC<GeminiChatbotModalProps> = ({
  isOpen,
  onClose,
  onOpenVoice,
}) => {
  const [model, setModel] = useState<'gemini-3.5-flash' | 'gemini-3.1-pro-preview' | 'gemini-3.1-flash-lite'>('gemini-3.5-flash');
  const [role, setRole] = useState<'consultor' | 'engenheiro' | 'vendas'>('consultor');
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [groundingMode, setGroundingMode] = useState<'none' | 'search' | 'maps'>('none');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'model',
      text: 'Olá! Sou o Assistente Inteligente da Loops Digital. Posso auxiliá-lo na concepção de Agentes Autônomos de IA, arquiteturas de Tráfego Pago CAPI, CRMs personalizados ou detalhes técnicos da infraestrutura que desenvolvemos para a COP 30. Como posso colaborar hoje?',
      timestamp: 'Agora',
      modelUsed: 'gemini-3.5-flash',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setLoading(true);

    try {
      if (groundingMode === 'search') {
        // Search Grounding endpoint
        const res = await fetch('/api/gemini/search-grounding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: userText }),
        });
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: `model-${Date.now()}`,
            sender: 'model',
            text: data.text,
            sources: data.sources,
            timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            modelUsed: 'gemini-3.5-flash (Google Search Grounded)',
          },
        ]);
      } else if (groundingMode === 'maps') {
        // Maps Grounding endpoint
        const res = await fetch('/api/gemini/maps-grounding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ locationQuery: userText }),
        });
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: `model-${Date.now()}`,
            sender: 'model',
            text: data.text,
            timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            modelUsed: 'gemini-3.5-flash (Google Maps Grounded)',
          },
        ]);
      } else {
        // Standard multi-turn chat
        const res = await fetch('/api/gemini/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: updatedHistory.map((m) => ({ sender: m.sender, text: m.text })),
            model,
            role,
          }),
        });
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: `model-${Date.now()}`,
            sender: 'model',
            text: data.reply,
            timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            modelUsed: data.modelUsed,
          },
        ]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `model-err-${Date.now()}`,
          sender: 'model',
          text: 'Houve uma oscilação na rede, mas o núcleo de IA da Loops está ativo. Pode repetir sua solicitação?',
          timestamp: 'Agora',
          modelUsed: model,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl">
      <div className="relative w-full max-w-4xl h-[88vh] rounded-3xl border border-white/10 bg-[#080b11] shadow-2xl flex flex-col overflow-hidden text-neutral-200">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] bg-[#0c1018] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center">
              <Bot className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white font-display flex items-center gap-2">
                <span>Loops Multi-Turn AI Chatbot</span>
                <span className="text-[10px] font-mono text-cyan-400 border border-cyan-500/30 px-1.5 py-0.5 rounded bg-cyan-950/30">
                  {model}
                </span>
              </div>
              <div className="text-[11px] text-neutral-400 font-mono">
                Atendimento Técnico & Arquitetura Sênior
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenVoice();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-xs font-semibold text-cyan-300"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Modo Voz (Live API)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Roles & Models Selection Bar */}
        <div className="px-6 py-2.5 border-b border-white/[0.06] bg-[#090d14] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-neutral-500">PAPEL DO AGENTE:</span>
            <button
              onClick={() => setRole('consultor')}
              className={`px-2.5 py-1 rounded transition-colors ${
                role === 'consultor' ? 'bg-cyan-500 text-black font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Consultor
            </button>
            <button
              onClick={() => setRole('engenheiro')}
              className={`px-2.5 py-1 rounded transition-colors ${
                role === 'engenheiro' ? 'bg-cyan-500 text-black font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Engenheiro (COP 30)
            </button>
            <button
              onClick={() => setRole('vendas')}
              className={`px-2.5 py-1 rounded transition-colors ${
                role === 'vendas' ? 'bg-cyan-500 text-black font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Tráfego & Vendas
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-neutral-500">MODELO:</span>
            <select
              value={model}
              onChange={(e: any) => setModel(e.target.value)}
              className="bg-neutral-900 border border-white/10 rounded px-2 py-1 text-white focus:outline-none"
            >
              <option value="gemini-3.5-flash">gemini-3.5-flash (Geral)</option>
              <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Complexo)</option>
              <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Rápido)</option>
            </select>
          </div>
        </div>

        {/* Scrollable Message Thread */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'model' && (
                <div className="w-8 h-8 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-white text-black font-medium rounded-tr-none'
                    : 'bg-neutral-900 border border-white/10 text-neutral-200 rounded-tl-none shadow-sm'
                }`}
              >
                {msg.sender === 'model' && (
                  <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 mb-1.5 pb-1 border-b border-white/5">
                    <span>LOOPS AI</span>
                    <span className="text-neutral-500">{msg.modelUsed || model}</span>
                  </div>
                )}

                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Grounding Web Sources Citations */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-white/10 space-y-1">
                    <span className="text-[10px] font-mono text-neutral-400 block">
                      FONTES VERIFICADAS (GOOGLE SEARCH GROUNDING):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.sources.map((s, idx) => (
                        <a
                          key={idx}
                          href={s.uri}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-300 bg-neutral-950 px-2 py-0.5 rounded border border-white/10 hover:border-cyan-400"
                        >
                          <ExternalLink className="w-2.5 h-2.5" />
                          <span className="truncate max-w-[180px]">{s.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  className={`text-[9px] font-mono text-right mt-1.5 ${
                    msg.sender === 'user' ? 'text-neutral-500' : 'text-neutral-500'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-neutral-800 border border-white/10 text-neutral-200 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-neutral-900 border border-white/10 text-xs text-neutral-400 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                <span>
                  {groundingMode === 'search'
                    ? 'Pesquisando na web em tempo real (Google Search Grounding)...'
                    : groundingMode === 'maps'
                    ? 'Processando coordenadas geográficas (Google Maps Grounding)...'
                    : 'Processando inferência com modelo selecionado...'}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar & Grounding Toggles */}
        <div className="p-4 border-t border-white/[0.08] bg-[#0c1018] space-y-2">
          {/* Grounding Tool Selector */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-neutral-500">FUNDAMENTAÇÃO GOOGLE:</span>
            <button
              onClick={() => setGroundingMode(groundingMode === 'search' ? 'none' : 'search')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded border transition-colors ${
                groundingMode === 'search'
                  ? 'bg-emerald-500 text-black font-bold border-emerald-400'
                  : 'bg-neutral-900 text-neutral-400 border-white/5 hover:text-white'
              }`}
            >
              <Search className="w-3 h-3" />
              <span>Google Search</span>
            </button>
            <button
              onClick={() => setGroundingMode(groundingMode === 'maps' ? 'none' : 'maps')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded border transition-colors ${
                groundingMode === 'maps'
                  ? 'bg-blue-500 text-white font-bold border-blue-400'
                  : 'bg-neutral-900 text-neutral-400 border-white/5 hover:text-white'
              }`}
            >
              <MapPin className="w-3 h-3" />
              <span>Google Maps</span>
            </button>
          </div>

          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                groundingMode === 'search'
                  ? 'Faça uma pergunta para buscar na web em tempo real...'
                  : groundingMode === 'maps'
                  ? 'Pergunte sobre localidades, sedes ou COP 30 Belém...'
                  : 'Digite sua mensagem ou dúvida técnica para a Loops Digital...'
              }
              className="flex-1 bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500 placeholder:text-neutral-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-3 rounded-xl bg-white hover:bg-neutral-200 text-black transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
