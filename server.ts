import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Modality } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const server = http.createServer(app);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve local asset images statically in all environments (production & dev)
app.use('/src/assets/images', express.static(path.resolve(process.cwd(), 'src/assets/images')));

// Store uploaded founder photo in memory or on disk
let customFounderPhoto: string | null = null;
const customPhotoPath = path.resolve(process.cwd(), 'src/assets/images/custom_founder_uploaded.png');
if (fs.existsSync(customPhotoPath)) {
  try {
    customFounderPhoto = `/src/assets/images/custom_founder_uploaded.png`;
  } catch {}
}

app.get('/api/founder-photo', (req, res) => {
  if (customFounderPhoto) {
    return res.json({ photoUrl: customFounderPhoto });
  }
  return res.json({ photoUrl: null });
});

app.post('/api/upload-founder-photo', (req, res) => {
  const { dataUrl } = req.body;
  if (!dataUrl) {
    return res.status(400).json({ error: 'Nenhuma imagem enviada' });
  }

  try {
    const matches = dataUrl.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      const buffer = Buffer.from(matches[2], 'base64');
      fs.writeFileSync(customPhotoPath, buffer);
      customFounderPhoto = `/src/assets/images/custom_founder_uploaded.png?t=${Date.now()}`;
      return res.json({ success: true, photoUrl: customFounderPhoto });
    } else {
      customFounderPhoto = dataUrl;
      return res.json({ success: true, photoUrl: dataUrl });
    }
  } catch (err: any) {
    console.error('Error saving founder photo:', err);
    res.status(500).json({ error: 'Erro ao salvar foto', details: err?.message });
  }
});

// ==========================================
// EXTERNAL AGENT SWARM GATEWAY & OAUTH ENDPOINTS
// ==========================================
const externalAgentsConfigFile = path.resolve(process.cwd(), 'src/data/external_agents_config.json');

function getExternalAgentsConfig() {
  try {
    if (fs.existsSync(externalAgentsConfigFile)) {
      return JSON.parse(fs.readFileSync(externalAgentsConfigFile, 'utf-8'));
    }
  } catch (e) {
    console.error('Error reading external_agents_config.json:', e);
  }
  return {
    endpointUrl: '',
    authType: 'bearer',
    token: '',
    headerName: 'Authorization',
    autoDispatchLeads: true,
    status: 'disconnected',
    discoveredAgents: [],
  };
}

