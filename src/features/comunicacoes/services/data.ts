import type { Comunicacao } from "../schemas/comunicacao.schemas";

const mockComunicacoes: Comunicacao[] = [
  {
    id: "1",
    titulo: "Reunião de Pais e Mestres",
    autor: "João Silva",
    tipo: "Comunicado",
    descricao:
      "Reunião agendada para discussão do desenvolvimento acadêmico dos alunos.",
    dataCriacao: new Date("2024-01-15"),
    dataAtualizacao: new Date("2024-01-15"),
  },
  {
    id: "2",
    titulo: "Alteração no Horário",
    autor: "Maria Santos",
    tipo: "Aviso",
    descricao:
      "Informamos que haverá alteração no horário das aulas na próxima semana.",
    dataCriacao: new Date("2024-01-10"),
    dataAtualizacao: new Date("2024-01-12"),
  },
  {
    id: "3",
    titulo: "Festa Junina 2024",
    autor: "Pedro Costa",
    tipo: "Comunicado",
    descricao:
      "Convite para a tradicional Festa Junina da escola. Traga toda a família!",
    dataCriacao: new Date("2024-01-05"),
    dataAtualizacao: new Date("2024-01-08"),
  },
  {
    id: "4",
    titulo: "Suspensão das aulas",
    autor: "Ana Oliveira",
    tipo: "Comunicado",
    descricao:
      "Devido às condições climáticas adversas, as aulas serão suspensas na quinta-feira.",
    dataCriacao: new Date("2024-02-20"),
    dataAtualizacao: new Date("2024-02-20"),
  },
  {
    id: "5",
    titulo: "Matrícula para o semestre 2024.2",
    autor: "Carlos Mendes",
    tipo: "Comunicado",
    descricao:
      "Período de matrícula para o segundo semestre de 2024. Documentação necessária anexa.",
    dataCriacao: new Date("2024-06-15"),
    dataAtualizacao: new Date("2024-06-18"),
  },
  {
    id: "6",
    titulo: "Manutenção no sistema",
    autor: "TI - Roberto Lima",
    tipo: "Comunicado",
    descricao:
      "O sistema acadêmico ficará indisponível das 22h às 6h para manutenção programada.",
    dataCriacao: new Date("2024-03-12"),
    dataAtualizacao: new Date("2024-03-12"),
  },
  {
    id: "7",
    titulo: "Feira de Ciências 2024",
    autor: "Professora Lucia",
    tipo: "Comunicado",
    descricao:
      "Convocação para participação na Feira de Ciências. Inscrições até 30/04.",
    dataCriacao: new Date("2024-04-01"),
    dataAtualizacao: new Date("2024-04-05"),
  },
  {
    id: "8",
    titulo: "Mudança no cardápio",
    autor: "Nutricionista Paula",
    tipo: "Aviso",
    descricao:
      "Alteração temporária no cardápio da cantina devido à falta de alguns ingredientes.",
    dataCriacao: new Date("2024-05-08"),
    dataAtualizacao: new Date("2024-05-08"),
  },
  {
    id: "9",
    titulo: "Palestra sobre Carreiras",
    autor: "Coordenação Pedagógica",
    tipo: "Comunicado",
    descricao:
      "Palestra sobre orientação profissional para alunos do ensino médio. Auditório principal.",
    dataCriacao: new Date("2024-07-10"),
    dataAtualizacao: new Date("2024-07-12"),
  },
  {
    id: "10",
    titulo: "Provas de recuperação",
    autor: "Secretaria Acadêmica",
    tipo: "Aviso",
    descricao:
      "Cronograma das provas de recuperação do primeiro bimestre foi alterado.",
    dataCriacao: new Date("2024-03-25"),
    dataAtualizacao: new Date("2024-03-26"),
  },
  {
    id: "11",
    titulo: "Olimpíada de Matemática",
    autor: "Prof. Fernando Silva",
    tipo: "Comunicado",
    descricao:
      "Inscrições abertas para a Olimpíada Brasileira de Matemática das Escolas Públicas.",
    dataCriacao: new Date("2024-04-18"),
    dataAtualizacao: new Date("2024-04-20"),
  },
  {
    id: "12",
    titulo: "Horário de verão",
    autor: "Direção",
    tipo: "Comunicado",
    descricao:
      "Alteração nos horários das aulas devido ao início do horário de verão.",
    dataCriacao: new Date("2024-10-15"),
    dataAtualizacao: new Date("2024-10-15"),
  },
  {
    id: "13",
    titulo: "Semana da Arte",
    autor: "Prof. Marina Arts",
    tipo: "Comunicado",
    descricao:
      "Programação especial da Semana da Arte com exposições, teatro e música.",
    dataCriacao: new Date("2024-08-05"),
    dataAtualizacao: new Date("2024-08-08"),
  },
  {
    id: "14",
    titulo: "Biblioteca fechada",
    autor: "Bibliotecária Rosa",
    tipo: "Aviso",
    descricao:
      "A biblioteca permanecerá fechada nos dias 15 e 16 para reorganização do acervo.",
    dataCriacao: new Date("2024-09-10"),
    dataAtualizacao: new Date("2024-09-10"),
  },
  {
    id: "15",
    titulo: "Formatura 2024",
    autor: "Comissão de Formatura",
    tipo: "Comunicado",
    descricao:
      "Informações sobre a cerimônia de formatura dos concluintes de 2024.",
    dataCriacao: new Date("2024-11-01"),
    dataAtualizacao: new Date("2024-11-05"),
  },
];

export default mockComunicacoes;
