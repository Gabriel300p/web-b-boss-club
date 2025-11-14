/**
 * 📅 Date Utilities
 * Formatação e máscara para datas no formato brasileiro DD/MM/YYYY
 */

/**
 * Remove todos os caracteres não numéricos da data
 */
export function cleanDate(date: string): string {
  return date.replace(/\D/g, "");
}

/**
 * Aplica máscara de data brasileira: DD/MM/YYYY
 * Limita a 8 dígitos (DDMMYYYY)
 */
export function maskDate(value: string): string {
  const cleaned = cleanDate(value);

  // Limita a 8 dígitos
  const limited = cleaned.slice(0, 8);

  // Aplica a máscara progressivamente
  if (limited.length <= 2) {
    return limited;
  } else if (limited.length <= 4) {
    return `${limited.slice(0, 2)}/${limited.slice(2)}`;
  } else {
    return `${limited.slice(0, 2)}/${limited.slice(2, 4)}/${limited.slice(4)}`;
  }
}

/**
 * Valida se a data está no formato DD/MM/YYYY e é uma data válida
 */
export function isValidDate(dateString: string): boolean {
  // Verifica formato DD/MM/YYYY
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = dateString.match(regex);

  if (!match) return false;

  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);

  // Verifica ranges básicos
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  if (year < 1900 || year > 2100) return false;

  // Cria objeto Date e verifica se é válida
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

/**
 * Converte data DD/MM/YYYY para ISO string YYYY-MM-DD
 */
export function dateToISO(dateString: string): string | null {
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = dateString.match(regex);

  if (!match) return null;

  const day = match[1];
  const month = match[2];
  const year = match[3];

  return `${year}-${month}-${day}`;
}

/**
 * Converte data DD/MM/YYYY para ISO datetime string YYYY-MM-DDTHH:mm:ss.sssZ
 * Usado para enviar ao backend que espera datetime
 */
export function dateToISODatetime(dateString: string): string | null {
  const isoDate = dateToISO(dateString);
  if (!isoDate) return null;

  // Adiciona horário 00:00:00.000 UTC
  return `${isoDate}T00:00:00.000Z`;
}

/**
 * Converte ISO string YYYY-MM-DD para DD/MM/YYYY
 */
export function isoToDate(isoString: string): string {
  const regex = /^(\d{4})-(\d{2})-(\d{2})/;
  const match = isoString.match(regex);

  if (!match) return "";

  const year = match[1];
  const month = match[2];
  const day = match[3];

  return `${day}/${month}/${year}`;
}

/**
 * Retorna a data de hoje no formato DD/MM/YYYY
 */
export function getTodayFormatted(): string {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();

  return `${day}/${month}/${year}`;
}

/**
 * Retorna a data de hoje no formato ISO YYYY-MM-DD
 */
export function getTodayISO(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