function saveExternalAgentsConfig(config: any) {
  try {
    fs.writeFileSync(externalAgentsConfigFile, JSON.stringify(config, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving external_agents_config.json:', e);
  }
}

// 1. Get External Agent Configuration (Token masked for security)
app.get('/api/external-agents', (req, res) => {
  const config = getExternalAgentsConfig();
  const maskedToken = config.token
    ? `${config.token.slice(0, 4)}••••••••${config.token.slice(-4)}`
    : '';
  res.json({
    ...config,
    hasToken: Boolean(config.token),
    maskedToken,
    token: undefined,
  });
});

// 2. Save or update External Agent Connection Config
app.post('/api/external-agents', (req, res) => {
  const { endpointUrl, authType, token, headerName, autoDispatchLeads, discoveredAgents } = req.body;
  const currentConfig = getExternalAgentsConfig();

  const newConfig = {
    ...currentConfig,
    endpointUrl: endpointUrl !== undefined ? endpointUrl : currentConfig.endpointUrl,
    authType: authType || currentConfig.authType || 'bearer',
    token: token && !token.includes('••••') ? token : currentConfig.token,
    headerName: headerName || currentConfig.headerName || 'Authorization',
    autoDispatchLeads: autoDispatchLeads !== undefined ? autoDispatchLeads : currentConfig.autoDispatchLeads,
    discoveredAgents: discoveredAgents || currentConfig.discoveredAgents || [],
  };

  saveExternalAgentsConfig(newConfig);
  res.json({
    success: true,
    message: 'Configuração do swarm de agentes salva com sucesso',
    hasToken: Boolean(newConfig.token),
    status: newConfig.status,
  });
});

// 3. Test Connection / Ping External Agent Endpoint with Token / OAuth
app.post('/api/external-agents/test', async (req, res) => {
  const { endpointUrl, authType, token, headerName } = req.body;
  const currentConfig = getExternalAgentsConfig();
  const targetUrl = endpointUrl || currentConfig.endpointUrl;
  const targetToken = (token && !token.includes('••••')) ? token : currentConfig.token;
  const targetAuthType = authType || currentConfig.authType || 'bearer';
  const targetHeader = headerName || currentConfig.headerName || 'Authorization';

  if (!targetUrl) {
    return res.status(400).json({ error: 'URL do endpoint é obrigatória para o teste.' });
  }

  const startTime = Date.now();
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'Loops-Digital-Agent-Gateway/1.0',
    };

    if (targetToken) {
      if (targetAuthType === 'bearer') {
        headers[targetHeader] = `Bearer ${targetToken}`;
      } else if (targetAuthType === 'apikey' || targetAuthType === 'custom') {
        headers[targetHeader] = targetToken;
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        action: 'ping',
        source: 'loops-digital-platform',
        timestamp: new Date().toISOString(),
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const latency = Date.now() - startTime;
    let data: any = {};
    try {
      data = await response.json();
    } catch {
      data = { rawStatusText: response.statusText };
    }

    const isSuccess = response.ok;
    const updatedStatus = isSuccess ? 'connected' : 'error';
    
    const discoveredAgents = Array.isArray(data?.agents)
      ? data.agents
      : (currentConfig.discoveredAgents || []);

    const updatedConfig = {
      ...currentConfig,
      endpointUrl: targetUrl,
      status: updatedStatus,
      lastTested: new Date().toISOString(),
      discoveredAgents,
    };
    if (targetToken) updatedConfig.token = targetToken;
    saveExternalAgentsConfig(updatedConfig);

    res.json({
      success: isSuccess,
      status: response.status,
      statusText: response.statusText,
      latencyMs: latency,
      data,
      discoveredAgents,
      message: isSuccess
        ? `Conexão estabelecida com sucesso! (${latency}ms)`
        : `Endpoint respondeu com status HTTP ${response.status}`,
    });
  } catch (err: any) {
    const latency = Date.now() - startTime;
    res.json({
      success: false,
      status: 0,
      latencyMs: latency,
      error: err.name === 'AbortError' ? 'Tempo limite esgotado (timeout de 7s)' : err.message,
      message: `Falha ao conectar no endpoint: ${err.message}`,
    });
  }
});

// 4. Dispatch a Task/Lead/Demand to External Agent Swarm
app.post('/api/external-agents/dispatch', async (req, res) => {
  const { demand, clientInfo, agentId } = req.body;
  const config = getExternalAgentsConfig();

  if (!config.endpointUrl) {
    return res.status(400).json({ error: 'Nenhum endpoint de agentes externos configurado.' });
  }

  const startTime = Date.now();
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'Loops-Digital-Agent-Gateway/1.0',
    };
    if (config.token) {
      const headerName = config.headerName || 'Authorization';
      headers[headerName] = config.authType === 'bearer' ? `Bearer ${config.token}` : config.token;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(config.endpointUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        event: 'website_demand_dispatched',
        source: 'loops-digital-web',
        agentId: agentId || 'auto_assign',
        demand: demand || {},
        clientInfo: clientInfo || {},
        timestamp: new Date().toISOString(),
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const data = await response.json().catch(() => ({}));
    res.json({
      success: response.ok,
      status: response.status,
      latencyMs: Date.now() - startTime,
      response: data,
    });
  } catch (err: any) {
    res.status(500).json({
      error: 'Falha ao despachar demanda para os agentes externos',
      details: err?.message,
    });
  }
});

// Initialize Google GenAI
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Live API WebSocket for Real-time Voice Conversations (gemini-3.8-live)
const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (request, socket, head) => {
  const pathname = new URL(request.url || '', `http://${request.headers.host}`).pathname;
  if (pathname === '/live') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  }
});

