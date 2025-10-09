export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  isPopular?: boolean;
}

export interface SupportChannel {
  id: string;
  name: string;
  description: string;
  icon: string;
  link: string;
  isPrimary?: boolean;
}

export const faqCategories = [
  { id: "appointments", name: "Agendamentos", icon: "📅" },
  { id: "services", name: "Serviços e Preços", icon: "💈" },
  { id: "payments", name: "Pagamentos", icon: "💳" },
  { id: "account", name: "Conta e Perfil", icon: "👤" },
  { id: "professionals", name: "Profissionais", icon: "✂️" },
] as const;

export const faqItems: FAQItem[] = [
  // Agendamentos
  {
    id: "faq-1",
    question: "Como faço para agendar um horário?",
    answer:
      "Para agendar um horário, acesse a página de agendamentos, escolha o profissional de sua preferência, selecione o serviço desejado e o horário disponível. Você receberá uma confirmação por email e notificação no app.",
    category: "appointments",
    isPopular: true,
  },
  {
    id: "faq-2",
    question: "Posso cancelar ou reagendar meu horário?",
    answer:
      "Sim! Você pode cancelar ou reagendar seu horário até 2 horas antes do atendimento. Acesse 'Meus Agendamentos', selecione o horário e escolha a opção desejada. Cancelamentos com menos de 2 horas podem estar sujeitos a taxa.",
    category: "appointments",
    isPopular: true,
  },
  {
    id: "faq-3",
    question: "Como recebo notificações sobre meus agendamentos?",
    answer:
      "Você receberá notificações por email e pelo app 24 horas antes do agendamento, e também 1 hora antes. Certifique-se de que as notificações estão ativadas nas configurações do seu dispositivo.",
    category: "appointments",
  },
  {
    id: "faq-4",
    question: "O que acontece se eu me atrasar?",
    answer:
      "Recomendamos chegar com 5 minutos de antecedência. Em caso de atraso de até 15 minutos, faremos o possível para mantê-lo, mas o tempo de serviço pode ser reduzido. Atrasos maiores podem resultar em cancelamento sem reembolso.",
    category: "appointments",
  },

  // Serviços e Preços
  {
    id: "faq-5",
    question: "Quais serviços estão disponíveis?",
    answer:
      "Oferecemos corte de cabelo, barba, design de sobrancelhas, tratamentos capilares, coloração, luzes, e pacotes combo. Cada serviço tem duração e preço específicos que podem ser consultados na página de agendamento.",
    category: "services",
    isPopular: true,
  },
  {
    id: "faq-6",
    question: "Os preços variam por profissional?",
    answer:
      "Sim, alguns profissionais possuem valores diferenciados devido à experiência e especialização. Você pode ver o preço de cada profissional ao selecionar o serviço na página de agendamento.",
    category: "services",
  },
  {
    id: "faq-7",
    question: "Existe desconto em pacotes combo?",
    answer:
      "Sim! Oferecemos descontos especiais em pacotes combo como 'Corte + Barba' ou 'Corte + Design'. Os valores promocionais são exibidos automaticamente ao selecionar múltiplos serviços.",
    category: "services",
  },

  // Pagamentos
  {
    id: "faq-8",
    question: "Quais formas de pagamento são aceitas?",
    answer:
      "Aceitamos cartão de crédito, débito, PIX, dinheiro e carteiras digitais. O pagamento pode ser feito antecipadamente pelo app ou presencialmente no estabelecimento.",
    category: "payments",
    isPopular: true,
  },
  {
    id: "faq-9",
    question: "Como funciona o reembolso?",
    answer:
      "Reembolsos são processados em até 7 dias úteis para cancelamentos feitos com mais de 24 horas de antecedência. O valor será estornado na mesma forma de pagamento utilizada. Para pagamentos em dinheiro, entre em contato com o suporte.",
    category: "payments",
  },
  {
    id: "faq-10",
    question: "Posso solicitar nota fiscal?",
    answer:
      "Sim! A nota fiscal é gerada automaticamente após o pagamento e enviada para seu email cadastrado. Você também pode acessá-la na seção 'Histórico de Agendamentos' no app.",
    category: "payments",
  },

  // Conta e Perfil
  {
    id: "faq-11",
    question: "Como edito meus dados cadastrais?",
    answer:
      "Acesse 'Configurações' > 'Meu Perfil' para atualizar seus dados pessoais, email, telefone e foto. Algumas alterações podem requerer verificação por email.",
    category: "account",
  },
  {
    id: "faq-12",
    question: "Esqueci minha senha, como recupero?",
    answer:
      "Na tela de login, clique em 'Esqueci minha senha'. Você receberá um email com instruções para criar uma nova senha. Caso não receba, verifique sua caixa de spam ou entre em contato com o suporte.",
    category: "account",
    isPopular: true,
  },
  {
    id: "faq-13",
    question: "Como excluo minha conta?",
    answer:
      "Para excluir sua conta permanentemente, acesse 'Configurações' > 'Conta' > 'Excluir Conta'. Todos os seus dados serão removidos e você não poderá recuperá-los. Certifique-se de cancelar agendamentos futuros antes.",
    category: "account",
  },

  // Profissionais
  {
    id: "faq-14",
    question: "Como escolho o profissional ideal?",
    answer:
      "Você pode ver o perfil de cada profissional com suas especializações, avaliações de clientes e fotos de trabalhos anteriores. Recomendamos escolher baseado nas avaliações e no estilo que mais combina com você.",
    category: "professionals",
  },
  {
    id: "faq-15",
    question: "Posso avaliar o profissional após o atendimento?",
    answer:
      "Sim! Após cada atendimento, você receberá um convite para avaliar o serviço e o profissional. Sua avaliação ajuda outros clientes e contribui para melhorarmos continuamente nossos serviços.",
    category: "professionals",
  },
];

export const supportChannels: SupportChannel[] = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    description: "Resposta em até 5 minutos",
    icon: "whatsapp",
    link: "https://wa.me/5511965800803?text=Olá!%20Preciso%20de%20ajuda%20com%20o%20B-Boss%20Club.",
    isPrimary: true,
  },
  {
    id: "email",
    name: "E-mail",
    description: "suporte@bbossclub.com",
    icon: "mail",
    link: "mailto:suporte@bbossclub.com",
  },
  {
    id: "hours",
    name: "Horário de Atendimento",
    description: "Seg-Sex: 9h-18h | Sáb: 9h-14h",
    icon: "clock",
    link: "#",
  },
  {
    id: "instagram",
    name: "Instagram",
    description: "@bbossclub",
    icon: "instagram",
    link: "https://instagram.com/bbossclub",
  },
  {
    id: "facebook",
    name: "Facebook",
    description: "/bbossclub",
    icon: "facebook",
    link: "https://facebook.com/bbossclub",
  },
];
