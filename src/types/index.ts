export interface TechNewsItem {
  id: string;
  title: string;
  category: string;
  source: string;
  timestamp: string;
  summary: string;
  url: string;
  impact: string;
  metrics: string;
}

export interface CrmLead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  channel: 'instagram' | 'whatsapp' | 'linkedin' | 'x';
  channelHandle: string;
  status: 'novo' | 'qualificado' | 'negociacao' | 'proposta' | 'fechado';
  leadScore: number;
  budgetTier: string;
  intent: string;
  lastMessage: string;
  aiAgentResponse?: string;
  createdAt: string;
  tags: string[];
}

export interface SocialChannelConnection {
  id: 'instagram' | 'whatsapp' | 'linkedin' | 'x';
  name: string;
  icon: string;
  connected: boolean;
  webhookStatus: 'active' | 'syncing' | 'offline';
  messagesProcessed24h: number;
  aiResponseRate: string;
}

export interface ClientTestimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatarText: string;
  revenueIncrease: string;
  timeframe: string;
  leadsGrowth: string;
  quote: string;
  category: 'Tráfego & IA' | 'CRM Omnichannel' | 'Engenharia de Software' | 'Agentes de IA';
}

export interface ProjectCaseStudy {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  image: string;
  metrics: { label: string; value: string }[];
  description: string;
  technologies: string[];
  highlightTag?: string;
}