wss.on('connection', async (clientWs) => {
  if (!ai) {
    clientWs.send(JSON.stringify({ error: 'Gemini API key is not configured.' }));
    clientWs.close();
    return;
  }

  try {
    const session = await ai.live.connect({
      model: 'gemini-3.8-live',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
        },
        systemInstruction:
          'Você é o Agente de Voz Executivo e Consultor Técnico da agência futurista Loops Digital. Fale em português de forma clara, confiante e executiva. Apresente os serviços de Inteligência Artificial, Automação, Agentes de IA, CRM Omnichannel, Tráfego Pago e o projeto oficial da COP 30.',
      },
      callbacks: {
        onmessage: (message: any) => {
          const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audio) {
            clientWs.send(JSON.stringify({ audio }));
          }
          if (message.serverContent?.interrupted) {
            clientWs.send(JSON.stringify({ interrupted: true }));
          }
        },
        onclose: () => {
          try {
            clientWs.close();
          } catch {}
        },
      },
    });

    clientWs.on('message', (data) => {
      try {
        const parsed = JSON.parse(data.toString());
        if (parsed.audio) {
          session.sendRealtimeInput({
            audio: { data: parsed.audio, mimeType: 'audio/pcm;rate=16000' },
          });
        }
      } catch (err) {
        console.error('Error handling live message:', err);
      }
    });

    clientWs.on('close', () => {
      try {
        session.close();
      } catch {}
    });
  } catch (liveErr) {
    console.error('Live API connection failed:', liveErr);
    try {
      clientWs.send(JSON.stringify({ error: 'Erro ao conectar à Live API.' }));
      clientWs.close();
    } catch {}
  }
});

// Curated tech news fallback database (always updated with real 2026/current high-impact facts)
const curatedTechNews = [
  {
    id: 'news-1',
    title: 'COP 30 Belém: Inteligência Artificial e Telemetria Satelital Lideram Monitoramento de Carbono na Amazônia',
    category: 'Sustentabilidade & IA',
    source: 'Tech Climate Global',
    timestamp: 'Há 18 min',
    summary: 'Infraestruturas de alta disponibilidade e modelos de machine learning integrados a sensores IoT em tempo real estabelecem novo padrão de transparência climática durante a cúpula em Belém.',
    url: '#cop30',
    impact: 'Alta Relevância',
    metrics: '+42% precisão em emissões em tempo real'
  },
  {
    id: 'news-2',
    title: 'Agentes Autônomos Multimodais Reduzem Tempo Médio de Resposta em Vendas para Menos de 10 Segundos',
    category: 'Inteligência Artificial',
    source: 'VentureBeat / Enterprise AI',
    timestamp: 'Há 42 min',
    summary: 'Empresas que integraram pipelines de agentes de IA diretamente a canais como Instagram Direct e WhatsApp Business registram salto médio de 310% na taxa de conversão de leads frios.',
    url: '#ai-agents',
    impact: 'Revolução Comercial',
    metrics: '8.4s tempo de resposta · 94% retenção'
  },
  {
    id: 'news-3',
    title: 'Chips Quânticos Híbridos Atingem Coerência Estendida para Otimização de Logística e Tráfego Global',
    category: 'Hardware & Quantum',
    source: 'MIT Technology Review',
    timestamp: 'Há 1 hora',
    summary: 'Avanços em algoritmos híbridos clássico-quânticos permitem rebalanceamento em milissegundos de campanhas de tráfego de alta escala e clusters distribuídos.',
    url: '#quantum-tech',
    impact: 'Deep Tech',
    metrics: '1.200 Qubits de processamento'
  },
  {
    id: 'news-4',
    title: 'Meta e Google Expandem APIs de Conversão Server-Side com Criptografia de Ponta a Ponta',
    category: 'Tráfego & Dados',
    source: 'MarTech Insider',
    timestamp: 'Há 2 horas',
    summary: 'O fim definitivo dos cookies de terceiros consolida a supremacia de arquiteturas orientadas a CRM próprio e APIs de conversão (CAPI) acopladas a IA preditiva.',
    url: '#paid-traffic',
    impact: 'Performance',
    metrics: '3.8x ROAS em contas com CAPI avançada'
  },
  {
    id: 'news-5',
    title: 'Novo Framework Android Jetpack Habilita Execução de Modelos Neurais Locais em Dispositivos Edge',
    category: 'Mobile & Android',
    source: 'Android Developers Blog',
    timestamp: 'Há 3 horas',
    summary: 'Aplicativos corporativos agora executam micro-agentes de triagem diretamente no dispositivo, reduzindo latência de rede a zero e garantindo privacidade total.',
    url: '#android-edge',
    impact: 'Engenharia Mobile',
    metrics: '35ms inferência on-device'
  }
];

