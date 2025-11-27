import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Linking,
} from 'react-native';

/* ----------------------------------------------
   TEMA / CORES
------------------------------------------------*/
const colors = {
  bg: '#0D0D0D',
  text: '#FFFFFF',
  textMuted: '#9A9A9A',
  primary: '#6A5AE0',
  primarySoft: '#8A7CFF',
  border: '#222222',
};

const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
};

/* ----------------------------------------------
   OPÇÕES DE PERFIL (ONBOARDING)
------------------------------------------------*/
const AREA_OPTIONS = [
  { id: 'logistica', label: 'Logística / Operacional' },
  { id: 'atendimento', label: 'Atendimento / Suporte' },
  { id: 'cozinha', label: 'Cozinha / Restaurante' },
  { id: 'limpeza', label: 'Limpeza / Housekeeping' },

  { id: 'engenharia', label: 'Engenharia' },
  { id: 'vendas', label: 'Vendas / Comercial' },
  { id: 'administrativo', label: 'Administração / Escritório' },
  { id: 'financeiro', label: 'Financeiro / Contabilidade' },
  { id: 'marketing', label: 'Marketing / Mídia' },
  { id: 'ti', label: 'TI / Programação' },
  { id: 'saude', label: 'Saúde / Enfermagem' },
  { id: 'construcao', label: 'Construção Civil' },
  { id: 'motorista', label: 'Motorista / Entregas' },
  { id: 'educacao', label: 'Educação / Professor' },
  { id: 'hotelaria', label: 'Hotelaria / Recepção' },
  { id: 'producao', label: 'Produção / Fábrica' },
  { id: 'seguranca', label: 'Segurança / Vigilância' },
  { id: 'cuidador', label: 'Babá / Cuidador' },
  { id: 'limpeza_pesada', label: 'Limpeza pesada / Industrial' },
  { id: 'outra', label: 'Outra área' },
];

const ENGLISH_OPTIONS = [
  { id: 'nenhum', label: 'Nenhum' },
  { id: 'basico', label: 'Básico' },
  { id: 'intermediario', label: 'Intermediário' },
  { id: 'avancado', label: 'Avançado' },
];

const AREA_LABEL_BY_ID = {
  logistica: 'Logística',
  atendimento: 'Atendimento',
  cozinha: 'Cozinha',
  limpeza: 'Limpeza',
  engenharia: 'Engenharia',
  vendas: 'Vendas / Comercial',
  administrativo: 'Administração / Escritório',
  financeiro: 'Financeiro / Contabilidade',
  marketing: 'Marketing / Mídia',
  ti: 'TI / Programação',
  saude: 'Saúde / Enfermagem',
  construcao: 'Construção Civil',
  motorista: 'Motorista / Entregas',
  educacao: 'Educação / Professor',
  hotelaria: 'Hotelaria / Recepção',
  producao: 'Produção / Fábrica',
  seguranca: 'Segurança / Vigilância',
  cuidador: 'Babá / Cuidador',
  limpeza_pesada: 'Limpeza pesada / Industrial',
  outra: 'Outra área',
};

const ENGLISH_LABEL_BY_ID = {
  nenhum: 'nenhum',
  basico: 'básico',
  intermediario: 'intermediário',
  avancado: 'avançado',
};

/* Palavras-chave pra busca no Indeed por área / inglês */
const AREA_QUERY_TERMS = {
  logistica: 'warehouse associate picker packer',
  atendimento: 'customer support call center',
  cozinha: 'kitchen assistant dishwasher',
  limpeza: 'housekeeping cleaner hotel',

  engenharia: 'engineer engineering',
  vendas: 'sales representative account manager',
  administrativo: 'office assistant administrative assistant',
  financeiro: 'accountant finance analyst bookkeeper',
  marketing: 'marketing social media digital marketing',
  ti: 'software developer programmer it support',
  saude: 'nurse caregiver healthcare assistant',
  construcao: 'construction worker carpenter',
  motorista: 'delivery driver truck driver',
  educacao: 'teacher tutor education assistant',
  hotelaria: 'front desk receptionist hotel',
  producao: 'production worker factory operator',
  seguranca: 'security guard',
  cuidador: 'caregiver nanny',
  limpeza_pesada: 'industrial cleaner janitor',
  outra: '',
};

