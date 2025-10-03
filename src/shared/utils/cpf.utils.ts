/**
 * 🆔 CPF Utilities
 * Validação e formatação de CPF brasileiro
 * Baseado na lógica do backend (UniqueDataValidator)
 */

/**
 * Remove todos os caracteres não numéricos do CPF
 */
export function cleanCPF(cpf: string): string {
  return cpf.replace(/\D/g, "");
}

/**
 * Formata CPF para o padrão brasileiro: XXX.XXX.XXX-XX
 */
export function formatCPF(cpf: string): string {
  const cleaned = cleanCPF(cpf);

  if (cleaned.length !== 11) {
    return cpf; // Retorna o valor original se não tiver 11 dígitos
  }

  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

/**
 * Valida CPF usando o algoritmo oficial brasileiro
 * Retorna true se o CPF for válido
 */
export function validateCPF(cpf: string): boolean {
  const cleanCpf = cleanCPF(cpf);

  // Verifica se tem 11 dígitos
  if (cleanCpf.length !== 11) {
    return false;
  }

  // Verifica se todos os dígitos são iguais (CPFs inválidos conhecidos)
  if (/^(\d)\1{10}$/.test(cleanCpf)) {
    return false;
  }

  // Validação dos dígitos verificadores
  // Primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCpf[i]) * (10 - i);
  }
  let digit1 = 11 - (sum % 11);
  if (digit1 >= 10) digit1 = 0;

  if (parseInt(cleanCpf[9]) !== digit1) {
    return false;
  }

  // Segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCpf[i]) * (11 - i);
  }
  let digit2 = 11 - (sum % 11);
  if (digit2 >= 10) digit2 = 0;

  return parseInt(cleanCpf[10]) === digit2;
}

/**
 * Aplica máscara de CPF enquanto o usuário digita
 * Aceita entrada parcial e formata conforme o usuário digita
 */
export function maskCPF(value: string): string {
  const cleaned = cleanCPF(value);

  // Limita a 11 dígitos
  const limited = cleaned.slice(0, 11);

  // Aplica a máscara progressivamente
  if (limited.length <= 3) {
    return limited;
  } else if (limited.length <= 6) {
    return `${limited.slice(0, 3)}.${limited.slice(3)}`;
  } else if (limited.length <= 9) {
    return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6)}`;
  } else {
    return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6, 9)}-${limited.slice(9)}`;
  }
}

/**
 * Valida se o CPF está no formato correto: XXX.XXX.XXX-XX
 */
export function isValidCPFFormat(cpf: string): boolean {
  return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf);
}
