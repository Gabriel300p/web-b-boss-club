import type {
  Comunicacao,
  ComunicacaoForm,
} from "../schemas/comunicacao.schemas";
import mockComunicacoes from "./data";

// Simula delay de rede
const simulateDelay = (ms: number = 1000) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchComunicacoes(): Promise<Comunicacao[]> {
  await simulateDelay();
  return [...mockComunicacoes];
}

export async function createComunicacao(
  data: ComunicacaoForm,
): Promise<Comunicacao> {
  await simulateDelay();
  const newComunicacao: Comunicacao = {
    id: Date.now().toString(),
    ...data,
    dataCriacao: new Date(),
    dataAtualizacao: new Date(),
  };
  mockComunicacoes.push(newComunicacao);
  return newComunicacao;
}

export async function updateComunicacao(
  id: string,
  data: ComunicacaoForm,
): Promise<Comunicacao> {
  await simulateDelay();
  const index = mockComunicacoes.findIndex((c) => c.id === id);
  if (index === -1) {
    throw new Error("Comunicação não encontrada");
  }

  const updatedComunicacao: Comunicacao = {
    ...mockComunicacoes[index],
    ...data,
    dataAtualizacao: new Date(),
  };

  mockComunicacoes[index] = updatedComunicacao;
  return updatedComunicacao;
}

export async function deleteComunicacao(id: string): Promise<void> {
  await simulateDelay();
  const index = mockComunicacoes.findIndex((c) => c.id === id);
  if (index === -1) {
    throw new Error("Comunicação não encontrada");
  }
  mockComunicacoes.splice(index, 1);
}
