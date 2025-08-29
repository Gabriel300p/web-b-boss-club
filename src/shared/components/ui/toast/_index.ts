// 🎯 Most Used Shared Components
// Only exports frequently used components for clean imports

// 🍞 Toast System
export { ToastProvider } from "../../../../app/providers/ToastProvider";

// Core App Components
export {
  FullPageLoader,
  LoadingSpinner,
  PageLoader,
} from "../../common/LoadingSpinner";
export { ErrorBoundary } from "../../errors/ErrorBoundary";

// Layout Components (frequently used)
export { MainLayout } from "../../layout/MainLayout";

// 🎯 Skeletons (for loading states) - Updated to use centralized index
export * from "../../skeletons/_index";

// Most Used UI Components (from design system)
export { Button } from "../button";
export {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../dialog";
export { Input } from "../input";

// 📝 For better tree-shaking, import specific components directly:
// import { SearchBar } from '@shared/components/common/SearchBar';
// import { Select } from '@shared/components/ui/select';
// import { Table } from '@shared/components/ui/table';
// import { Pagination } from '@shared/components/ui/pagination';
