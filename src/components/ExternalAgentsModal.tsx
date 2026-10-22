import React, { useState, useEffect } from 'react';
import {
  X,
  Cpu,
  Link,
  ShieldCheck,
  Send,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Key,
  Globe,
  Bot,
  Zap,
  Eye,
  EyeOff,
  Activity,
  Layers,
} from 'lucide-react';

interface AgentItem {
  id: string;
  name: string;
  specialty: string;
  status: string;
}

interface ExternalAgentsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExternalAgentsModal: React.FC<ExternalAgentsModalProps> = ({ isOpen, onClose }) => {
  const [endpointUrl, setEndpointUrl] = useState('');
  const [authType, setAuthType] = useState('bearer');
  const [token, setToken] = useState('');
  const [headerName, setHeaderName] = useState('Authorization');
  const [autoDispatchLeads, setAutoDispatchLeads] = useState(true);
  const [maskedToken, setMaskedToken] = useState('');
  const [hasToken, setHasToken] = useState(false);
  const [showToken, setShowToken] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    latencyMs?: number;
    status?: number;
    data?: any;
  } | null>(null);

  const [agents, setAgents] = useState<AgentItem[]>([]);
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);
  const [testDemandText, setTestDemandText] = useState(
    'Cliente corporativo solicita implementação de automação de atendimento e esteira de conversão na Amazônia/COP 30.'
  );

  // Load existing config on mount / open
  useEffect(() => {
    if (!isOpen) return;

    const loadConfig = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/external-agents');
        if (res.ok) {
          const data = await res.json();
          setEndpointUrl(data.endpointUrl || '');
          setAuthType(data.authType || 'bearer');
          setHeaderName(data.headerName || 'Authorization');
          setAutoDispatchLeads(data.autoDispatchLeads !== false);
          setMaskedToken(data.maskedToken || '');
          setHasToken(data.hasToken || false);
          setAgents(data.discoveredAgents || []);
        }
      } catch (err) {
        console.error('Error fetching external agents config:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, [isOpen]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/external-agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpointUrl,
          authType,
          token: token.trim() || undefined,
          headerName,
          autoDispatchLeads,
          discoveredAgents: agents,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setTestResult({
          success: true,
          message: 'Configurações de integração salvas com sucesso!',
        });
        if (token.trim()) {
          setHasToken(true);
          setMaskedToken(`${token.slice(0, 4)}••••••••${token.slice(-4)}`);
          setToken('');
        }
      } else {
        setTestResult({ success: false, message: data.error || 'Erro ao salvar' });
      }
    } catch (err: any) {
      setTestResult({ success: false, message: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/external-agents/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpointUrl,
          authType,
          token: token.trim() || undefined,
          headerName,
        }),
      });
      const data = await res.json();
      setTestResult(data);
      if (data.discoveredAgents && Array.isArray(data.discoveredAgents)) {
        setAgents(data.discoveredAgents);
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: `Falha na requisição: ${err.message}`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleDispatchTestDemand = async () => {
    setDispatchStatus('Enviando...');
    try {
      const res = await fetch('/api/external-agents/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          demand: {
            title: 'Demanda de Teste Manual',
            description: testDemandText,
            priority: 'ALTA',
            platform: 'Loops Digital Web Hub',
          },
          clientInfo: {
            name: 'Lorenzo Cardoso (Admin Teste)',
            contact: 'slevenkevelera@gmail.com',
            location: 'Belém/Cametá - PA',
          },
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDispatchStatus(`Demanda aceita pelos agentes externos! (${data.latencyMs}ms)`);
      } else {
        setDispatchStatus(`Retorno do endpoint: status ${data.status || 500}`);
      }
    } catch (err: any) {
      setDispatchStatus(`Erro ao despachar: ${err.message}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white font-display">
                  Gateway de Agentes Externos (OAuth & Webhooks)
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  ENDPOINT ATIVO
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Conecte plataformas externas de agentes autônomos para receber e processar as demandas do site.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Connection Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Endpoint & Authentication */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
                <Globe className="w-4 h-4" />
                <span>Configuração do Endpoint Remoto</span>
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1.5">
                  URL do Endpoint / Webhook da Plataforma
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={endpointUrl}
                    onChange={(e) => setEndpointUrl(e.target.value)}
                    placeholder="https://api.sua-plataforma.com/v1/agents"
                    className="w-full px-3.5 py-2.5 bg-neutral-900/90 border border-neutral-700 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Link className="w-4 h-4 text-neutral-500" />
                  </div>
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">
                  Recebe eventos de novos contatos, cotações e solicitações de clientes em tempo real.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1.5">
                    Tipo de Autenticação
                  </label>
                  <select
                    value={authType}
                    onChange={(e) => setAuthType(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="bearer">Bearer Token (OAuth2 / JWT)</option>
                    <option value="apikey">API Key / Token Direto</option>
                    <option value="custom">Header Personalizado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1.5">
                    Nome do Header HTTP
                  </label>
                  <input
                    type="text"
                    value={headerName}
                    onChange={(e) => setHeaderName(e.target.value)}
                    placeholder="Authorization"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono text-neutral-400">
                    Token de Acesso / Chave OAuth
                  </label>
                  {hasToken && (
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Token ativo salvo
                    </span>
                  )}
                </div>

                <div className="relative">
                  <input
                    type={showToken ? 'text' : 'password'}
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder={hasToken ? maskedToken : 'Insira o token ou credencial OAuth'}
                    className="w-full px-3.5 py-2.5 bg-neutral-900/90 border border-neutral-700 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 font-mono pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                  >
                    {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">
                  O token é armazenado com criptografia no servidor e nunca é exposto no frontend.
                </p>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoDispatchLeads}
                    onChange={(e) => setAutoDispatchLeads(e.target.checked)}
                    className="rounded border-neutral-700 text-cyan-500 focus:ring-cyan-400"
                  />
                  <span className="text-xs text-neutral-300 font-medium">
                    Encaminhar automaticamente novas demandas do site para este endpoint
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting || !endpointUrl}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
                >
                  <Activity className={`w-3.5 h-3.5 text-cyan-400 ${isTesting ? 'animate-spin' : ''}`} />
                  <span>{isTesting ? 'Testando...' : 'Testar Conexão (Ping)'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-xl text-xs transition-all shadow-lg shadow-cyan-500/10"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Salvar Conexão</span>
                </button>
              </div>

              {/* Test Connection Results Badge */}
              {testResult && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                    testResult.success
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                      : 'bg-red-950/20 border-red-500/30 text-red-300'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-semibold">{testResult.message}</div>
                    {testResult.latencyMs !== undefined && (
                      <div className="text-[11px] font-mono text-neutral-400 mt-0.5">
                        Latência: {testResult.latencyMs}ms · Código HTTP: {testResult.status || 200}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Swarm of Agents & Demand Dispatcher */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
                  <Layers className="w-4 h-4" />
                  <span>Agentes Sincronizados no Swarm ({agents.length})</span>
                </div>
                <span className="text-[10px] font-mono text-neutral-500">POOL EM TEMPO REAL</span>
              </div>

              {/* Agent Cards */}
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    className="p-3 bg-neutral-900/70 border border-neutral-800 rounded-xl flex items-center justify-between hover:border-neutral-700 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <div>
                        <div className="text-xs font-semibold text-white">{agent.name}</div>
                        <div className="text-[11px] text-neutral-400">{agent.specialty}</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-800 text-neutral-300 border border-neutral-700">
                      {agent.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Test Dispatch Form */}
              <div className="p-3.5 bg-neutral-900/50 border border-neutral-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-neutral-300 flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Despachar Demanda de Teste</span>
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400">SIMULAÇÃO AO VIVO</span>
                </div>
                <textarea
                  rows={2}
                  value={testDemandText}
                  onChange={(e) => setTestDemandText(e.target.value)}
                  className="w-full p-2.5 bg-black/60 border border-neutral-800 rounded-lg text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-cyan-400 resize-none font-mono"
                />
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={handleDispatchTestDemand}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-lg text-xs font-medium transition-colors"
                  >
                    <Zap className="w-3 h-3" />
                    <span>Enviar Demanda aos Agentes</span>
                  </button>
                  {dispatchStatus && (
                    <span className="text-[11px] font-mono text-neutral-400 truncate max-w-[200px]">
                      {dispatchStatus}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-[11px] text-neutral-400 leading-relaxed">
                💡 <strong className="text-cyan-300">Como funciona:</strong> Ao cadastrar sua URL de webhook ou API externa com OAuth/Bearer Token, todas as demandas submetidas pelos clientes neste site (como orçamentos, agendamentos e leads) serão automaticamente enviadas para o seu pool de agentes externos trabalharem de forma autônoma.
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-neutral-800 bg-neutral-900/30 flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Loops Digital API Gateway · Suporte a OAuth 2.0, Bearer & Webhooks</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