const ENGLISH_QUERY_TERMS = {
  nenhum: 'no english required',
  basico: 'basic english',
  intermediario: 'intermediate english',
  avancado: 'advanced english',
};

/* ----------------------------------------------
   FAKE JOBS PARA O RADAR (por enquanto)
------------------------------------------------*/
const MOCK_JOBS = [
  {
    id: 1,
    title: 'Warehouse Associate',
    company: 'Amazon',
    city: 'Dallas',
    region: 'TX',
    area: 'Logística',
    english: 'básico',
    hiresForeigners: true,
    url: 'https://www.amazon.jobs/',
    country: 'usa',
  },
  {
    id: 2,
    title: 'Customer Support',
    company: 'Teleperformance',
    city: 'Vancouver',
    region: 'BC',
    area: 'Atendimento',
    english: 'intermediário',
    hiresForeigners: true,
    url: 'https://www.linkedin.com/jobs/',
    country: 'canada',
  },
  {
    id: 3,
    title: 'Kitchen Assistant',
    company: 'Local Restaurant',
    city: 'Dublin',
    region: '',
    area: 'Cozinha',
    english: 'nenhum',
    hiresForeigners: true,
    url: 'https://ie.indeed.com',
    country: 'irlanda',
  },
];

/* ----------------------------------------------
   DOMÍNIOS / LOCALIZAÇÃO DO INDEED
------------------------------------------------*/
const INDEED_BASE = {
  usa: 'https://www.indeed.com/jobs',
  canada: 'https://ca.indeed.com/jobs',
  irlanda: 'https://ie.indeed.com/jobs',
};

const INDEED_LOCATION = {
  usa: 'United States',
  canada: 'Canada',
  irlanda: 'Ireland',
};

/* ----------------------------------------------
   LINKS MERCADO PAGO
------------------------------------------------*/
const MP_PREMIUM =
  'https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=88c9ae55c5634a2684cfe7e7691e99bb';

const MP_PRO =
  'https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=d34c4b5469a4410ea1805e6e327b688a';

/* ----------------------------------------------
   COMPONENTES REUTILIZÁVEIS
------------------------------------------------*/
const Btn = ({ label, onPress, type = 'primary' }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.btn,
      type === 'secondary' && styles.btnSecondary,
    ]}
  >
    <Text style={styles.btnLabel}>{label}</Text>
  </TouchableOpacity>
);

const BackButton = ({ onPress }) => (
  <View style={styles.backButtonWrapper}>
    <TouchableOpacity onPress={onPress} style={styles.backButton}>
      <Text style={styles.backButtonLabel}>← Voltar</Text>
    </TouchableOpacity>
  </View>
);

