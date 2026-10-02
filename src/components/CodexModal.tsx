import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Code, Sparkles, RefreshCw, Copy } from 'lucide-react';

interface CodexModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodexModal: React.FC<CodexModalProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [output, setOutput] = useState<string>('');
  const [action, setAction] = useState<'generate' | 'explain' | 'optimize' | 'debug'>('generate');
  const outputRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    outputRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);
    setOutput('');

    try {
      const ws = new WebSocket(
        `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/codex-stream`
      );

      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            action,
            prompt: input,
            code: action !== 'generate' ? input : undefined,
            language: 'typescript',
          })
        );
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'chunk') {
          setOutput((prev) => prev + data.content);
        } else if (data.type === 'complete') {
          setLoading(false);
          ws.close();
        } else if (data.error) {
          console.error('Codex error:', data.error);
          setLoading(false);
          ws.close();
        }
      };

      ws.onerror = () => {
        setLoading(false);
        setOutput('Erro ao conectar ao servidor de código.');
      };
    } catch (err) {
      console.error('Error:', err);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl">
      <div className="relative w-full max-w-4xl h-[88vh] rounded-3xl border border-white/10 bg-[#080b11] shadow-2xl flex flex-col overflow-hidden text-neutral-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] bg-[#0c1018] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center">
              <Code className="w-4 h-4 text-orange-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>Loops Code Assistant (Powered by OpenAI)</span>
                <span className="text-[10px] font-mono text-orange-400 border border-orange-500/30 px-1.5 py-0.5 rounded bg-orange-950/30">
                  CODEX
                </span>
              </div>
              <div className="text-[11px] text-neutral-400 font-mono">
                Gere, explique, otimize e corrija código em tempo real
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Tabs */}
        <div className="px-6 py-2.5 border-b border-white/[0.06] bg-[#090d14] flex gap-2 flex-wrap">
          {(['generate', 'explain', 'optimize', 'debug'] as const).map((act) => (
            <button
              key={act}
              onClick={() => {
                setAction(act);
                setOutput('');
              }}
              className={`px-3 py-1 text-xs font-mono rounded capitalize transition-colors ${
                action === act
                  ? 'bg-orange-500 text-black font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {act}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {output && (
              <div className="p-4 rounded-2xl bg-neutral-900 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-orange-400">RESULTADO:</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(output)}
                    className="text-xs text-neutral-400 hover:text-white flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    Copiar
                  </button>
                </div>
                <pre className="text-xs text-neutral-200 whitespace-pre-wrap break-words font-mono">
                  {output}
                </pre>
              </div>
            )}
            {loading && (
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-orange-400" />
                <span className="text-xs text-neutral-400">
                  Processando {action}...
                </span>
              </div>
            )}
            <div ref={outputRef} />
          </div>

          {/* Input Form */}
          <div className="p-4 border-t border-white/[0.08] bg-[#0c1018] space-y-3">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  action === 'generate'
                    ? 'Descreva o código que deseja gerar...'
                    : 'Cole o código aqui...'
                }
                rows={3}
                className="flex-1 bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-orange-500 placeholder:text-neutral-500 resize-none"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-4 py-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {action}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
