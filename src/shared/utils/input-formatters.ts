/**
 * 🎨 Input Formatters
 * Formatadores centralizados para campos de formulário
 * Aplicam máscaras e limitam tamanho automaticamente durante a digitação
 */

import { maskCPF } from "./cpf.utils";
import { maskPhone } from "./phone.utils";

/**
 * Formatadores de input para uso em formulários
 * Aplicam máscara em tempo real e garantem limites corretos
 */
export const inputFormatters = {
  /**
   * Formata CPF com máscara: XXX.XXX.XXX-XX
   * Limita automaticamente a 11 dígitos
   */
  cpf: (value: string): string => {
    return maskCPF(value);
  },

  /**
   * Formata telefone brasileiro: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
   * Limita automaticamente a 11 dígitos
   */
  phone: (value: string): string => {
    return maskPhone(value);
  },
} as const;

/**
 * Helper para criar onChange handler com formatação
 * Uso: onChange={createFormattedOnChange(field.onChange, inputFormatters.cpf)}
 */
export const createFormattedOnChange = (
  fieldOnChange: (value: string) => void,
  formatter: (value: string) => string,
) => {
  return (event: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatter(event.target.value);
    fieldOnChange(formatted);
  };
};