/* ----------------------------------------------
   APP PRINCIPAL
------------------------------------------------*/
export default function App() {
  const [screen, setScreen] = useState('onboarding'); // tela atual
  const [history, setHistory] = useState(['onboarding']); // pilha de telas

  const [plan, setPlan] = useState(null); // 'premium' | 'pro'
  const [profile, setProfile] = useState({
    country: undefined,
    area: 'logistica',
    englishLevel: 'basico',
  });

  const [activeDoc, setActiveDoc] = useState(null);
  const [activeOnlineForm, setActiveOnlineForm] = useState(null);
  const [activeGuide, setActiveGuide] = useState(null);
  const [agendaNotes, setAgendaNotes] = useState('');

  const countryNames = {
    usa: 'Estados Unidos',
    canada: 'Canadá',
    irlanda: 'Irlanda',
  };

  const countryLabel = countryNames[profile.country] || 'o país escolhido';

  /* ----------------------------------------------
     NAVEGAÇÃO
  ------------------------------------------------*/
  const goTo = (nextScreen) => {
    setHistory((prev) => [...prev, nextScreen]);
    setScreen(nextScreen);
  };

  const goBack = () => {
    setHistory((prev) => {
      if (prev.length <= 1) {
        setScreen(prev[0]);
        return prev;
      }
      const newHistory = prev.slice(0, -1);
      const previous = newHistory[newHistory.length - 1];
      setScreen(previous);
      return newHistory;
    });
  };

  /* ----------------------------------------------
     INDEED
  ------------------------------------------------*/
  const handleOpenIndeedForCountry = () => {
    const base = INDEED_BASE[profile.country] || 'https://www.indeed.com/jobs';

    const areaTerm = AREA_QUERY_TERMS[profile.area] || '';
    const englishTerm = ENGLISH_QUERY_TERMS[profile.englishLevel] || '';
    const qParts = [areaTerm, 'portuguese', 'brazilian'];

    if (englishTerm) qParts.push(englishTerm);

    const q = encodeURIComponent(qParts.join(' ').trim());
    const locationRaw = INDEED_LOCATION[profile.country] || '';
    const l = locationRaw ? `&l=${encodeURIComponent(locationRaw)}` : '';

    const url = `${base}?q=${q}${l}`;
    Linking.openURL(url);
  };

  /* ----------------------------------------------
     TELA 1 – ONBOARDING
  ------------------------------------------------*/
  if (screen === 'onboarding') {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.onboardingContent}
      >
        <View>
          <Text style={styles.title}>VaiMorarFora</Text>
          <Text style={styles.subtitle}>
            O único app que você precisa para organizar documentos, entender os vistos
            e aumentar suas chances de sair do Brasil do jeito certo.
          </Text>

          <Text style={styles.sectionTitle}>Para qual país você quer ir primeiro?</Text>

          <View style={styles.countryButtonsBlock}>
            <Btn
              label="🇺🇸 Estados Unidos"
              onPress={() => {
                setProfile(prev => ({ ...prev, country: 'usa' }));
                goTo('countryIntro');
              }}
            />
            <Btn
              label="🇨🇦 Canadá"
              onPress={() => {
                setProfile(prev => ({ ...prev, country: 'canada' }));
                goTo('countryIntro');
              }}
            />
            <Btn
              label="🇮🇪 Irlanda"
              onPress={() => {
                setProfile(prev => ({ ...prev, country: 'irlanda' }));
                goTo('countryIntro');
              }}
            />
          </View>

          {/* ÁREA PROFISSIONAL */}
          <Text style={styles.sectionTitle}>Em qual área você quer trabalhar primeiro?</Text>
          <Text style={styles.subtitle}>
            Isso ajuda o app a sugerir vagas e exemplos de empresas que já contrataram brasileiros.
          </Text>

          <View style={styles.optionsRow}>
            {AREA_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.id}
                style={[
                  styles.optionButton,
                  profile.area === opt.id && styles.optionButtonSelected,
                ]}
                onPress={() =>
                  setProfile(prev => ({ ...prev, area: opt.id }))
                }
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    profile.area === opt.id && styles.optionButtonTextSelected,
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* NÍVEL DE INGLÊS */}
          <Text style={styles.sectionTitle}>Qual seu nível de inglês hoje?</Text>
          <Text style={styles.subtitle}>
            Não precisa mentir pro app 😅 — é só para ajustar o tipo de vaga e as dicas.
          </Text>

          <View style={styles.optionsRow}>
            {ENGLISH_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.id}
                style={[
                  styles.optionButton,
                  profile.englishLevel === opt.id && styles.optionButtonSelected,
                ]}
                onPress={() =>
                  setProfile(prev => ({ ...prev, englishLevel: opt.id }))
                }
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    profile.englishLevel === opt.id && styles.optionButtonTextSelected,
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  }

  /* ----------------------------------------------
     TELA 2 – INTRO SOBRE O PAÍS
  ------------------------------------------------*/
  if (screen === 'countryIntro') {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.screenContent}
      >
        <BackButton onPress={goBack} />

        <Text style={styles.title}>{countryLabel}</Text>

        <Text style={styles.subtitle}>
          {countryLabel} é um dos destinos mais escolhidos por brasileiros.
          Aqui dentro você vai ver:
        </Text>

        <Text style={styles.planText}>
          • quais são os principais tipos de visto que os brasileiros usam{'\n'}
          • quais documentos costumam ser pedidos{'\n'}
          • em qual etapa você paga taxas, agenda entrevista e entrega o passaporte{'\n'}
          • como se preparar psicologicamente para o dia da entrevista
        </Text>

        <Btn label="Continuar para os planos →" onPress={() => goTo('plans')} />
      </ScrollView>
    );
  }

  /* ----------------------------------------------
     TELA 3 – PLANOS (COM MERCADO PAGO)
  ------------------------------------------------*/
  if (screen === 'plans') {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.screenContent}
      >
        <BackButton onPress={goBack} />

        <Text style={styles.title}>Escolha seu plano</Text>

        {/* PREMIUM */}
        <Text style={styles.planTitle}>⭐ Premium – R$49,90 (pagamento único)</Text>
        <Text style={styles.planText}>
          Para quem quer um guia estruturado para montar o processo de visto
          por conta própria, sem gastar rios de dinheiro com consultores.
        </Text>
        <Text style={styles.planText}>
          • Checklist completo de documentos para {countryLabel}{'\n'}
          • Explicação do que é obrigatório e do que é recomendação extra{'\n'}
          • Formulários em Word (DS-156E, DS-157, DS-158) prontos para preencher{'\n'}
          • Explicação sobre formulários online (DS-160, portais oficiais, etc.){'\n'}
          • Linha do tempo do processo (o que fazer primeiro, segundo, terceiro){'\n'}
          • Dicas sobre roupa, postura e comportamento no dia da entrevista{'\n'}
          • Agenda dentro do app para você montar a sua própria timeline
        </Text>

        <Btn
          label="Assinar Premium"
          onPress={() => {
            Linking.openURL(MP_PREMIUM);
            // MVP: libera o app como Premium pra você testar
            setPlan('premium');
            goTo('dashboard');
          }}
        />

        {/* PRO */}
        <Text style={styles.planTitle}>🔥 PRO – R$19,90/mês</Text>
        <Text style={styles.planText}>
          Para quem, além do guia, quer acompanhar vagas reais e ter um canal
          direto de suporte por e-mail.
        </Text>
        <Text style={styles.planText}>
          • Tudo o que o Premium oferece{'\n'}
          • Radar de Vagas com links para sites públicos (LinkedIn, Indeed, etc.){'\n'}
          • Filtros por cidade, área e nível de inglês{'\n'}
          • Exemplo de empresas que já contrataram brasileiros{'\n'}
          • Suporte por e-mail em tempo quase real{'\n'}
          • Ajuda personalizada pra achar vagas: mande seu currículo para{' '}
          <Text style={{ fontWeight: '700' }}>empregos@vaimorarfora.com.br</Text> que nossa
          equipe procura oportunidades alinhadas com seu perfil.
        </Text>

        <Btn
          label="Assinar PRO"
          onPress={() => {
            Linking.openURL(MP_PRO);
            // MVP: libera o app como PRO pra você testar
            setPlan('pro');
            goTo('dashboard');
          }}
        />
      </ScrollView>
    );
  }

  /* ----------------------------------------------
     TELA 4 – DASHBOARD
  ------------------------------------------------*/
  if (screen === 'dashboard') {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.screenContent}
      >
        <BackButton onPress={goBack} />

        <Text style={styles.title}>Seu painel</Text>
        <Text style={styles.subtitle}>
          Aqui é onde você controla tudo: documentos, agenda, vagas (se for PRO)
          e os guias completos.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>📄 Documentos do visto</Text>
          <Text style={styles.planText}>
            Veja a lista de documentos obrigatórios, formulários que podem ser
            baixados em Word e o que é enviado apenas online.
          </Text>
          <Btn label="Abrir documentos" onPress={() => goTo('docs')} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>📅 Agenda do processo</Text>
          <Text style={styles.planText}>
            Aqui você vai montar a sua timeline: quando quer juntar documentos,
            enviar formulários, pagar taxas, fazer biometria e entrevista.
          </Text>
          <Btn label="Abrir agenda" onPress={() => goTo('agenda')} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>💼 Radar de Vagas</Text>
          <Text style={styles.planText}>
            Para assinantes PRO: visão organizada da sua busca de emprego no país
            que você escolheu, com links diretos para os principais sites de vagas.
          </Text>
          <Btn label="Abrir radar" onPress={() => goTo('radar')} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>📘 Guias & modelinhos</Text>
          <Text style={styles.planText}>
            Guias em texto simples + modelos de cartas, e-mails e argumentos
            para você adaptar para o seu caso.
          </Text>
          <Btn label="Abrir guias" onPress={() => goTo('guides')} />
        </View>
      </ScrollView>
    );
  }

  /* ----------------------------------------------
     TELA 5 – DOCUMENTOS
  ------------------------------------------------*/
  if (screen === 'docs') {
    const renderDocDetail = () => {
      if (activeDoc === 'ds156e') {
        return (
          <Text style={styles.detailText}>
            DS-156E é um suplemento usado para vistos de investidor/trader (E-1/E-2)
            para quem vai investir ou operar negócios em certos países. Aqui você
            teria o arquivo Word para preencher com calma antes de imprimir/assinar.
          </Text>
        );
      }
      if (activeDoc === 'ds157') {
        return (
          <Text style={styles.detailText}>
            DS-157 é um formulário complementar de histórico pessoal para alguns
            tipos de visto. Na versão completa, você consegue baixar ele em Word
            e ver cada campo explicado em português.
          </Text>
        );
      }
      if (activeDoc === 'ds158') {
        return (
          <Text style={styles.detailText}>
            DS-158 traz seu histórico de contato e trabalho. Serve para dar visão
            completa do seu background. O app mostra exemplos de preenchimento
            e erros para evitar.
          </Text>
        );
      }
      return null;
    };

    const renderOnlineDetail = () => {
      if (activeOnlineForm === 'ds160') {
        return (
          <Text style={styles.detailText}>
            DS-160 é o formulário de visto não-imigrante dos EUA (turismo, estudo,
            intercâmbio, etc.). Ele é 100% online, feito no site oficial. Aqui o
            app não baixa arquivo – ele te leva pro site oficial e mostra, tela por
            tela, quais dúvidas normalmente travam os brasileiros.
          </Text>
        );
      }
      if (activeOnlineForm === 'ircc') {
        return (
          <Text style={styles.detailText}>
            Aplicações IRCC (Canadá) são feitas no portal do governo canadense.
            Você cria conta, escolhe o tipo de visto (Study Permit, Work Permit,
            etc.) e faz upload dos documentos lá. O app mostra links oficiais e
            checklists organizados.
          </Text>
        );
      }
      if (activeOnlineForm === 'irlanda') {
        return (
          <Text style={styles.detailText}>
            Irlanda usa portais e formulários online diferentes dependendo do tipo
            de visto (estudo, trabalho, etc.). Aqui o app centraliza os links e
            explica a ordem das etapas para você não se perder.
          </Text>
        );
      }
      return null;
    };

    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.screenContent}
      >
        <BackButton onPress={goBack} />

        <Text style={styles.title}>Documentos do visto</Text>
        <Text style={styles.subtitle}>
          Aqui você encontra a visão geral dos documentos e formulários usados
          com mais frequência para {countryLabel}.
        </Text>

        <Text style={styles.sectionTitle}>📋 Formulários em Word (clique para ver detalhes)</Text>

        <TouchableOpacity onPress={() => setActiveDoc('ds156e')} style={styles.listItem}>
          <Text style={styles.listItemText}>DS-156E – Suplemento para vistos E (Trader/Investor)</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveDoc('ds157')} style={styles.listItem}>
          <Text style={styles.listItemText}>DS-157 – Supplemental Nonimmigrant Visa Application</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveDoc('ds158')} style={styles.listItem}>
          <Text style={styles.listItemText}>DS-158 – Contact Information and Work History</Text>
        </TouchableOpacity>

        {renderDocDetail()}

        <Text style={styles.sectionTitle}>🌐 Formulários 100% online</Text>

        <TouchableOpacity onPress={() => setActiveOnlineForm('ds160')} style={styles.listItem}>
          <Text style={styles.listItemText}>DS-160 – Formulário online EUA</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveOnlineForm('ircc')} style={styles.listItem}>
          <Text style={styles.listItemText}>Portal IRCC – Canadá (Study/Work Permit)</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveOnlineForm('irlanda')} style={styles.listItem}>
          <Text style={styles.listItemText}>Portais oficiais – Irlanda</Text>
        </TouchableOpacity>

        {renderOnlineDetail()}

        <Text style={styles.sectionTitle}>📍 Como e onde entregar</Text>
        <Text style={styles.planText}>
          Dependendo do país, você vai ter etapas em centros de atendimento (VAC,
          CASV), entrevista em consulado ou apenas análise online. O app mostra
          sempre: o que é feito presencialmente, o que é upload online e em qual
          etapa o passaporte é entregue.
        </Text>
      </ScrollView>
    );
  }

  /* ----------------------------------------------
     TELA 6 – AGENDA
  ------------------------------------------------*/
  if (screen === 'agenda') {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.screenContent}
      >
        <BackButton onPress={goBack} />

        <Text style={styles.title}>Agenda do processo</Text>
        <Text style={styles.subtitle}>
          Essa é a parte do app onde você transforma o sonho em datas reais.
          Aqui você escreve a timeline de quando quer que cada etapa esteja pronta:
          juntar documentos, enviar formulários, pagar taxas, biometria, entrevista,
          viagem, etc.
        </Text>

        <Text style={styles.planText}>
          Na versão completa, essa agenda pode ser integrada com lembretes e
          notificações no celular para você não perder nenhum prazo importante.
        </Text>

        <Text style={styles.sectionTitle}>📝 Escreva aqui um exemplo da sua timeline:</Text>

        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={6}
          placeholder={`Ex: Até 15/04 juntar documentos básicos...
Até 30/04 enviar DS-160...
Em maio fazer biometria...
Em junho entrevista...`}
          placeholderTextColor={colors.textMuted}
          value={agendaNotes}
          onChangeText={setAgendaNotes}
        />
      </ScrollView>
    );
  }

  /* ----------------------------------------------
     TELA 7 – RADAR DE VAGAS
  ------------------------------------------------*/
  if (screen === 'radar') {
    if (plan !== 'pro') {
      return (
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.screenContent}
        >
          <BackButton onPress={goBack} />

          <Text style={styles.title}>Radar de Vagas</Text>
          <Text style={styles.subtitle}>
            Essa área fica liberada no plano PRO. Aqui o app organiza a sua
            busca de emprego no exterior com base no país, área e nível de inglês
            que você escolheu.
          </Text>

          <Text style={styles.planText}>
            • visão clara das vagas por país e área{'\n'}
            • links diretos para sites como LinkedIn e Indeed{'\n'}
            • foco em empresas abertas a contratar estrangeiros
          </Text>

          <View style={styles.conciergeBox}>
            <Text style={styles.conciergeTitle}>👨‍💼 Ajuda personalizada pra achar emprego</Text>
            <Text style={styles.conciergeText}>
              Mesmo sem o radar liberado, você já pode contar com a ajuda da nossa equipe.
              Envie seu currículo em PDF para:
            </Text>
            <Text style={styles.conciergeEmail}>empregos@vaimorarfora.com.br</Text>
            <Text style={styles.conciergeText}>
              No e-mail, coloque também:{'\n'}
              • país onde você quer morar{'\n'}
              • área que você quer trabalhar{'\n'}
              • seu nível de inglês
            </Text>
            <Text style={styles.conciergeText}>
              A equipe da VaiMorarFora vai buscar vagas que combinem com o seu perfil
              e te mandar opções reais para se candidatar.
            </Text>
          </View>
        </ScrollView>
      );
    }

    const areaLabel = AREA_LABEL_BY_ID[profile.area];
    const englishLabel = ENGLISH_LABEL_BY_ID[profile.englishLevel];

    const jobs = MOCK_JOBS
      .filter(j => j.country === profile.country)
      .filter(j => !areaLabel || j.area === areaLabel)
      .filter(j => !englishLabel || j.english === englishLabel);

    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.screenContent}
      >
        <BackButton onPress={goBack} />

        <Text style={styles.title}>Radar de Vagas</Text>
        <Text style={styles.subtitle}>
          Aqui você acompanha vagas no país que escolheu e usa o app como base
          pra organizar a sua busca de emprego no exterior.
        </Text>
        <Text style={styles.planText}>
          • Área alvo: {areaLabel || 'qualquer área'}{'\n'}
          • Nível de inglês: {englishLabel || 'qualquer nível'}
        </Text>

        {jobs.length === 0 && (
          <Text style={styles.planText}>
            Ainda não há exemplos de vagas cadastradas para esse perfil. Você
            pode usar o botão abaixo para abrir buscas filtradas em sites oficiais.
          </Text>
        )}

        {jobs.map(job => (
          <View key={job.id} style={styles.jobCard}>
            <Text style={styles.jobTitle}>{job.title}</Text>
            <Text style={styles.jobCompany}>{job.company}</Text>
            <Text style={styles.jobMeta}>
              {job.city}
              {job.region ? `, ${job.region}` : ''} · {job.area}
            </Text>
            <Text style={styles.jobMeta}>Inglês: {job.english}</Text>
            <TouchableOpacity onPress={() => Linking.openURL(job.url)}>
              <Text style={styles.jobLink}>Abrir site da vaga</Text>
            </TouchableOpacity>
          </View>
        ))}

        <Btn
          label="Buscar vagas em sites oficiais (Indeed)"
          type="secondary"
          onPress={handleOpenIndeedForCountry}
        />

        <View style={styles.conciergeBox}>
          <Text style={styles.conciergeTitle}>👨‍💼 Ajuda personalizada pra achar emprego</Text>
          <Text style={styles.conciergeText}>
            Além do radar, você pode pedir ajuda direta da nossa equipe pra encontrar
            vagas que façam sentido pro seu perfil.
          </Text>
          <Text style={styles.conciergeText}>
            📩 Envie seu currículo em PDF para:
          </Text>
          <Text style={styles.conciergeEmail}>empregos@vaimorarfora.com.br</Text>
          <Text style={styles.conciergeText}>
            No e-mail, coloque também:{'\n'}
            • país onde você quer morar{'\n'}
            • área que você quer trabalhar{'\n'}
            • seu nível de inglês
          </Text>
          <Text style={styles.conciergeText}>
            Nosso time vai analisar seu perfil e te enviar vagas reais pra você
            aplicar com muito mais segurança.
          </Text>
        </View>
      </ScrollView>
    );
  }

  /* ----------------------------------------------
     TELA 8 – GUIAS
  ------------------------------------------------*/
  if (screen === 'guides') {
    const renderGuideDetail = () => {
      if (activeGuide === 'geral') {
        return (
          <Text style={styles.detailText}>
            O Guia Geral explica como funciona o processo de visto para {countryLabel}
            em linguagem simples, sem juridiquês: quais as fases, prazos médios
            e erros que mais fazem brasileiros serem negados.
          </Text>
        );
      }
      if (activeGuide === 'modelos') {
        return (
          <Text style={styles.detailText}>
            Modelos em Word prontos para você adaptar: carta explicando vínculo
            com o Brasil, carta de intenção (Study Plan), declaração de suporte
            financeiro e e-mails para escolas/empresas. Inclui também um
            modelinho de e-mail para você pedir ajuda da equipe VaiMorarFora
            na busca de vagas.
          </Text>
        );
      }
      if (activeGuide === 'entrevista') {
        return (
          <Text style={styles.detailText}>
            Guia focado apenas no dia da entrevista: o que falar, o que não falar,
            como responder sem decorar texto, como se vestir e o que levar na pasta.
          </Text>
        );
      }
      if (activeGuide === 'faq') {
        return (
          <Text style={styles.detailText}>
            FAQ interna respondendo dúvidas como: "isso garante visto?",
            "vocês são advogados?", "posso usar o app para vários países?",
            sempre com respostas honestas e baseadas nas regras oficiais.
          </Text>
        );
      }
      return null;
    };

    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.screenContent}
      >
        <BackButton onPress={goBack} />

        <Text style={styles.title}>Guias & modelos</Text>
        <Text style={styles.subtitle}>
          Aqui ficam os conteúdos explicativos e os “textos prontos” que o
          cliente pode adaptar para o próprio caso.
        </Text>

        <TouchableOpacity onPress={() => setActiveGuide('geral')} style={styles.listItem}>
          <Text style={styles.listItemText}>📘 Guia geral do processo</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveGuide('modelos')} style={styles.listItem}>
          <Text style={styles.listItemText}>📝 Modelos em Word</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveGuide('entrevista')} style={styles.listItem}>
          <Text style={styles.listItemText}>🎤 Guia da entrevista</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveGuide('faq')} style={styles.listItem}>
          <Text style={styles.listItemText}>❓ FAQ interna</Text>
        </TouchableOpacity>

        {renderGuideDetail()}
      </ScrollView>
    );
  }

  return null;
}