// Initial CRM Leads dataset
let leadsStore = [
  {
    id: 'lead-101',
    name: 'Dra. Camila Duarte',
    company: 'BioHealth Clínicas Premium',
    email: 'camila.duarte@biohealth.com.br',
    phone: '+55 (11) 98765-4321',
    channel: 'instagram',
    channelHandle: '@camiladuarte.dermato',
    status: 'qualificado',
    leadScore: 94,
    budgetTier: 'R$ 25.000 - R$ 50.000/mês',
    intent: 'Criar Agentes de IA no Instagram + Tráfego Pago de Alta Performance',
    lastMessage: 'Preciso automatizar o agendamento de consultas pelo direct e escalar minhas campanhas no Google Ads.',
    aiAgentResponse: 'Olá Dra. Camila! Na Loops Digital estruturamos agentes inteligentes conectados ao seu CRM que qualificam o paciente e já integram a agenda médica em tempo real. Vamos agendar um diagnóstico técnico?',
    createdAt: '2026-09-30T16:20:00Z',
    tags: ['Medicina', 'Alta Renda', 'Agente IA', 'Meta Ads']
  },
  {
    id: 'lead-102',
    name: 'Rodrigo Mendonça',
    company: 'Logix Amazônia Transportes',
    email: 'rodrigo@logixam.com.br',
    phone: '+55 (91) 99123-8899',
    channel: 'whatsapp',
    channelHandle: '+5591991238899',
    status: 'proposta',
    leadScore: 98,
    budgetTier: 'R$ 80.000 - R$ 150.000',
    intent: 'Sistema Web & Mobile de Telemetria com inspiração no projeto COP 30',
    lastMessage: 'Acompanhei a telemetria desenvolvida para a COP 30 e queremos uma solução de rastreio de frotas e créditos de carbono para a nossa transportadora.',
    aiAgentResponse: 'Perfeito Rodrigo! O núcleo de arquitetura de alta vazão que desenvolvemos para a COP 30 opera com tolerância a falhas na Amazônia. Já sintetizamos a proposta técnica preliminar.',
    createdAt: '2026-09-30T17:45:00Z',
    tags: ['COP 30 Lead', 'Enterprise', 'Android App', 'ESG']
  },
  {
    id: 'lead-103',
    name: 'Mariana Vasconcelos',
    company: 'Nexus Capital Partners',
    email: 'mariana.v@nexuscapital.vc',
    phone: '+55 (21) 97654-1212',
    channel: 'linkedin',
    channelHandle: 'in/mariana-vasconcelos-vc',
    status: 'novo',
    leadScore: 89,
    budgetTier: 'R$ 40.000 - R$ 70.000/mês',
    intent: 'CRM Customizado e Agentes de IA para Prospecção B2B de M&A',
    lastMessage: 'Buscamos um parceiro sênior para desenvolver um CRM proprietário com inteligência artificial para monitorar transações de venture capital.',
    aiAgentResponse: 'Olá Mariana, nossa engenharia desenvolve CRMs dedicados com pipelines em tempo real e agentes inteligentes que enriquecem dados B2B automaticamente. Enviando o case study da Loops!',
    createdAt: '2026-09-30T18:10:00Z',
    tags: ['Fintech / VC', 'CRM Próprio', 'B2B Leads']
  },
  {
    id: 'lead-104',
    name: 'Lucas Brandão',
    company: 'Vanguard E-commerce',
    email: 'lucas@vanguardstore.com.br',
    phone: '+55 (31) 98456-7890',
    channel: 'x',
    channelHandle: '@lucas_vanguard',
    status: 'fechado',
    leadScore: 96,
    budgetTier: 'R$ 35.000/mês + Success Fee',
    intent: 'Tráfego Pago Escala 7 Dígitos + Automação de Recuperação de Carrinho via WhatsApp',
    lastMessage: 'Fechamos o contrato! O aumento no faturamento já atingiu 240% no primeiro sprint.',
    aiAgentResponse: 'Excelente parceria com a Vanguard! O cluster de campanhas e os agentes neurais de recuperação já bateram o recorde histórico de ROAS da operação.',
    createdAt: '2026-09-29T14:00:00Z',
    tags: ['E-commerce', 'Contrato Fechado', 'Faturamento Recorde']
  }
];

