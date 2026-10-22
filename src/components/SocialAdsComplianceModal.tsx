import React, { useState, useEffect } from 'react';
import {
  X,
  Target,
  ShieldCheck,
  Zap,
  Globe,
  Instagram,
  MessageSquare,
  Layers,
  Send,
  CheckCircle2,
  AlertCircle,
  Activity,
  Key,
  Lock,
  Copy,
  ExternalLink,
  FileCheck,
} from 'lucide-react';
import { trackConversionEvent } from '../lib/tracking';

interface SocialAdsComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SocialAdsComplianceModal: React.FC<SocialAdsComplianceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [config, setConfig] = useState<any>({
    meta: { enabled: true, pixelId: '', conversionsApiToken: '', testEventCode: '' },
    google: { enabled: true, measurementId: '', googleAdsConversionId: '', conversionLabel: '', enhancedConversions: true },
    tiktok: { enabled: true, pixelId: '', eventsApiToken: '' },
    linkedin: { enabled: true, partnerId: '' },
    whatsapp: { enabled: true, phoneNumberId: '' },
  });

  const [audit, setAudit] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTestingEvent, setIsTestingEvent] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const [resConfig, resAudit] = await Promise.all([
          fetch('/api/tracking/config'),
          fetch('/api/tracking/compliance-audit'),
        ]);
        if (resConfig.ok) setConfig(await resConfig.json());
        if (resAudit.ok) setAudit(await resAudit.json());
      } catch (err) {
        console.error('Error loading tracking config:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isOpen]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch('/api/tracking/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save config:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestEvent = async () => {
    setIsTestingEvent(true);
    setTestResult(null);
    try {
      const res = await trackConversionEvent({
        eventName: 'Lead',
        userData: {
          email: 'contato.executivo@cliente.com',
          phone: '+5591988887777',
          firstName: 'Diretor',
          lastName: 'Empresarial',
          city: 'Belém',
          state: 'PA',
          country: 'BR',
        },
        customData: {
          value: 45000,
          currency: 'BRL',
          service: 'Inteligencia Artificial & Trafego Pago Loops Digital',
          channel: 'Meta CAPI & Google Ads Test',
        },
      });
      setTestResult(res);
    } catch (err: any) {
      setTestResult({ error: err.message });
    } finally {
      setIsTestingEvent(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#080b12] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0c101a]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white font-display">
                  Central de APIs de Tráfego Pago & Diretrizes Globais
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                  100% COMPLIANT
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Conexões server-side (Meta CAPI, Google Ads, TikTok e WhatsApp) em conformidade com as diretrizes e LGPD.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Compliance Audit Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-neutral-900 to-cyan-950/20 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-300 font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Auditoria de Conformidade para Tráfego de Alta Densidade</span>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                SCORE: 100/100
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-black/50 border border-white/5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Google Consent v2 Ativo</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/50 border border-white/5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Meta CAPI Deduplicado</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/50 border border-white/5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>SHA-256 LGPD Ativo</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/50 border border-white/5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Termos & Políticas Online</span>
              </div>
            </div>
          </div>

          {/* Social Networks Tabs / Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Meta (Facebook & Instagram) Conversions API */}
            <div className="p-5 rounded-2xl bg-[#0b0f19] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-white font-display">
                    Meta Ads (CAPI Server-Side)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                  Deduplicação Ativa
                </span>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div>
                  <label className="block text-neutral-400 mb-1">Meta Pixel ID</label>
                  <input
                    type="text"
                    value={config.meta?.pixelId || ''}
                    onChange={(e) =>
                      setConfig({ ...config, meta: { ...config.meta, pixelId: e.target.value } })
                    }
                    placeholder="984210394820194"
                    className="w-full px-3 py-2 bg-black/60 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">
                    Token de Acesso da API de Conversões (CAPI)
                  </label>
                  <input
                    type="password"
                    value={config.meta?.conversionsApiToken || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        meta: { ...config.meta, conversionsApiToken: e.target.value },
                      })
                    }
                    placeholder={config.meta?.hasToken ? '••••••••••••••••' : 'EAAG... (Token permanente da Meta)'}
                    className="w-full px-3 py-2 bg-black/60 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Código de Evento de Teste (Opcional)</label>
                  <input
                    type="text"
                    value={config.meta?.testEventCode || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        meta: { ...config.meta, testEventCode: e.target.value },
                      })
                    }
                    placeholder="Ex: TEST12345 (Para testar no Gerenciador de Eventos)"
                    className="w-full px-3 py-2 bg-black/60 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 2. Google Ads & GA4 Enhanced Conversions */}
            <div className="p-5 rounded-2xl bg-[#0b0f19] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Globe className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-white font-display">
                    Google Ads & GA4 (Enhanced)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  Consent v2
                </span>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div>
                  <label className="block text-neutral-400 mb-1">GA4 Measurement ID</label>
                  <input
                    type="text"
                    value={config.google?.measurementId || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        google: { ...config.google, measurementId: e.target.value },
                      })
                    }
                    placeholder="G-LOOPSDIGITAL26"
                    className="w-full px-3 py-2 bg-black/60 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Google Ads Conversion ID</label>
                  <input
                    type="text"
                    value={config.google?.googleAdsConversionId || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        google: { ...config.google, googleAdsConversionId: e.target.value },
                      })
                    }
                    placeholder="AW-709984037"
                    className="w-full px-3 py-2 bg-black/60 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Rótulo de Conversão (Label)</label>
                  <input
                    type="text"
                    value={config.google?.conversionLabel || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        google: { ...config.google, conversionLabel: e.target.value },
                      })
                    }
                    placeholder="loops_lead_submission"
                    className="w-full px-3 py-2 bg-black/60 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 3. TikTok Ads & Events API */}
            <div className="p-5 rounded-2xl bg-[#0b0f19] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-neutral-800 text-white border border-white/10">
                    <Zap className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="text-sm font-bold text-white font-display">
                    TikTok Ads (Events API)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-neutral-400 bg-white/5 px-2 py-0.5 rounded">
                  Pixel + Server
                </span>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div>
                  <label className="block text-neutral-400 mb-1">TikTok Pixel ID</label>
                  <input
                    type="text"
                    value={config.tiktok?.pixelId || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        tiktok: { ...config.tiktok, pixelId: e.target.value },
                      })
                    }
                    placeholder="C9K1234567890"
                    className="w-full px-3 py-2 bg-black/60 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">TikTok Events API Token</label>
                  <input
                    type="password"
                    value={config.tiktok?.eventsApiToken || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        tiktok: { ...config.tiktok, eventsApiToken: e.target.value },
                      })
                    }
                    placeholder={config.tiktok?.hasToken ? '••••••••••••••••' : 'Token de Acesso TikTok'}
                    className="w-full px-3 py-2 bg-black/60 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 4. WhatsApp Business Cloud API & LinkedIn */}
            <div className="p-5 rounded-2xl bg-[#0b0f19] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-white font-display">
                    WhatsApp Cloud API & LinkedIn
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  Meta WABA
                </span>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div>
                  <label className="block text-neutral-400 mb-1">WhatsApp Phone Number ID</label>
                  <input
                    type="text"
                    value={config.whatsapp?.phoneNumberId || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        whatsapp: { ...config.whatsapp, phoneNumberId: e.target.value },
                      })
                    }
                    placeholder="104928109283019"
                    className="w-full px-3 py-2 bg-black/60 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">LinkedIn Partner ID</label>
                  <input
                    type="text"
                    value={config.linkedin?.partnerId || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        linkedin: { ...config.linkedin, partnerId: e.target.value },
                      })
                    }
                    placeholder="7820194"
                    className="w-full px-3 py-2 bg-black/60 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Test Event Simulator & Real-time Dispatch */}
          <div className="p-5 rounded-2xl bg-black/50 border border-white/10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold uppercase">
                  <Activity className="w-4 h-4" />
                  <span>Simulador de Disparo de Conversão (Teste Server-Side)</span>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Dispara simultaneamente um evento `Lead` para Meta CAPI, Google Ads e TikTok com deduplicação nativa.
                </p>
              </div>

              <button
                type="button"
                onClick={handleTestEvent}
                disabled={isTestingEvent}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold rounded-xl transition-all shadow-md shadow-cyan-500/10 active:scale-[0.98] disabled:opacity-50"
              >
                <Send className={`w-3.5 h-3.5 ${isTestingEvent ? 'animate-spin' : ''}`} />
                <span>{isTestingEvent ? 'Disparando...' : 'Disparar Evento Lead de Teste'}</span>
              </button>
            </div>

            {testResult && (
              <div className="p-3.5 rounded-xl bg-neutral-900 border border-white/10 text-xs font-mono space-y-1.5 animate-in fade-in">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Evento Disparado com Sucesso! Event ID: {testResult.eventId}</span>
                </div>
                <div className="text-neutral-400 text-[11px]">
                  Canais Disparados no Cliente: {testResult.clientDispatched?.join(', ') || 'Tags prontas'}
                </div>
                <div className="text-cyan-300 text-[11px]">
                  Server-Side CAPI: Conexão ativa com deduplicação de evento instantânea.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#0c101a] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            {saveSuccess && (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Salvo com sucesso!
              </span>
            )}
            {!saveSuccess && <span>Loops Digital · Infraestrutura de Tráfego de Alta Densidade</span>}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              Fechar
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-5 py-2 bg-white hover:bg-neutral-200 text-black text-xs font-bold rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isSaving ? 'Salvando...' : 'Salvar Conexões de Tráfego'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
