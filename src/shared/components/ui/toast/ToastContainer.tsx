import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import type { ToastData } from "./toast";
import { TOAST_CONFIG } from "./toast";
import { ToastMain } from "./ToastMain";

interface ToastContainerProps {
  toasts: ToastData[];
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  // 🎯 Render in portal
  return createPortal(
    <div
      className="pointer-events-none fixed top-4 right-4 z-50 flex flex-col-reverse space-y-3 space-y-reverse"
      style={{
        maxWidth: TOAST_CONFIG.maxWidth,
        width: "100%",
      }}
      aria-label="Notificações"
      role="region"
      aria-live="polite"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            className="pointer-events-auto"
            layout
            layoutId={toast.id}
          >
            <ToastMain toast={toast} onClose={onClose} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>,
    document.body,
  );
}