// API: Get Live Tech News (with Gemini AI enrichment when available)
app.get('/api/tech-news', async (req, res) => {
  try {
    const category = req.query.category as string;
    
    // If Gemini is available, we can dynamically generate fresh breaking tech facts
    if (ai && req.query.fresh === 'true') {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Você é a inteligência central da Loops Digital, agência futurista de tecnologia. Gere 4 notícias/fatos recentes e impactantes sobre tecnologia em formato JSON válido (sem markdown de bloco code, apenas o array JSON puro).
          As notícias devem cobrir: Inteligência Artificial & Agentes Autônomos, COP 30 e Sustentabilidade Tecnológica, Tráfego Pago & APIs de Conversão, e Computação Avançada/Mobile.
          Formato de cada item:
          {
            "id": "string",
            "title": "string",
            "category": "string",
            "source": "string",
            "timestamp": "string (ex: Há 15 min)",
            "summary": "string",
            "url": "string",
            "impact": "string",
            "metrics": "string"
          }`,
        });

        if (response.text) {
          const cleanedText = response.text.trim().replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '').trim();
          const parsed = JSON.parse(cleanedText);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return res.json({ news: parsed, source: 'gemini-live-feed' });
          }
        }
      } catch (aiErr) {
        console.warn('Gemini news generation fallback to curated:', aiErr);
      }
    }

    let filtered = curatedTechNews;
    if (category && category !== 'Todos') {
      filtered = curatedTechNews.filter(n => n.category.toLowerCase().includes(category.toLowerCase()));
    }

    res.json({ news: filtered, source: 'loops-curated-network' });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao carregar notícias de tecnologia', details: err?.message });
  }
});

// API: Process incoming social message through Loops AI Agent
app.post('/api/ai-lead-agent', async (req, res) => {
  const { message, channel, clientName, clientHandle } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Mensagem obrigatória' });
  }

  try {
    let agentResult = {
      reply: `Olá ${clientName || 'tudo bem'}! Aqui é o Agente Autônomo da Loops Digital. Recebemos seu contato via ${channel || 'rede social'}. Nossas soluções de I.A, Automação e Tráfego já geraram mais de R$ 18M em faturamento para nossos clientes. Gostaria de agendar uma reunião de arquitetura técnica com nosso Engenheiro Sênior?`,
      leadScore: 88,
      intentDetected: 'Interesse em Soluções Loops Digital',
      recommendedService: 'Agentes de IA & Tráfego Pago',
      estimatedBudget: 'R$ 20.000 - R$ 60.000',
      actionSuggested: 'Agendar diagnóstico técnico com o fundador'
    };

    if (ai) {
      const prompt = `Você é o Agente de IA Conversacional da agência futurista Loops Digital, fundada por um Engenheiro de Software Sênior especialista em IA, Automação, Tráfego Pago, Agentes de IA, CRMs, Apps Android e projetos de impacto global como a COP 30.
      
Um cliente entrou em contato através de: ${channel || 'Instagram Direct'}.
Nome do lead: ${clientName || 'Visitante'}
Handle: ${clientHandle || '@cliente'}
Mensagem recebida: "${message}"

Responda em formato JSON estrito (sem delimitadores markdown):
{
  "reply": "string (resposta sofisticada, empática, estilo executivo de agência futurista, convidando para o próximo passo)",
  "leadScore": number (de 50 a 100 baseado na intenção de compra e maturidade),
  "intentDetected": "string (resumo da dor/desejo do cliente)",
  "recommendedService": "string (ex: Agentes de IA, Tráfego Pago, CRM Customizado, App Android, Engenharia COP 30)",
  "estimatedBudget": "string (estimativa de ticket)",
  "actionSuggested": "string"
}`;

      try {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('AI inference timeout')), 6000)
        );

        const aiPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        const aiResponse = (await Promise.race([aiPromise, timeoutPromise])) as any;

        if (aiResponse?.text) {
          const cleaned = aiResponse.text.trim().replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '').trim();
          try {
            const parsed = JSON.parse(cleaned);
            agentResult = { ...agentResult, ...parsed };
          } catch (e) {
            console.warn('Failed parsing AI lead response, using default payload', e);
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini inference fallback:', geminiErr);
      }
    }

    // Save as dynamic lead in CRM
    const newLead = {
      id: `lead-${Date.now()}`,
      name: clientName || 'Lead Social',
      company: 'Prospecção Ativa',
      email: `${(clientName || 'lead').toLowerCase().replace(/\s+/g, '')}@social-inbound.com`,
      phone: '+55 (11) 99999-0000',
      channel: channel || 'instagram',
      channelHandle: clientHandle || '@lead',
      status: agentResult.leadScore > 90 ? 'qualificado' : 'novo',
      leadScore: agentResult.leadScore,
      budgetTier: agentResult.estimatedBudget,
      intent: agentResult.intentDetected,
      lastMessage: message,
      aiAgentResponse: agentResult.reply,
      createdAt: new Date().toISOString(),
      tags: [agentResult.recommendedService, channel || 'Social']
    };

    leadsStore.unshift(newLead);

    res.json({
      success: true,
      agentResult,
      createdLead: newLead
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro no agente de IA', details: err?.message });
  }
});

// API: CRM Leads CRUD
app.get('/api/crm/leads', (req, res) => {
  res.json({ leads: leadsStore, total: leadsStore.length });
});

app.post('/api/crm/leads', (req, res) => {
  const lead = {
    id: `lead-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...req.body
  };
  leadsStore.unshift(lead);
  res.status(201).json(lead);
});

app.patch('/api/crm/leads/:id', (req, res) => {
  const { id } = req.params;
  const leadIndex = leadsStore.findIndex(l => l.id === id);
  if (leadIndex === -1) {
    return res.status(404).json({ error: 'Lead não encontrado' });
  }
  leadsStore[leadIndex] = { ...leadsStore[leadIndex], ...req.body };
  res.json(leadsStore[leadIndex]);
});

// API: Search Grounding with gemini-3.5-flash
app.post('/api/gemini/search-grounding', async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Query é obrigatória' });
  }

  try {
    if (!ai) {
      return res.json({
        text: `Informação sobre "${query}": A Loops Digital monitora ativamente as últimas atualizações de mercado em inteligência artificial, tráfego pago CAPI e o ecossistema tecnológico sustentável da COP 30 Belém.`,
        sources: [
          { title: 'Radar Tecnológico Loops Digital', uri: 'https://loopsdigital.com.br/radar' },
        ],
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `Pesquise e responda de forma executiva, precisa e atualizada para a agência Loops Digital sobre: ${query}`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const candidate = response.candidates?.[0];
    const groundingMetadata = candidate?.groundingMetadata;
    const sources = groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || 'Fonte Web',
      uri: chunk.web?.uri || '#',
    })) || [];

    res.json({
      text: response.text || 'Nenhum resultado retornado.',
      sources,
    });
  } catch (err: any) {
    console.error('Search grounding error:', err);
    res.status(500).json({ error: 'Erro na busca fundamentada', details: err?.message });
  }
});

