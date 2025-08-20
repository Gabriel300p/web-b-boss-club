/**
 * 🎯 Test Fixtures - Dados padronizados para testes
 *
 * Este arquivo centraliza a criação de dados de teste consistentes,
 * garantindo que todos os testes usem a mesma estrutura de dados.
 */

import { faker } from "@faker-js/faker";
import type { Comunicacao } from "@features/comunicacoes/schemas/comunicacao.schemas";

// Seed para dados consistentes nos testes
faker.seed(123);

/**
 * Cria uma comunicação mock com dados válidos
 */
export const createMockComunicacao = (
  overrides: Partial<Comunicacao> = {},
): Comunicacao => ({
  id: faker.string.uuid(),
  titulo: faker.lorem.sentence(4),
  autor: faker.person.fullName(),
  tipo: faker.helpers.arrayElement(["Comunicado", "Aviso", "Notícia"]),
  descricao: faker.lorem.paragraph(2),
  dataCriacao: faker.date.recent({ days: 30 }),
  dataAtualizacao: faker.date.recent({ days: 7 }),
  ...overrides,
});

/**
 * Cria uma lista de comunicações mock
 */
export const createMockComunicacoes = (count: number): Comunicacao[] => {
  return Array.from({ length: count }, (_, index) =>
    createMockComunicacao({
      titulo: `Communication ${index + 1}`,
      autor: `Author ${index + 1}`,
    }),
  );
};

/**
 * Dados específicos para cenários de teste
 */
export const testScenarios = {
  // Comunicação válida padrão
  validComunicacao: createMockComunicacao({
    titulo: "Comunicação de Teste",
    autor: "Professor Teste",
    tipo: "Comunicado",
    descricao:
      "Esta é uma descrição de teste com conteúdo suficiente para validação.",
  }),

  // Comunicação com dados mínimos
  minimalComunicacao: createMockComunicacao({
    titulo: "T",
    autor: "A",
    descricao: "Descrição mínima para teste",
  }),

  // Lista para paginação
  paginationData: createMockComunicacoes(25),

  // Lista para busca/filtro
  searchData: [
    createMockComunicacao({ titulo: "Projeto Escolar", autor: "Maria Silva" }),
    createMockComunicacao({ titulo: "Reunião de Pais", autor: "João Santos" }),
    createMockComunicacao({ titulo: "Projeto Cultural", autor: "Ana Costa" }),
  ],

  // Dados para teste de ordenação
  sortingData: [
    createMockComunicacao({
      titulo: "Z - Último",
      dataCriacao: new Date("2024-01-01T00:00:00.000Z"),
    }),
    createMockComunicacao({
      titulo: "A - Primeiro",
      dataCriacao: new Date("2024-01-03T00:00:00.000Z"),
    }),
    createMockComunicacao({
      titulo: "M - Meio",
      dataCriacao: new Date("2024-01-02T00:00:00.000Z"),
    }),
  ],
};

/**
 * Dados inválidos para testes de validação
 */
export const invalidData = {
  emptyTitle: {
    titulo: "",
    autor: "Test",
    tipo: "Comunicado",
    descricao: "Test description",
  },
  emptyAuthor: {
    titulo: "Test",
    autor: "",
    tipo: "Comunicado",
    descricao: "Test description",
  },
  invalidType: {
    titulo: "Test",
    autor: "Test",
    tipo: "InvalidType",
    descricao: "Test description",
  },
  emptyDescription: {
    titulo: "Test",
    autor: "Test",
    tipo: "Comunicado",
    descricao: "",
  },
};

/**
 * Factory para criar dados customizados
 */
export class ComunicacaoFactory {
  static create(overrides?: Partial<Comunicacao>): Comunicacao {
    return createMockComunicacao(overrides);
  }

  static createMany(
    count: number,
    overrides?: Partial<Comunicacao>,
  ): Comunicacao[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }

  static withType(tipo: Comunicacao["tipo"], count = 1): Comunicacao[] {
    return this.createMany(count, { tipo });
  }

  static withAuthor(autor: string, count = 1): Comunicacao[] {
    return this.createMany(count, { autor });
  }

  static recent(days = 7, count = 5): Comunicacao[] {
    return this.createMany(count, {
      dataCriacao: faker.date.recent({ days }),
    });
  }
}
