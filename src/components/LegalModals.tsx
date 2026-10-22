import React from 'react';
import { X, ShieldCheck, FileText, Lock, AlertTriangle } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const LegalModals: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const isPrivacy = type === 'privacy';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl max-h-[85vh] flex flex-col bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden text-neutral-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              {isPrivacy ? <Lock className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">
                {isPrivacy ? 'Política de Privacidade & Proteção de Dados (LGPD)' : 'Termos de Uso & Diretrizes de Anúncios'}
              </h2>
              <p className="text-xs text-neutral-400">
                Loops Digital · Belém/Cametá - PA · Em conformidade com a Lei 13.709/2018 (LGPD) e GDPR.
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs sm:text-sm leading-relaxed">
          {isPrivacy ? (
            <>
              <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-cyan-300 font-mono text-xs">
                ✅ <strong>Conformidade LGPD:</strong> Seus dados são coletados exclusivamente para a prestação de serviços de inteligência artificial, automação e comunicação comercial autorizada, com criptografia de ponta a ponta.
              </div>

              <h4 className="text-sm font-bold text-white pt-2">1. Coleta e Finalidade dos Dados</h4>
              <p>
                A Loops Digital coleta apenas as informações necessárias para qualificação de projetos, atendimento por agentes autônomos e execução contratual (ex.: Nome, E-mail corporativo, Telefone/WhatsApp e Escopo do Projeto).
              </p>

              <h4 className="text-sm font-bold text-white pt-2">2. Criptografia & Proteção Server-Side (SHA-256)</h4>
              <p>
                Qualquer dado transmitido para APIs de tráfego pago (Meta CAPI, Google Ads, TikTok) é anonimizado e criptografado com o algoritmo SHA-256 antes da transmissão, garantindo que informações pessoais confidenciais nunca sejam expostas em texto puro.
              </p>

              <h4 className="text-sm font-bold text-white pt-2">3. Direitos do Titular (LGPD)</h4>
              <p>
                Você possui o direito de confirmar a existência de tratamento, acessar seus dados, solicitar a correção de dados incompletos ou a eliminação definitiva de suas informações da nossa base de dados a qualquer momento pelo e-mail <strong>slevenkevelera@gmail.com</strong>.
              </p>
            </>
          ) : (
            <>
              <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/20 text-blue-300 font-mono text-xs">
                ⚖️ <strong>Termos Oficiais & Diretrizes de Tráfego Pago:</strong> Este documento estabelece as regras de uso do site e a transparência obrigatória exigida pelas plataformas de anúncios da Meta e Google.
              </div>

              <h4 className="text-sm font-bold text-white pt-2">1. Natureza dos Serviços</h4>
              <p>
                A Loops Digital é uma agência de tecnologia e engenharia de software especializada no desenvolvimento de agentes de inteligência artificial, esteiras de conversão, aplicativos móveis e arquiteturas para eventos de alta escala como a COP 30.
              </p>

              <h4 className="text-sm font-bold text-white pt-2">2. Isenção de Responsabilidade (Disclaimer de Resultados)</h4>
              <p>
                Em estrito cumprimento com as políticas de anúncios da Meta Ads e Google Ads: os resultados financeiros, aumento de faturamento e taxas de conversão apresentados em estudos de caso e calculadoras do site representam desempenhos técnicos obtidos em clientes específicos e dependem da infraestrutura, oferta e mercado de cada cliente. A Loops Digital não promete lucros fáceis ou garantias irreais.
              </p>

              <h4 className="text-sm font-bold text-white pt-2">3. Propriedade Intelectual</h4>
              <p>
                Todos os códigos-fonte, arquiteturas de agentes autônomos, marcas e elementos audiovisuais são de titularidade da Loops Digital, sob a liderança técnica do Engenheiro Sênior & CTO Lorenzo Cardoso.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-neutral-800 bg-neutral-900/40 flex items-center justify-between text-xs font-mono text-neutral-500">
          <span>Última atualização: Outubro de 2026 · Versão 2.4</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-sans transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
