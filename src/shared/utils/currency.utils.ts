/**
 * 💰 Currency Utilities
 * Formatação e máscara para valores monetários em Real (BRL)
 */

/**
 * Remove todos os caracteres não numéricos do valor
 */
export function cleanCurrency(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Aplica máscara de moeda brasileira: R$ 1.234,56
 * Limita a R$ 999.999,99
 */
export function maskCurrency(value: string): string {
  const cleaned = cleanCurrency(value);

  // Limita a 8 dígitos (999.999,99 = 99999999 centavos)
  const limited = cleaned.slice(0, 8);

  if (limited.length === 0) {
    return "";
  }

  // Converte para número em centavos
  const numberValue = parseInt(limited, 10);

  // Converte para reais (divide por 100)
  const reais = numberValue / 100;

  // Formata com separadores brasileiros
  return reais.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Converte valor mascarado (R$ 1.234,56) para número (1234.56)
 */
export function currencyToNumber(value: string): number {
  const cleaned = cleanCurrency(value);
  if (cleaned.length === 0) return 0;
  return parseInt(cleaned, 10) / 100;
}

/**
 * Converte número (1234.56) para valor mascarado (R$ 1.234,56)
 */
export function numberToCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
