import { ClientTestimonial, ProjectCaseStudy, SocialChannelConnection } from '../types';
import founderOfficialPhoto from '../assets/images/founder_official.webp';
import heroLoopsDigital from '../assets/images/hero_loops_digital_1790821146829.jpg';
import cop30Telemetry from '../assets/images/cop30_telemetry_1790821156200.jpg';
import omnichannelAiAgents from '../assets/images/omnichannel_ai_agents_1790821165700.jpg';

export const FOUNDER_IMAGE = founderOfficialPhoto;
export const HERO_IMAGE = heroLoopsDigital;
export const COP30_IMAGE = cop30Telemetry;
export const OMNICHANNEL_IMAGE = omnichannelAiAgents;

export const INITIAL_CHANNELS: SocialChannelConnection[] = [
  {
    id: 'instagram',
    name: 'Instagram Direct',
    icon: 'Instagram',
    connected: true,
    webhookStatus: 'active',
    messagesProcessed24h: 342,
    aiResponseRate: '99.4%',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business API',
    icon: 'MessageSquare',
    connected: true,
    webhookStatus: 'active',
    messagesProcessed24h: 890,
    aiResponseRate: '99.8%',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn InMail B2B',
    icon: 'Linkedin',
    connected: true,
    webhookStatus: 'active',
    messagesProcessed24h: 124,
    aiResponseRate: '98.7%',
  },
  {
    id: 'x',
    name: 'X (Twitter) Messaging',
    icon: 'Twitter',
    connected: true,
    webhookStatus: 'active',
    messagesProcessed24h: 76,
    aiResponseRate: '97.9%',
  },
];

export const CLIENT_TESTIMONIALS: ClientTestimonial[] = [
  {
    id: 't-1',
    name: 'Dra. Camila Duarte',
    role: 'Diretora Médica & Fundadora',
    company: 'BioHealth Clínicas Premium',
    avatarText: 'CD',
    revenueIncrease: '+312% Faturamento',
    timeframe: '90 dias pós-lançamento',
    leadsGrowth: '+480% Pacientes Qualificados',
    quote: 'O agente autônomo da Loops Digital no Instagram Direct assumiu a triagem dos procedimentos de alto valor. Os pacientes recebem atendimento em 6 segundos e já chegam à clínica com agendamento concluído. Nosso faturamento triplicou sem precisarmos inchar a equipe de recepção.',
    category: 'Agentes de IA',
  },
  {
    id: 't-2',
    name: 'Rodrigo Mendonça',
    role: 'Chief Technology & Operations Officer',
    company: 'Logix Amazônia Transportes',
    avatarText: 'RM',
    revenueIncrease: '+185% Novos Contratos B2B',
    timeframe: '6 meses de operação',
    leadsGrowth: '+420% Leads Corporativos',
    quote: 'Conhecemos o trabalho do fundador na telemetria da COP 30 e contratamos a Loops para criar nosso ecossistema de CRM e aplicativo Android de logística. A estabilidade é de padrão militar e a prospecção de fretes agora roda 100% com IA preditiva.',
    category: 'Engenharia de Software',
  },
  {
    id: 't-3',
    name: 'Lucas Brandão',
    role: 'CEO & Head de Aquisição',
    company: 'Vanguard Luxury E-commerce',
    avatarText: 'LB',
    revenueIncrease: '+240% em Faturamento Bruto',
    timeframe: 'Sprint Q2/Q3',
    leadsGrowth: '4.6x Retorno Sobre Ad Spend (ROAS)',
    quote: 'A Loops reestruturou toda a nossa esteira de tráfego pago com APIs server-side e acoplou agentes de IA para recuperar carrinhos e dialogar com clientes VIP no WhatsApp. Reduzimos o custo por aquisição em mais de 50%.',
    category: 'Tráfego & IA',
  },
  {
    id: 't-4',
    name: 'Mariana Vasconcelos',
    role: 'Managing Partner',
    company: 'Nexus Capital Partners',
    avatarText: 'MV',
    revenueIncrease: 'R$ 14.8M em Pipeline B2B',
    timeframe: '120 dias de implantação',
    leadsGrowth: '35 horas/semana economizadas',
    quote: 'O CRM proprietário construído pela Loops para nosso fundo de venture capital opera com inteligência artificial para monitorar alvos de fusões e aquisições. Um nível de acabamento técnico e velocidade que só vimos nos melhores produtos do Vale do Silício.',
    category: 'CRM Omnichannel',
  },
];

