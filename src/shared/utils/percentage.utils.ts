/**
 * 📊 Percentage Utilities
 * Formatação e máscara para valores percentuais
 */

/**
 * Remove todos os caracteres não numéricos e vírgula do valor
 */
export function cleanPercentage(value: string): string {
  return value.replace(/[^\d,]/g, "");
}

/**
 * Aplica máscara de porcentagem: 25,5%
 * Limita a 100% com uma casa decimal
 */
export function maskPercentage(value: string): string {
  // Remove tudo exceto dígitos e vírgula
  let cleaned = value.replace(/[^\d,]/g, "");

  // Remove vírgulas duplicadas
  const parts = cleaned.split(",");
  if (parts.length > 2) {
    cleaned = parts[0] + "," + parts.slice(1).join("");
  }

  // Limita os dígitos antes da vírgula a 3 (100)
  const [intPart, decPart] = cleaned.split(",");
  let limitedInt = intPart.slice(0, 3);

  // Se começar com mais de 100, limita a 100
  if (parseInt(limitedInt || "0", 10) > 100) {
    limitedInt = "100";
  }

  // Limita uma casa decimal
  const limitedDec = decPart ? decPart.slice(0, 1) : "";

  // Monta o valor formatado
  let formatted = limitedInt;
  if (cleaned.includes(",")) {
    formatted += "," + limitedDec;
  }

  // Adiciona o símbolo %
  return formatted ? formatted + "%" : "";
}

/**
 * Converte valor mascarado (25,5%) para número (25.5)
 */
export function percentageToNumber(value: string): number {
  const cleaned = value.replace(/[^\d,]/g, "");
  if (cleaned.length === 0) return 0;

  const normalized = cleaned.replace(",", ".");
  return parseFloat(normalized);
}

/**
 * Converte número (25.5) para valor mascarado (25,5%)
 */
export function numberToPercentage(value: number): string {
  const formatted = value.toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });
  return formatted + "%";
}
