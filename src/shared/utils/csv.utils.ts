/**
 * 📊 CSV Export Utilities
 * Funções para geração e download de arquivos CSV
 */

/**
 * Converte um array de objetos para formato CSV
 */
export function convertToCSV(data: Record<string, unknown>[]): string {
  if (data.length === 0) return "";

  // 1. Extrair headers (colunas)
  const headers = Object.keys(data[0]);

  // 2. Criar linha de cabeçalho
  const headerRow = headers.map(escapeCSVValue).join(",");

  // 3. Criar linhas de dados
  const dataRows = data.map((row) => {
    return headers
      .map((header) => {
        const value = row[header];
        return escapeCSVValue(value);
      })
      .join(",");
  });

  // 4. Combinar tudo
  return [headerRow, ...dataRows].join("\n");
}

/**
 * Escapa valores para formato CSV (RFC 4180)
 * - Adiciona aspas duplas se contém vírgula, quebra de linha ou aspas
 * - Duplica aspas duplas internas
 */
function escapeCSVValue(value: unknown): string {
  if (value === null || value === undefined) return "";

  const stringValue = String(value);

  // Verificar se precisa de escape
  const needsEscape = /[",\n\r]/.test(stringValue);

  if (needsEscape) {
    // Duplicar aspas duplas e envolver em aspas
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

/**
 * Gera timestamp para nome de arquivo
 * Formato: YYYY-MM-DD-HHmmss
 */
export function generateTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}-${hours}${minutes}${seconds}`;
}

/**
 * Faz download de um arquivo CSV
 */
export function downloadCSV(
  csvContent: string,
  filename: string,
  addBOM = true,
): void {
  // Adicionar BOM (Byte Order Mark) para UTF-8
  // Isso garante que o Excel reconheça caracteres especiais
  const BOM = "\uFEFF";
  const content = addBOM ? BOM + csvContent : csvContent;

  // Criar Blob com tipo MIME correto
  const blob = new Blob([content], {
    type: "text/csv;charset=utf-8;",
  });

  // Criar URL temporária
  const url = URL.createObjectURL(blob);

  // Criar link de download
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";

  // Adicionar ao DOM, clicar e remover
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Liberar URL
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Exporta dados diretamente para CSV
 * (wrapper de conveniência)
 */
export function exportToCSV(
  data: Record<string, unknown>[],
  filename: string,
): void {
  const csv = convertToCSV(data);
  downloadCSV(csv, filename);
}
