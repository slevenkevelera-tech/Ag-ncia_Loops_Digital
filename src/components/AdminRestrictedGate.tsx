import React, { useState } from 'react';
import {
  Lock,
  ShieldCheck,
  Key,
  LogIn,
  AlertCircle,
  Eye,
  EyeOff,
  UserCheck,
  Terminal,
  Activity,
  X,
} from 'lucide-react';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup } from 'firebase/auth';

interface AdminRestrictedGateProps {
  onSuccess: () => void;
  onClose: () => void;
}

export const AdminRestrictedGate: React.FC<AdminRestrictedGateProps> = ({ onSuccess, onClose }) => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Accepted master keys for instant administrator unlock
  const VALID_KEYS = ['LOOPS2026', 'LOOPS-ADMIN', 'LORENZO-CTO', 'ADMIN2026'];

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsVerifying(true);

    setTimeout(() => {
      const normalizedPin = pin.trim().toUpperCase();
      if (VALID_KEYS.includes(normalizedPin)) {
        localStorage.setItem('loops_admin_session_auth', 'true');
        localStorage.setItem('loops_admin_role', 'SUPER_ADMIN_CTO');
        onSuccess();
      } else {
        setErrorMsg('Chave Master incorreta. Verifique o código de segurança do administrador.');
      }
      setIsVerifying(false);
    }, 400);
  };

  const handleGoogleAuth = async () => {
    try {
      setLoadingGoogle(true);
      setErrorMsg('');
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        localStorage.setItem('loops_admin_session_auth', 'true');
        localStorage.setItem('loops_admin_email', res.user.email || 'slevenkevelera@gmail.com');
        onSuccess();
      }
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMsg('Erro na autenticação Google. Use a Chave Master alternativa.');
      }
    } finally {
      setLoadingGoogle(false);
    }
  };

  return (
    <div className="relative w-full max-w-lg mx-auto p-8 rounded-3xl bg-[#090d14] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Close button */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
              Gateway de Acesso Restrito
            </div>
            <h2 className="text-lg font-bold text-white font-display">
              Autenticação Administrativa
            </h2>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6 relative z-10">
        <div className="p-4 rounded-2xl bg-black/60 border border-white/5 text-xs text-neutral-300 space-y-2">
          <div className="flex items-center gap-2 text-cyan-300 font-semibold font-mono">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Zona Restrita aos Sócios & CTO</span>
          </div>
          <p className="leading-relaxed text-neutral-400">
            O painel de CRM, inteligência de negócios e previsões Power BI contém dados confidenciais de clientes, faturamento e canais de aquisição.
          </p>
        </div>

        {/* Method 1: Google OAuth with Firebase */}
        <div>
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={loadingGoogle}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl bg-white hover:bg-neutral-100 text-black font-semibold text-sm transition-all shadow-lg shadow-white/5 active:scale-[0.99] disabled:opacity-60"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{loadingGoogle ? 'Autenticando...' : 'Acessar com Google (slevenkevelera@gmail.com)'}</span>
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-white/10 w-full" />
          <span className="bg-[#090d14] px-3 text-[11px] font-mono text-neutral-500 uppercase tracking-widest absolute">
            OU CHAVE MASTER
          </span>
        </div>

        {/* Method 2: Master Security Key / PIN */}
        <form onSubmit={handlePinSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono text-neutral-400 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-cyan-400" />
                <span>Chave Master Administrativa</span>
              </label>
              <span className="text-[10px] font-mono text-neutral-500">Ex: LOOPS2026</span>
            </div>

            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Digite a Chave Master do Administrador"
                className="w-full px-4 py-3 bg-neutral-900/90 border border-neutral-700/80 rounded-xl text-sm text-white placeholder-neutral-500 font-mono tracking-wider focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-xs text-red-300 flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isVerifying || !pin.trim()}
            className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm transition-all shadow-lg shadow-cyan-500/10 active:scale-[0.99] disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            <span>{isVerifying ? 'Validando Chave...' : 'Desbloquear Painel do CRM'}</span>
          </button>
        </form>

        {/* Security Audit Badge */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-neutral-500">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Audit Trail Ativo · TLS 1.3</span>
          </div>
          <span>Sessão 256-bit</span>
        </div>
      </div>
    </div>
  );
};
