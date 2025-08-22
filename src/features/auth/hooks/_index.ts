// 🎯 Centralized Auth Hooks Export
// Organizes all auth hooks in one place for easy imports

// ===== CORE AUTH HOOKS =====
export * from "./useAuth";

// ===== SPECIFIC FUNCTIONALITY HOOKS =====
export { useForgotPasswordAuth } from "./useForgotPasswordAuth";
export { useLoginAuth } from "./useLoginAuth";
export { useMfaAuth } from "./useMfaAuth";

// ===== MIGRATION COMPLETED =====
// Legacy hooks (useLogin, useForgotPassword, useMfaVerification) have been successfully
// removed and replaced with the new consolidated auth system.
