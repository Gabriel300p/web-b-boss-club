/**
 * 📝 Records feature - Generic CRUD entity management
 * Renamed from 'comunicacoes' for broader reusability
 */

// Re-export all legacy comunicacoes APIs for backward compatibility during transition
export * from "../comunicacoes";

// New generic types (will eventually replace comunicacao-specific ones)
export type { Comunicacao as Record } from "../comunicacoes/schemas/comunicacao.schemas";

// Future: Add generic record types, hooks, and components here
