import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, MicOff, Volume2, Sparkles, Radio, AlertCircle } from 'lucide-react';

interface VoiceLiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceLiveModal: React.FC<VoiceLiveModalProps> = ({ isOpen, onClose }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('Pronto para iniciar conversa por voz');
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);

  useEffect(() => {
    return () => {
      stopVoiceSession();
    };
  }, []);

  if (!isOpen) return null;

  const startVoiceSession = async () => {
    try {
      setError(null);
      setStatusMessage('Conectando ao modelo gemini-3.8-live...');

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 24000,
      });
      audioContextRef.current = audioCtx;

      ws.onopen = async () => {
        setIsConnected(true);
        setStatusMessage('Conexão estabelecida com gemini-3.8-live. Ativando microfone...');

        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          streamRef.current = stream;

          const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
            sampleRate: 16000,
          });
          const source = inputCtx.createMediaStreamSource(stream);
          const processor = inputCtx.createScriptProcessor(4096, 1, 1);
          processorRef.current = processor;

          processor.onaudioprocess = (e) => {
            if (ws.readyState === WebSocket.OPEN) {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcm16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                const s = Math.max(-1, Math.min(1, inputData[i]));
                pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
              }
              const base64 = btoa(String.fromCharCode(...new Uint8Array(pcm16.buffer)));
              ws.send(JSON.stringify({ audio: base64 }));
            }
          };

          source.connect(processor);
          processor.connect(inputCtx.destination);
          setStatusMessage('Ouvindo em tempo real. Fale normalmente sobre seus projetos!');
        } catch (micErr: any) {
          setError('Permissão de microfone negada ou indisponível.');
          setStatusMessage('Erro no microfone.');
        }
      };

      ws.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.audio && audioContextRef.current) {
            setIsSpeaking(true);
            const binary = atob(data.audio);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
              bytes[i] = binary.charCodeAt(i);
            }

            const pcm16 = new Int16Array(bytes.buffer);
            const float32 = new Float32Array(pcm16.length);
            for (let i = 0; i < pcm16.length; i++) {
              float32[i] = pcm16[i] / 0x8000;
            }

            const buffer = audioContextRef.current.createBuffer(1, float32.length, 24000);
            buffer.copyToChannel(float32, 0);

            const bufferSource = audioContextRef.current.createBufferSource();
            bufferSource.buffer = buffer;
            bufferSource.connect(audioContextRef.current.destination);
            bufferSource.start();

            bufferSource.onended = () => {
              setIsSpeaking(false);
            };
          }
          if (data.interrupted) {
            setIsSpeaking(false);
          }
          if (data.error) {
            setError(data.error);
          }
        } catch (msgErr) {
          console.error('Error in message playback:', msgErr);
        }
      };

      ws.onerror = () => {
        setError('Falha de conexão com o WebSocket.');
        setStatusMessage('Erro de conexão.');
      };

      ws.onclose = () => {
        setIsConnected(false);
        setIsSpeaking(false);
        setStatusMessage('Sessão encerrada.');
      };
    } catch (err: any) {
      setError(err?.message || 'Falha ao iniciar conversa por voz.');
    }
  };

  const stopVoiceSession = () => {
    if (processorRef.current) {
      try {
        processorRef.current.disconnect();
      } catch {}
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch {}
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch {}
    }
    setIsConnected(false);
    setIsSpeaking(false);
    setStatusMessage('Sessão encerrada.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl">
      <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#080b11] shadow-2xl p-8 text-neutral-200 text-center overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>GEMINI-3.8-LIVE · CONVERSAÇÃO EM TEMPO REAL</span>
          </div>
          <button
            onClick={() => {
              stopVoiceSession();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Audio Visualizer Orb (Apple Siri/Titanium Inspired) */}
        <div className="relative my-8 flex items-center justify-center">
          <div
            className={`w-36 h-36 rounded-full flex items-center justify-center transition-all duration-500 ${
              isSpeaking
                ? 'scale-110 shadow-[0_0_60px_rgba(6,182,212,0.6)] border-cyan-400 bg-cyan-950/40'
                : isConnected
                ? 'shadow-[0_0_30px_rgba(6,182,212,0.3)] border-cyan-500/50 bg-neutral-900'
                : 'border-white/10 bg-neutral-950'
            } border-2`}
          >
            {isSpeaking ? (
              <Volume2 className="w-12 h-12 text-cyan-300 animate-bounce" />
            ) : isConnected ? (
              <Mic className="w-12 h-12 text-cyan-400 animate-pulse" />
            ) : (
              <MicOff className="w-12 h-12 text-neutral-600" />
            )}
          </div>
        </div>

        {/* Status Text */}
        <div className="space-y-2 mb-8">
          <h3 className="text-xl font-bold text-white font-display">
            {isConnected
              ? isSpeaking
                ? 'Loops AI Falando...'
                : 'Ouvindo sua voz...'
              : 'Agente de Voz em Tempo Real'}
          </h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto font-mono">
            {statusMessage}
          </p>
          {error && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-rose-400 bg-rose-950/30 p-2 rounded-lg border border-rose-500/20">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-3">
          {!isConnected ? (
            <button
              onClick={startVoiceSession}
              className="w-full py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <Mic className="w-4 h-4 text-black" />
              <span>Conectar e Conversar por Voz</span>
            </button>
          ) : (
            <button
              onClick={stopVoiceSession}
              className="w-full py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-rose-400 border border-rose-500/30 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <MicOff className="w-4 h-4 text-rose-400" />
              <span>Encerrar Conversa de Voz</span>
            </button>
          )}

          <div className="text-[11px] font-mono text-neutral-500">
            Latência nativa ultra-baixa · Áudio PCM 24kHz bidirecional
          </div>
        </div>
      </div>
    </div>
  );
};
