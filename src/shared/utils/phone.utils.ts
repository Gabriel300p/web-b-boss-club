/**
 * Remove todos os caracteres não numéricos do telefone
 */
export function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

/**
 * Aplica máscara de telefone brasileiro enquanto o usuário digita
 * Suporta telefone fixo (10 dígitos) e celular (11 dígitos)
 * Formato: (XX) XXXX-XXXX ou (XX) XXXXX-XXXX
 */
export function maskPhone(value: string): string {
  const cleaned = cleanPhone(value);

  // Limita a 11 dígitos
  const limited = cleaned.slice(0, 11);

  // Aplica a máscara progressivamente
  if (limited.length <= 2) {
    return limited;
  } else if (limited.length <= 6) {
    return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
  } else if (limited.length <= 10) {
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 6)}-${limited.slice(6)}`;
  } else {
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
  }
}