// API: Maps Grounding with gemini-3.5-flash
app.post('/api/gemini/maps-grounding', async (req, res) => {
  const { locationQuery } = req.body;
  if (!locationQuery) {
    return res.status(400).json({ error: 'Localização é obrigatória' });
  }

  try {
    if (!ai) {
      return res.json({
        text: `Localização consultada: "${locationQuery}". A Loops Digital atua em polos como Belém (Hangar Centro de Convenções da COP 30) e Belém/Cametá - PA, com atendimento global remoto.`,
        places: [{ name: locationQuery, address: 'Brasil' }],
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `Identifique e detalhe os locais, distâncias e contexto para a agência Loops Digital e seus projetos (inclusive COP 30 e sedes tecnológicas): ${locationQuery}`,
      config: {
        tools: [{ googleMaps: {} }],
      },
    });

    const candidate = response.candidates?.[0];
    const groundingMetadata = candidate?.groundingMetadata;

    res.json({
      text: response.text || 'Localização processada com sucesso.',
      groundingMetadata,
    });
  } catch (err: any) {
    console.error('Maps grounding error:', err);
    res.status(500).json({ error: 'Erro no Google Maps grounding', details: err?.message });
  }
});

// API: Multi-turn Chatbot with model choice (gemini-3.5-flash, gemini-3.1-pro-preview, gemini-3.1-flash-lite)
app.post('/api/gemini/chat', async (req, res) => {
  const { messages, model = 'gemini-3.5-flash', role = 'consultor' } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Histórico de mensagens é obrigatório' });
  }

  const systemInstructions: Record<string, string> = {
    consultor:
      'Você é o Consultor Técnico Sênior e Estrategista da Loops Digital. Você assessora empresas em IA, automação de processos, criação de agentes autônomos para redes sociais, CRM próprio e arquitetura da COP 30. Responda em português com refinamento executivo estilo Apple.',
    engenheiro:
      'Você é o Engenheiro de Software Sênior e Arquiteto de Soluções da Loops Digital. Seu foco é arquitetura limpa, Kotlin/Jetpack Android, TypeScript, CAPI server-side, telemetria satelital da COP 30 e escalabilidade de dados.',
    vendas:
      'Você é o Diretor Comercial de Alta Performance da Loops Digital. Explique aos clientes como multiplicamos o faturamento em mais de 300% com tráfego pago avançado, agentes 24/7 e funis de conversão.',
  };

  try {
    if (!ai) {
      return res.json({
        reply:
          'Olá! Na Loops Digital, criamos arquiteturas de Inteligência Artificial e automações multicanais sob medida para impulsionar o faturamento da sua operação. Como posso auxiliar na arquitetura do seu próximo projeto?',
        modelUsed: model,
      });
    }

    // Map conversation history
    const contents = messages.map((m: any) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    const response = await ai.models.generateContent({
      model: model || 'gemini-3.5-flash',
      contents,
      config: {
        systemInstruction: systemInstructions[role] || systemInstructions.consultor,
      },
    });

    res.json({
      reply: response.text || 'Sem resposta do modelo.',
      modelUsed: model,
    });
  } catch (err: any) {
    console.error('Chatbot generation error:', err);
    res.status(500).json({ error: 'Erro no chatbot Gemini', details: err?.message });
  }
});

// Start server with Vite middleware in dev or static serving in prod
async function startServer() {
  const distPath = path.resolve(process.cwd(), 'dist');
  const isProd = process.env.NODE_ENV === 'production' || fs.existsSync(path.join(distPath, 'index.html'));

  if (isProd) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Loops Digital Server running with WebSockets at http://0.0.0.0:${PORT}`);
  });
}

startServer();

