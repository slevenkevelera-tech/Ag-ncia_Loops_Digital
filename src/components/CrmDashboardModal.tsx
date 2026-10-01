import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Bot,
  MessageSquare,
  Instagram,
  Linkedin,
  Twitter,
  Search,
  Filter,
  CheckCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Settings,
  Plus,
  Radio,
  ExternalLink,
  Lock,
  LogOut,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { CrmLead, SocialChannelConnection } from '../types';
import { INITIAL_CHANNELS } from '../data/mockData';
import { auth, db, googleProvider, handleFirestoreError, OperationType, getGoogleAuthErrorMessage } from '../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, onSnapshot, doc, setDoc, updateDoc } from 'firebase/firestore';

interface CrmDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  isGoogleAuthenticated: boolean;
  onToggleGoogleAuth: () => void;
}

export const CrmDashboardModal: React.FC<CrmDashboardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'channels' | 'agent-config' | 'new-lead'>('pipeline');
  const [leads, setLeads] = useState<CrmLead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedLead, setSelectedLead] = useState<CrmLead | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [channels, setChannels] = useState<SocialChannelConnection[]>(INITIAL_CHANNELS);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Agent Settings State
  const [autoReplyEnabled, setAutoReplyEnabled] = useState<boolean>(true);
  const [minQualificationScore, setMinQualificationScore] = useState<number>(85);
  const [responseDelaySeconds, setResponseDelaySeconds] = useState<number>(5);

  // New Lead Form State
  const [newLeadForm, setNewLeadForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    channel: 'instagram' as 'instagram' | 'whatsapp' | 'linkedin' | 'x',
    channelHandle: '',
    intent: '',
    budgetTier: 'R$ 20.000 - R$ 40.000',
    lastMessage: '',
  });

  // Track Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setAuthLoading(true);
      setAuthError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      setAuthError(getGoogleAuthErrorMessage(err));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Sign-out error:', err);
    }
  };

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/crm/leads');
      const data = await res.json();
      if (data.leads) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error('Failed to fetch CRM leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLeads();

      // Set up real-time listener for Firestore collection 'leads' if user is authenticated
      if (firebaseUser) {
        const unsubscribe = onSnapshot(
          collection(db, 'leads'),
          (snapshot) => {
            if (!snapshot.empty) {
              const firestoreLeads: CrmLead[] = [];
              snapshot.forEach((d) => {
                firestoreLeads.push(d.data() as CrmLead);
              });
              if (firestoreLeads.length > 0) {
                setLeads(firestoreLeads);
              }
            }
          },
          (error) => {
            handleFirestoreError(error, OperationType.GET, 'leads');
          }
        );
        return () => unsubscribe();
      }
    }
  }, [isOpen, firebaseUser]);

  if (!isOpen) return null;

  const handleUpdateLeadStatus = async (leadId: string, newStatus: CrmLead['status']) => {
    try {
      // Update via backend API
      const res = await fetch(`/api/crm/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
        );
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead({ ...selectedLead, status: newStatus });
        }
      }

      // Sync to Firestore if authenticated
      if (firebaseUser) {
        try {
          await updateDoc(doc(db, 'leads', leadId), { status: newStatus });
        } catch (fsErr) {
          handleFirestoreError(fsErr, OperationType.UPDATE, `leads/${leadId}`);
        }
      }
    } catch (err) {
      console.error('Failed updating lead status:', err);
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.name || !newLeadForm.lastMessage) return;

    try {
      const payload: CrmLead = {
        id: `lead-${Date.now()}`,
        name: newLeadForm.name,
        company: newLeadForm.company,
        email: newLeadForm.email,
        phone: newLeadForm.phone,
        channel: newLeadForm.channel,
        channelHandle: newLeadForm.channelHandle || '@lead',
        status: 'qualificado',
        leadScore: 92,
        budgetTier: newLeadForm.budgetTier,
        intent: newLeadForm.intent || 'Contato direto via painel CRM',
        lastMessage: newLeadForm.lastMessage,
        createdAt: new Date().toISOString(),
        tags: ['Lead Manual', newLeadForm.channel.toUpperCase()],
        aiAgentResponse: 'Lead adicionado via painel executivo com alta prioridade de fechamento.',
      };

      const res = await fetch('/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const created = await res.json();
        setLeads([created, ...leads]);
        setActiveTab('pipeline');

        // Sync to Firestore
        if (firebaseUser) {
          try {
            await setDoc(doc(db, 'leads', payload.id), payload);
          } catch (fsErr) {
            handleFirestoreError(fsErr, OperationType.WRITE, `leads/${payload.id}`);
          }
        }

        setNewLeadForm({
          name: '',
          company: '',
          email: '',
          phone: '',
          channel: 'instagram',
          channelHandle: '',
          intent: '',
          budgetTier: 'R$ 20.000 - R$ 40.000',
          lastMessage: '',
        });
      }
    } catch (err) {
      console.error('Error creating lead:', err);
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'instagram':
        return <Instagram className="w-3.5 h-3.5 text-pink-400" />;
      case 'whatsapp':
        return <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />;
      case 'linkedin':
        return <Linkedin className="w-3.5 h-3.5 text-blue-400" />;
      case 'x':
        return <Twitter className="w-3.5 h-3.5 text-neutral-300" />;
      default:
        return <Radio className="w-3.5 h-3.5 text-cyan-400" />;
    }
  };

  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.intent.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChannel = channelFilter === 'all' || l.channel === channelFilter;
    return matchesSearch && matchesChannel;
  });

  const columns: { id: CrmLead['status']; label: string; countLabel: string }[] = [
    { id: 'novo', label: 'Novas Mensagens', countLabel: 'Triagem IA' },
    { id: 'qualificado', label: 'Qualificados por IA', countLabel: 'Score > 85' },
    { id: 'negociacao', label: 'Em Negociação', countLabel: 'Atendimento Sênior' },
    { id: 'proposta', label: 'Proposta Enviada', countLabel: 'Validação Técnica' },
    { id: 'fechado', label: 'Fechado / Ganho', countLabel: 'Contrato Ativo' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl">
      <div className="relative w-full max-w-7xl h-[92vh] rounded-3xl border border-white/10 bg-[#080b11] shadow-2xl flex flex-col overflow-hidden text-neutral-200">
        {/* Top Bar with Google OAuth */}
        <div className="px-6 py-4 border-b border-white/[0.08] bg-[#0c1018] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center">
              <Bot className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white font-display flex items-center gap-2">
                <span>Loops CRM & Omnichannel Command Hub</span>
                <span className="text-[10px] font-mono text-cyan-400 border border-cyan-500/30 px-1.5 py-0.5 rounded bg-cyan-950/30">
                  ENTERPRISE v2.6
                </span>
              </div>
              <div className="text-xs text-neutral-400">
                Painel Administrativo com Agentes de IA Autônomos
              </div>
            </div>
          </div>

          {/* Google OAuth Status / Login Area */}
          <div className="flex items-center gap-3">
            {firebaseUser ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-white/10 text-xs">
                {firebaseUser.photoURL ? (
                  <img src={firebaseUser.photoURL} alt="" className="w-5 h-5 rounded-full" />
                ) : (
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
                )}
                <div className="flex flex-col text-left">
                  <span className="font-semibold text-white leading-tight">
                    {firebaseUser.displayName || 'Engenheiro Sênior (Admin)'}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {firebaseUser.email || 'slevenkevelera@gmail.com'}
                  </span>
                </div>
                <button
                  onClick={handleGoogleSignOut}
                  title="Desconectar Firebase Auth"
                  className="ml-2 text-neutral-400 hover:text-white"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleSignIn}
                disabled={authLoading}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition-colors disabled:opacity-60"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
                <span>{authLoading ? 'Conectando...' : 'Google Sign-In (Firebase)'}</span>
              </button>
            )}
            {authError && (
              <div className="max-w-xs text-[10px] leading-snug text-rose-300 bg-rose-950/40 border border-rose-500/30 rounded-lg px-2 py-1.5">
                {authError}
              </div>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs & Metrics Header */}
        <div className="px-6 py-3 border-b border-white/[0.06] bg-[#090d14] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'pipeline'
                  ? 'bg-neutral-800 text-white border border-white/10'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Pipeline de Leads
            </button>
            <button
              onClick={() => setActiveTab('channels')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'channels'
                  ? 'bg-neutral-800 text-white border border-white/10'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>Redes Conectadas</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            </button>
            <button
              onClick={() => setActiveTab('agent-config')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'agent-config'
                  ? 'bg-neutral-800 text-white border border-white/10'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Regras do Agente IA
            </button>
            <button
              onClick={() => setActiveTab('new-lead')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                activeTab === 'new-lead'
                  ? 'bg-neutral-800 text-white border border-white/10'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Lead</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
            <div>
              TOTAL: <span className="text-white font-bold">{leads.length}</span>
            </div>
            <div>
              PIPELINE ESTIMADO:{' '}
              <span className="text-emerald-400 font-bold">R$ 380.000</span>
            </div>
            <div>
              QUALIFICAÇÃO IA: <span className="text-cyan-400 font-bold">94.8%</span>
            </div>
          </div>
        </div>

        {/* Tab 1: Pipeline / Kanban Board */}
        {activeTab === 'pipeline' && (
          <div className="flex-1 flex flex-col p-6 overflow-hidden">
            {/* Search and Filters */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="relative min-w-[280px]">
                <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filtrar lead por nome, empresa ou dor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-neutral-900/80 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-neutral-500">CANAL:</span>
                {['all', 'instagram', 'whatsapp', 'linkedin', 'x'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setChannelFilter(c)}
                    className={`px-2.5 py-1 text-[11px] font-mono rounded border uppercase transition-colors ${
                      channelFilter === c
                        ? 'bg-neutral-200 text-black border-neutral-200 font-bold'
                        : 'bg-neutral-900 text-neutral-400 border-white/5 hover:text-white'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Kanban Columns */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-3 overflow-y-auto pb-4">
              {columns.map((col) => {
                const columnLeads = filteredLeads.filter((l) => l.status === col.id);
                return (
                  <div
                    key={col.id}
                    className="flex flex-col rounded-2xl bg-neutral-950/70 border border-white/5 p-3 min-h-[350px]"
                  >
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5">
                      <div>
                        <div className="text-xs font-bold text-white font-display">
                          {col.label}
                        </div>
                        <div className="text-[10px] text-neutral-500 font-mono">
                          {col.countLabel}
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-cyan-400 bg-neutral-900 px-2 py-0.5 rounded-full border border-white/5">
                        {columnLeads.length}
                      </span>
                    </div>

                    <div className="flex-1 space-y-2.5 overflow-y-auto pr-1">
                      {columnLeads.map((lead) => (
                        <div
                          key={lead.id}
                          onClick={() => setSelectedLead(lead)}
                          className="p-3 rounded-xl bg-neutral-900 border border-white/5 hover:border-cyan-500/40 transition-all cursor-pointer shadow-sm group"
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                              {lead.name}
                            </span>
                            <div className="flex items-center gap-1">
                              {getChannelIcon(lead.channel)}
                              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                                {lead.leadScore}
                              </span>
                            </div>
                          </div>

                          <div className="text-[11px] text-neutral-400 line-clamp-1 mb-2">
                            {lead.company || lead.channelHandle}
                          </div>

                          <p className="text-[11px] text-neutral-300 italic line-clamp-2 mb-2 bg-neutral-950/60 p-1.5 rounded border border-white/5">
                            "{lead.lastMessage}"
                          </p>

                          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 pt-1.5 border-t border-white/5">
                            <span>{lead.budgetTier}</span>
                            <span className="text-cyan-400 font-semibold flex items-center gap-0.5">
                              Abrir <ChevronRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Connected Social Channels */}
        {activeTab === 'channels' && (
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-lg font-bold text-white font-display">
                  Conexões com as Maiores Redes Sociais
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Os agentes de IA da Loops operam diretamente através dos Webhooks das APIs oficiais.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {channels.map((chan) => (
                  <div
                    key={chan.id}
                    className="p-5 rounded-2xl bg-neutral-900/60 border border-white/10 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          {getChannelIcon(chan.id)}
                          <span className="text-sm font-bold text-white font-display">
                            {chan.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 rounded">
                          ATIVO
                        </span>
                      </div>

                      <div className="space-y-1 text-xs font-mono text-neutral-300 mb-4">
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Status do Webhook:</span>
                          <span className="text-emerald-400">Escutando 24/7</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Mensagens 24h:</span>
                          <span className="text-white">{chan.messagesProcessed24h}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Taxa de Resposta IA:</span>
                          <span className="text-cyan-400">{chan.aiResponseRate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-neutral-500 font-mono">
                        API Oficial Conectada
                      </span>
                      <button
                        onClick={() => alert(`Webhook do ${chan.name} sincronizado com sucesso!`)}
                        className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                      >
                        Testar Ping
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Security & Webhook Info */}
              <div className="p-4 rounded-xl bg-neutral-950/80 border border-white/5 text-xs text-neutral-400 space-y-2 font-mono">
                <div className="flex items-center gap-2 text-cyan-300 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Criptografia de Ponta a Ponta & LGPD / GDPR Compliance</span>
                </div>
                <p>
                  Todas as credenciais de API são protegidas no cluster server-side e não expostas ao cliente. Respostas dos Agentes de IA respeitam as diretrizes de conformidade das plataformas Meta e LinkedIn.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: AI Agent Master Configuration */}
        {activeTab === 'agent-config' && (
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-lg font-bold text-white font-display">
                  Configurações do Agente de IA Autônomo
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Ajuste o comportamento do cérebro neural que atende seus clientes nas redes sociais.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Auto-Reply Autônomo</div>
                    <div className="text-[11px] text-neutral-400">
                      Permitir que o agente responda DMs e mensagens de WhatsApp sem intervenção humana.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoReplyEnabled}
                    onChange={(e) => setAutoReplyEnabled(e.target.checked)}
                    className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-xl bg-neutral-900 border border-white/10 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">Score Mínimo para Qualificação Automática:</span>
                    <span className="font-mono text-cyan-400 font-bold">{minQualificationScore} pts</span>
                  </div>
                  <input
                    type="range"
                    min={60}
                    max={95}
                    value={minQualificationScore}
                    onChange={(e) => setMinQualificationScore(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                  <div className="text-[11px] text-neutral-400">
                    Leads com score acima deste limite recebem o link para o Google Calendar do Engenheiro Sênior.
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-neutral-900 border border-white/10 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">Tempo de Simulação de Digitação Humana:</span>
                    <span className="font-mono text-emerald-400 font-bold">{responseDelaySeconds} segundos</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={15}
                    value={responseDelaySeconds}
                    onChange={(e) => setResponseDelaySeconds(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                  <div className="text-[11px] text-neutral-400">
                    Simula a digitação natural no Instagram e WhatsApp para evitar bloqueios ou respostas robóticas imediatas.
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-neutral-900 border border-white/10 space-y-2">
                  <div className="text-xs font-bold text-white">Prompt Base do Sistema (System Instruction):</div>
                  <div className="p-3 rounded-lg bg-neutral-950 font-mono text-[11px] text-neutral-300 leading-relaxed border border-white/5">
                    "Você é o Agente de IA Conversacional da Loops Digital, fundada pelo Engenheiro Sênior especialista em IA, Automação, Tráfego Pago e projetos globais como a COP 30. Seja sofisticado, empático e resolutivo. Identifique o orçamento e promova agendamento."
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Manual Lead Form */}
        {activeTab === 'new-lead' && (
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-xl mx-auto">
              <div className="border-b border-white/10 pb-4 mb-6">
                <h3 className="text-lg font-bold text-white font-display">
                  Cadastrar Lead Manualmente
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Insira um contato para ser acompanhado no pipeline da agência.
                </p>
              </div>

              <form onSubmit={handleCreateLead} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1 font-mono">Nome Completo</label>
                    <input
                      required
                      type="text"
                      value={newLeadForm.name}
                      onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                      placeholder="Ex: Carlos Albuquerque"
                      className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1 font-mono">Empresa / Negócio</label>
                    <input
                      type="text"
                      value={newLeadForm.company}
                      onChange={(e) => setNewLeadForm({ ...newLeadForm, company: e.target.value })}
                      placeholder="Ex: Grupo Alpha Health"
                      className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1 font-mono">E-mail</label>
                    <input
                      type="email"
                      value={newLeadForm.email}
                      onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                      placeholder="carlos@alpha.com.br"
                      className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1 font-mono">Telefone / WhatsApp</label>
                    <input
                      type="text"
                      value={newLeadForm.phone}
                      onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                      placeholder="+55 (11) 99876-5432"
                      className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1 font-mono">Canal Social de Origem</label>
                    <select
                      value={newLeadForm.channel}
                      onChange={(e: any) => setNewLeadForm({ ...newLeadForm, channel: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="instagram">Instagram Direct</option>
                      <option value="whatsapp">WhatsApp Business</option>
                      <option value="linkedin">LinkedIn B2B</option>
                      <option value="x">X (Twitter)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1 font-mono">Faixa Orçamentária</label>
                    <select
                      value={newLeadForm.budgetTier}
                      onChange={(e) => setNewLeadForm({ ...newLeadForm, budgetTier: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="R$ 15.000 - R$ 30.000">R$ 15.000 - R$ 30.000</option>
                      <option value="R$ 30.000 - R$ 60.000">R$ 30.000 - R$ 60.000</option>
                      <option value="R$ 60.000 - R$ 120.000+">R$ 60.000 - R$ 120.000+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-mono">Primeira Mensagem / Demanda</label>
                  <textarea
                    required
                    rows={3}
                    value={newLeadForm.lastMessage}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, lastMessage: e.target.value })}
                    placeholder="Descreva o que o cliente solicitou..."
                    className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs transition-colors"
                >
                  Salvar Lead no Pipeline
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Lead Detail Drawer Modal */}
        {selectedLead && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md flex justify-end z-20">
            <div className="w-full max-w-lg bg-[#0b0e16] border-l border-white/10 h-full p-6 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    {getChannelIcon(selectedLead.channel)}
                    <span className="text-xs font-mono text-cyan-400 uppercase">
                      FICHA COMPLETA DO LEAD
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedLead(null)}
                    className="p-1 rounded-lg text-neutral-400 hover:text-white bg-neutral-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white font-display">
                    {selectedLead.name}
                  </h3>
                  <div className="text-xs text-neutral-400">
                    {selectedLead.company} · {selectedLead.channelHandle}
                  </div>
                </div>

                {/* Score & Stage Action */}
                <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-neutral-900 border border-white/5">
                    <span className="text-[10px] text-neutral-500 block">SCORE DE IA</span>
                    <span className="text-lg font-bold text-emerald-400">{selectedLead.leadScore}/100</span>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-900 border border-white/5">
                    <span className="text-[10px] text-neutral-500 block">ORÇAMENTO</span>
                    <span className="text-xs text-white">{selectedLead.budgetTier}</span>
                  </div>
                </div>

                {/* Contact Data */}
                <div className="space-y-2 text-xs font-mono bg-neutral-950 p-4 rounded-xl border border-white/5">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">E-mail:</span>
                    <span className="text-white">{selectedLead.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Telefone:</span>
                    <span className="text-white">{selectedLead.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Criado em:</span>
                    <span className="text-neutral-400">
                      {new Date(selectedLead.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>

                {/* Conversation History */}
                <div className="space-y-3">
                  <div className="text-xs font-mono text-neutral-400">HISTÓRICO SOCIAL:</div>
                  <div className="p-3 rounded-xl bg-neutral-900 border border-white/5 text-xs text-neutral-200">
                    <div className="text-[10px] text-neutral-500 mb-1">MENSAGEM DO CLIENTE:</div>
                    "{selectedLead.lastMessage}"
                  </div>

                  {selectedLead.aiAgentResponse && (
                    <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-200">
                      <div className="text-[10px] text-cyan-400 mb-1 font-mono">
                        RESPOSTA ENVIADA PELO AGENTE DE IA:
                      </div>
                      "{selectedLead.aiAgentResponse}"
                    </div>
                  )}
                </div>

                {/* Change Stage Controls */}
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-mono text-neutral-400">ALTERAR ESTÁGIO:</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {columns.map((col) => (
                      <button
                        key={col.id}
                        onClick={() => handleUpdateLeadStatus(selectedLead.id, col.id)}
                        className={`p-2 rounded-lg text-left transition-colors font-medium ${
                          selectedLead.status === col.id
                            ? 'bg-cyan-500 text-black font-bold'
                            : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
                        }`}
                      >
                        {col.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={() => alert(`Acessando integração Google Calendar para ${selectedLead.name}...`)}
                  className="w-full py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-black" />
                  <span>Agendar Diagnóstico Técnico</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