export const PROJECT_CASES: ProjectCaseStudy[] = [
  {
    id: 'cop30-project',
    title: 'COP 30 Belém — Plataforma de Telemetria Climática & IA',
    subtitle: 'Infraestrutura Crítica em Nuvem, Edge AI e Monitoramento Ambiental',
    category: 'Engenharia de Alta Escala & ESG',
    image: COP30_IMAGE,
    highlightTag: 'Destaque Oficial COP 30',
    description: 'Arquitetura e desenvolvimento da esteira de dados de alta disponibilidade para a Cúpula do Clima da ONU (COP 30 em Belém/Amazônia). O sistema ingere telemetria de sensores de campo, satélites de observação da Terra e modelos preditivos em tempo real, fornecendo aos delegados e órgãos internacionais painéis de dados imutáveis com tolerância a falhas na Amazônia.',
    technologies: ['Distributed Edge AI', 'Go / TypeScript', 'IoT Telemetry Pipeline', 'GeoSpatial Satellite Ingestion', 'Zero-Downtime Multi-Region'],
    metrics: [
      { label: 'Disponibilidade Registrada', value: '99.998%' },
      { label: 'Pontos de Dados / Segundo', value: '45.000+' },
      { label: 'Latência Global P99', value: '42ms' },
    ],
  },
  {
    id: 'omnichannel-agents',
    title: 'Ecosistema de Agentes de IA Omnichannel & CRM Neural',
    subtitle: 'Automação Comercial Multicanal para Grandes Operações',
    category: 'Inteligência Artificial & CRM',
    image: OMNICHANNEL_IMAGE,
    highlightTag: 'Stack Proprietária Loops',
    description: 'Pipeline integrado com os Webhooks oficiais da Meta (Instagram & WhatsApp), LinkedIn e X. Os agentes analisam linguagem natural, qualificam a capacidade financeira do lead, recomendam o plano ideal e inserem a negociação diretamente no CRM com agendamento automático via Google Calendar.',
    technologies: ['Gemini Multimodal Models', 'Meta Graph API', 'WhatsApp Cloud API', 'Webhooks Real-time', 'OAuth 2.0 Security'],
    metrics: [
      { label: 'Tempo Médio de Resposta', value: '< 8 segundos' },
      { label: 'Taxa de Qualificação Automática', value: '94.2%' },
      { label: 'Aumento Médio de Fechamento', value: '+310%' },
    ],
  },
  {
    id: 'traffic-growth-engine',
    title: 'Motor Preditivo de Tráfego Pago & CAPI Server-Side',
    subtitle: 'Escala de Performance com Otimização Algorítmica',
    category: 'Tráfego Pago & Data Engineering',
    image: HERO_IMAGE,
    highlightTag: 'Performance High Ticket',
    description: 'Arquitetura de dados para campanhas de mídia paga de alto orçamento com integração direta server-side (Meta CAPI + Google Enhanced Conversions). Utiliza algoritmos proprietários de Machine Learning para prever Lifetime Value (LTV) e reorientar lances de leilão em tempo real.',
    technologies: ['Server-Side CAPI', 'Predictive LTV Modeling', 'Google Ads Smart Bidding', 'Lookalike Clustering', 'Real-time Attribution'],
    metrics: [
      { label: 'Faturamento Auditado de Clientes', value: '+R$ 18M' },
      { label: 'ROAS Médio Consolidado', value: '4.8x' },
      { label: 'Leads de Alta Renda Entregues', value: '450.000+' },
    ],
  },
];
