// 🎯 Strategic Store Exports
// Explicit exports for better tree-shaking and type inference

// Auth Store
export { useAuthStore } from "./auth";
export type { AuthStore, User } from "./auth";

// App Store
export { useAppStore } from "./app";
export type { AppStore } from "./app";

// 📝 For direct access to specific pieces, prefer direct imports:
// import { useAuthStore } from '@app/store/auth';
// import type { User } from '@app/store/auth';
