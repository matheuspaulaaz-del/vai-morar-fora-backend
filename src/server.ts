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
   LINKS MERCADO PAGO
------------------------------------------------*/
const MP_PREMIUM =
  'https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=88c9ae55c5634a2684cfe7e7691e99bb';
const MP_PRO =
  'https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=d34c4b5469a4410ea1805e6e327b688a';

/* ----------------------------------------------
   SETORES DISPONÍVEIS (multi-seleção)
------------------------------------------------*/
const ALL_SECTORS = [
  'Logística',
  'Vendas',
  'Atendimento',
  'Engenharia',
  'Construção',
  'Limpeza',
  'Hotelaria',
  'Cozinha',
  'TI / Software',
  'Administração',
  'Motorista',
  'Cuidador',
  'Armazém',
  'Operações',
  'Agricultura',
  'Manufatura',
  'Estoquista',
  'Produção',
  'Marketing',
  'Educação',
];

/* ----------------------------------------------
   FAKE JOBS (somente demonstração)
------------------------------------------------*/
const MOCK_JOBS = [
  {
    id: 1,
    title: 'Warehouse Associate',
    company: 'Amazon',
    city: 'Dallas',
    region: 'TX',
    area: 'Logística',
    url: 'https://www.indeed.com',
    country: 'usa',
  },
  {
    id: 2,
    title: 'Customer Support',
    company: 'Teleperformance',
    city: 'Vancouver',
    region: 'BC',
    area: 'Atendimento',
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
    url: 'https://ie.indeed.com',
    country: 'irlanda',
  },
];