/* ----------------------------------------------
   ESTILOS
------------------------------------------------*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.bg,
  },
  onboardingContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: spacing.lg,
  },
  screenContent: {
    paddingBottom: spacing.lg,
  },
  countryButtonsBlock: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 26,
    color: colors.primarySoft,
    fontWeight: '800',
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  planText: {
    color: colors.textMuted,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  btn: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 10,
    marginBottom: spacing.sm,
  },
  btnSecondary: {
    backgroundColor: '#333',
  },
  btnLabel: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  planTitle: {
    fontSize: 20,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#151515',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  jobCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  jobTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  jobCompany: {
    color: colors.textMuted,
    fontSize: 14,
  },
  jobMeta: {
    color: colors.textMuted,
    marginTop: 4,
  },
  jobLink: {
    color: colors.primarySoft,
    marginTop: 8,
  },
  backButtonWrapper: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#333',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 999,
  },
  backButtonLabel: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  listItem: {
    backgroundColor: '#151515',
    borderRadius: 10,
    padding: spacing.sm,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  listItemText: {
    color: colors.text,
  },
  detailText: {
    color: colors.textMuted,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  textArea: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: spacing.sm,
    color: colors.text,
    textAlignVertical: 'top',
    marginTop: spacing.sm,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  optionButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  optionButtonSelected: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primarySoft,
  },
  optionButtonText: {
    color: colors.textMuted,
    fontSize: 13,
  },
  optionButtonTextSelected: {
    color: '#000',
    fontWeight: '600',
  },
  conciergeBox: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: 12,
    backgroundColor: '#151515',
    borderWidth: 1,
    borderColor: colors.border,
  },
  conciergeTitle: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 15,
    marginBottom: spacing.xs,
  },
  conciergeText: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  conciergeEmail: {
    color: colors.primarySoft,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
});