/* ----------------------------------------------
   BOTÃO UNIVERSAL
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

/* ----------------------------------------------
   APP PRINCIPAL
------------------------------------------------*/
export default function App() {
  const [screen, setScreen] = useState('onboarding');
  const [plan, setPlan] = useState(null);

  const [profile, setProfile] = useState({
    country: undefined,
    sectors: [],
    english: undefined,
  });

  const countryNames = {
    usa: 'Estados Unidos',
    canada: 'Canadá',
    irlanda: 'Irlanda',
  };
  const countryLabel = countryNames[profile.country] || 'o país escolhido';

  const toggleSector = sector => {
    if (profile.sectors.includes(sector)) {
      setProfile({
        ...profile,
        sectors: profile.sectors.filter(s => s !== sector),
      });
    } else {
      setProfile({
        ...profile,
        sectors: [...profile.sectors, sector],
      });
    }
  };

  /* ----------------------------------------------
     TELA 1 – ONBOARDING
  ------------------------------------------------*/
  if (screen === 'onboarding') {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>VaiMorarFora</Text>

        <Text style={styles.subtitle}>
          E aí, para onde quer viajar?
        </Text>

        <Btn
          label="🇺🇸 Estados Unidos"
          onPress={() => {
            setProfile({ ...profile, country: 'usa' });
            setScreen('onboarding2');
          }}
        />
        <Btn
          label="🇨🇦 Canadá"
          onPress={() => {
            setProfile({ ...profile, country: 'canada' });
            setScreen('onboarding2');
          }}
        />
        <Btn
          label="🇮🇪 Irlanda"
          onPress={() => {
            setProfile({ ...profile, country: 'irlanda' });
            setScreen('onboarding2');
          }}
        />
      </ScrollView>
    );
  }

  /* ----------------------------------------------
     TELA 2 – SETORES (MULTI-SELEÇÃO)
  ------------------------------------------------*/
  if (screen === 'onboarding2') {
    return (
      <ScrollView style={styles.container}>
        <TouchableOpacity onPress={() => setScreen('onboarding')}>
          <Text style={styles.backFullBtn}>← Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Setores de interesse</Text>
        <Text style={styles.subtitle}>
          Em quais setores tem interesse em trabalhar?
        </Text>

        <View style={styles.optionsRow}>
          {ALL_SECTORS.map(sector => (
            <TouchableOpacity
              key={sector}
              onPress={() => toggleSector(sector)}
              style={[
                styles.optionButton,
                profile.sectors.includes(sector) &&
                  styles.optionButtonSelected,
              ]}
            >
              <Text style={styles.optionButtonText}>{sector}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Btn
          label="Continuar"
          onPress={() => setScreen('onboarding3')}
        />
      </ScrollView>
    );
  }

  /* ----------------------------------------------
     TELA 3 – NÍVEL DE INGLÊS
  ------------------------------------------------*/
  if (screen === 'onboarding3') {
    const englishLevels = ['nenhum', 'básico', 'intermediário', 'avançado'];

    return (
      <ScrollView style={styles.container}>
        <TouchableOpacity onPress={() => setScreen('onboarding2')}>
          <Text style={styles.backFullBtn}>← Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Seu inglês</Text>
        <Text style={styles.subtitle}>
          Qual seu nível de inglês?
        </Text>

        {englishLevels.map(level => (
          <TouchableOpacity
            key={level}
            onPress={() => {
              setProfile({ ...profile, english: level });
              setScreen('countryIntro');
            }}
            style={styles.listItem}
          >
            <Text style={styles.listItemText}>{level}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  /* ----------------------------------------------
     TELA 4 – INTRO DO PAÍS
  ------------------------------------------------*/
  if (screen === 'countryIntro') {
    return (
      <ScrollView style={styles.container}>
        <TouchableOpacity onPress={() => setScreen('onboarding3')}>
          <Text style={styles.backFullBtn}>← Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>{countryLabel}</Text>

        <Text style={styles.subtitle}>
          Aqui dentro você vai entender como funciona o processo para viajar para {countryLabel}.
        </Text>

        <Btn label="Continuar →" onPress={() => setScreen('plans')} />
      </ScrollView>
    );
  }

  /* ----------------------------------------------
     TELA 5 – PLANOS + DISCLOSURE
  ------------------------------------------------*/
  if (screen === 'plans') {
    return (
      <ScrollView style={styles.container}>
        <TouchableOpacity onPress={() => setScreen('countryIntro')}>
          <Text style={styles.backFullBtn}>← Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Escolha seu plano</Text>

        {/* PREMIUM */}
        <Text style={styles.planTitle}>⭐ Premium – R$49,90 (pagamento único)</Text>

        <Text style={styles.planText}>
          • Checklist completo de documentos para {countryLabel}{'\n'}
          • Explicação do que é obrigatório e do que é recomendação extra{'\n'}
          • Formulários em Word (DS-156E, DS-157, DS-158){'\n'}
          • Explicação sobre formulários online{'\n'}
          • Linha do tempo do processo (passo a passo oficial)
        </Text>

        <Btn
          label="Assinar Premium"
          onPress={() => {
            setPlan('premium');
            Linking.openURL(MP_PREMIUM);
          }}
        />

        {/* PRO */}
        <Text style={styles.planTitle}>🔥 PRO – R$19,90/mês</Text>

        <Text style={styles.planText}>
          • Tudo do Premium{'\n'}
          • Radar de Vagas estilo LinkedIn/Indeed{'\n'}
          • Filtros por cidade, inglês e setor{'\n'}
          • Suporte por e-mail quase em tempo real
        </Text>

        <Btn
          label="Assinar PRO"
          onPress={() => {
            setPlan('pro');
            Linking.openURL(MP_PRO);
          }}
        />

        <Text style={styles.disclaimer}>
          Aviso: este app não garante aprovação de visto nem contratação por nenhuma empresa. Ele serve para te ajudar a se organizar e tomar decisões mais conscientes.
        </Text>
      </ScrollView>
    );
  }

  /* ----------------------------------------------
     TELA 6 – DASHBOARD
  ------------------------------------------------*/
  if (screen === 'dashboard') {
    return (
      <ScrollView style={styles.container}>
        <TouchableOpacity onPress={() => setScreen('plans')}>
          <Text style={styles.backFullBtn}>← Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Seu painel</Text>
        <Text style={styles.subtitle}>
          Aqui é onde você controla tudo.
        </Text>

        {/* DOCUMENTOS */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📄 Documentos do visto</Text>
          <Btn label="Abrir documentos" onPress={() => setScreen('docs')} />
        </View>

        {/* AGENDA */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📅 Agenda do processo</Text>
          <Btn label="Abrir agenda" onPress={() => setScreen('agenda')} />
        </View>

        {/* LINHA DO TEMPO */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📍 Linha do tempo do processo</Text>
          <Btn label="Abrir linha do tempo" onPress={() => setScreen('timeline')} />
        </View>

        {/* RADAR */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>💼 Radar de Vagas</Text>
          <Btn label="Abrir radar" onPress={() => setScreen('radar')} />
        </View>

        {/* CONCIERGE */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🧑‍💼 Concierge VaiMorarFora</Text>
          <Text style={styles.planText}>
            Quer ajuda personalizada para achar vagas que combinem com você?
          </Text>

          <View style={styles.conciergeBox}>
            <Text style={styles.conciergeTitle}>Envie seu currículo para:</Text>
            <Text style={styles.conciergeEmail}>
              empregos@vaimorarfora.app
            </Text>
            <Text style={styles.planText}>
              Nossa equipe vai buscar vagas reais dentro do seu perfil.
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  /* ----------------------------------------------
     TELA 7 – DOCUMENTOS
  ------------------------------------------------*/
  if (screen === 'docs') {
    return (
      <ScrollView style={styles.container}>
        <TouchableOpacity onPress={() => setScreen('dashboard')}>
          <Text style={styles.backFullBtn}>← Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Documentos do visto</Text>

        <Text style={styles.sectionTitle}>📋 Formulários em Word</Text>

        <Text style={styles.listItemText}>DS-156E – Suplemento para vistos E</Text>
        <Text style={styles.listItemText}>DS-157 – Background Application</Text>
        <Text style={styles.listItemText}>DS-158 – Histórico de trabalho</Text>

        <Text style={styles.sectionTitle}>🌐 Formulários online</Text>

        <Text style={styles.listItemText}>DS-160 – Formulário eletrônico dos EUA</Text>
        <Text style={styles.listItemText}>Portal IRCC – Canadá</Text>
        <Text style={styles.listItemText}>Portais oficiais – Irlanda</Text>
      </ScrollView>
    );
  }

  /* ----------------------------------------------
     TELA 8 – AGENDA
  ------------------------------------------------*/
  if (screen === 'agenda') {
    const [agendaNotes, setAgendaNotes] = useState('');

    return (
      <ScrollView style={styles.container}>
        <TouchableOpacity onPress={() => setScreen('dashboard')}>
          <Text style={styles.backFullBtn}>← Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Agenda do processo</Text>
        <Text style={styles.subtitle}>
          Escreva como quer organizar suas datas:
        </Text>

        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={8}
          placeholder="Ex: Até 15/04 juntar documentos..."
          placeholderTextColor={colors.textMuted}
          value={agendaNotes}
          onChangeText={setAgendaNotes}
        />
      </ScrollView>
    );
  }

  /* ----------------------------------------------
     TELA 9 – LINHA DO TEMPO DO PROCESSO
  ------------------------------------------------*/
  if (screen === 'timeline') {
    return (
      <ScrollView style={styles.container}>
        <TouchableOpacity onPress={() => setScreen('dashboard')}>
          <Text style={styles.backFullBtn}>← Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Linha do tempo do processo</Text>

        <Text style={styles.planText}>1. Definir tipo de visto</Text>
        <Text style={styles.planText}>2. Criar conta nos portais oficiais</Text>
        <Text style={styles.planText}>3. Preencher formulários online</Text>
        <Text style={styles.planText}>4. Montar documentos de apoio</Text>
        <Text style={styles.planText}>5. Pagar taxas e agendar</Text>
        <Text style={styles.planText}>6. Biometria e entrevista</Text>
        <Text style={styles.planText}>7. Acompanhar análise</Text>
        <Text style={styles.planText}>8. Planejar a viagem</Text>

        <Btn
          label="Transformar isso em datas →"
          onPress={() => setScreen('agenda')}
        />
      </ScrollView>
    );
  }

  /* ----------------------------------------------
     TELA 10 – RADAR DE VAGAS
  ------------------------------------------------*/
  if (screen === 'radar') {
    const jobs = MOCK_JOBS.filter(j => j.country === profile.country);

    return (
      <ScrollView style={styles.container}>
        <TouchableOpacity onPress={() => setScreen('dashboard')}>
          <Text style={styles.backFullBtn}>← Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Radar de vagas</Text>

        {jobs.map(job => (
          <View key={job.id} style={styles.card}>
            <Text style={styles.cardTitle}>{job.title}</Text>
            <Text style={styles.planText}>{job.company}</Text>
            <Text style={styles.planText}>
              {job.city}{job.region ? `, ${job.region}` : ''} · {job.area}
            </Text>
            <TouchableOpacity onPress={() => Linking.openURL(job.url)}>
              <Text style={styles.jobLink}>Abrir vaga</Text>
            </TouchableOpacity>
          </View>
        ))}

        <Btn
          label="Buscar vagas no LinkedIn"
          onPress={() => Linking.openURL('https://www.linkedin.com/jobs/')}
        />
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
  title: {
    fontSize: 28,
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
  planTitle: {
    fontSize: 20,
    color: colors.text,
    fontWeight: '700',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  planText: {
    color: colors.textMuted,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  disclaimer: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    lineHeight: 18,
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
    fontWeight: '700',
  },
  backFullBtn: {
    color: '#FFF',
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    fontSize: 14,
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: '#151515',
    padding: spacing.md,
    marginBottom: spacing.md,
    borderRadius: 12,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  listItemText: {
    color: colors.text,
    marginBottom: spacing.xs,
  },
  textArea: {
    color: colors.text,
    backgroundColor: '#1A1A1A',
    padding: spacing.md,
    borderRadius: 10,
    borderColor: colors.border,
    borderWidth: 1,
    marginTop: spacing.md,
  },
  jobLink: {
    color: colors.primarySoft,
    marginTop: spacing.sm,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: spacing.lg,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#1A1A1A',
  },
  optionButtonSelected: {
    backgroundColor: colors.primarySoft,
  },
  optionButtonText: {
    color: '#FFF',
    fontSize: 13,
  },
  conciergeBox: {
    backgroundColor: '#1A1A1A',
    padding: spacing.md,
    borderRadius: 10,
    marginTop: spacing.sm,
  },
  conciergeTitle: {
    color: colors.text,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  conciergeEmail: {
    color: colors.primarySoft,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
});
