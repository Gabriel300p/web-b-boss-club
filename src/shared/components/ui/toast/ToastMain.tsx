import { Button } from "@shared/components/ui/button";
import { motion } from "framer-motion";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Info,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { ToastData } from "./toast";
import {
  getIconClasses,
  getProgressBarClasses,
  getToastClasses,
  TOAST_CONFIG,
} from "./toast";

interface ToastProps {
  toast: ToastData;
  onClose: (id: string) => void;
  index: number;
}

// 🎯 Icon mapping
const TOAST_ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
} as const;

export function ToastMain({ toast, onClose }: Omit<ToastProps, "index">) {
  const [progress, setProgress] = useState(100);
  const [isHovered, setIsHovered] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMessageExpanded, setIsMessageExpanded] = useState(false);
  const [isPermanentlyPaused, setIsPermanentlyPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const Icon = TOAST_ICONS[toast.type];
  const duration = toast.duration ?? TOAST_CONFIG.duration[toast.type];
  const hasMessage = Boolean(toast.message);
  const isMessageExpandable = Boolean(toast.expandable && hasMessage);
  const showStopMessage = Boolean(toast.showStopMessage);

  // ⏱️ Progress timer with time tracking - OPTIMIZED
  useEffect(() => {
    if (toast.persistent || isPaused || isPermanentlyPaused) return;

    setTimeLeft(Math.ceil(duration / 1000));

    // 🔥 OPTIMIZATION: Use 150ms for smooth animation with good performance
    const interval = setInterval(() => {
      setProgress((prev) => {
        const decrement = 100 / (duration / 150); // Adjusted for 150ms
        const newProgress = prev - decrement;

        if (newProgress <= 0) {
          onClose(toast.id);
          return 0;
        }

        return newProgress;
      });
    }, 150); // 🔥 150ms - balance between smooth animation and performance

    // Update time left every second (keep 1000ms for accuracy)
    const timeInterval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        return newTime < 0 ? 0 : newTime;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timeInterval);
    };
  }, [
    toast.id,
    toast.persistent,
    duration,
    isPaused,
    isPermanentlyPaused,
    onClose,
  ]);

  // ⏸️ Pause on hover
  useEffect(() => {
    setIsPaused(isHovered);
  }, [isHovered]);

  // 🎯 Handle permanent pause
  const handlePermanentPause = () => {
    setIsPermanentlyPaused(true);
    setProgress(0); // Hide progress bar
    setTimeLeft(0);
  };

  // 📖 Handle message expansion
  const toggleMessageExpansion = () => {
    setIsMessageExpanded(!isMessageExpanded);
  };

  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        x: 300,
        scale: 0.9,
      }}
      animate={{
        opacity: 1,
        x: 0,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        x: 400,
        scale: 0.95,
      }}
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 200,
        mass: 0.5,
      }}
      className={getToastClasses()}
      style={{
        marginBottom: TOAST_CONFIG.spacing,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex w-full flex-col items-start gap-1.5">
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex flex-shrink-0 items-center gap-3">
            {/* Icon */}
            <Icon className={getIconClasses(toast.type)} aria-hidden="true" />
            {/* Title */}
            <h3 className="text-sm leading-tight font-semibold text-neutral-700 dark:text-neutral-100">
              {toast.title}
            </h3>
          </div>
          {/* Action Buttons */}
          <div className="flex flex-shrink-0 items-center gap-1">
            {/* Message Expand Toggle */}
            {isMessageExpandable && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMessageExpansion}
                className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                title={
                  isMessageExpanded ? "Recolher mensagem" : "Expandir mensagem"
                }
              >
                {isMessageExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            )}

            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
              onClick={() => onClose(toast.id)}
              aria-label="Fechar notificação"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {/* Content */}
        <div className="min-w-0 flex-1 pr-2">
          {/* Message */}
          {hasMessage && (
            <div className="mt-1">
              {isMessageExpandable ? (
                <>
                  {/* Truncated Message */}
                  {!isMessageExpanded && (
                    <p className="line-clamp-1 text-sm leading-relaxed text-neutral-500 dark:text-neutral-300">
                      {toast.message}
                    </p>
                  )}

                  {/* Expandable Message */}
                  <motion.div
                    initial={false}
                    animate={{
                      height: isMessageExpanded ? "auto" : 0,
                      opacity: isMessageExpanded ? 1 : 0,
                    }}
                    transition={{
                      duration: 0.3,
                      ease: "easeInOut",
                    }}
                    className="overflow-hidden"
                  >
                    {isMessageExpanded && (
                      <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-300">
                        {toast.message}
                      </p>
                    )}
                  </motion.div>
                </>
              ) : (
                /* Normal Message */
                <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-300">
                  {toast.message}
                </p>
              )}
            </div>
          )}
          {/* Pause Text */}
          {showStopMessage && (
            <>
              {!toast.persistent && !isPermanentlyPaused && timeLeft > 0 && (
                <div className="mt-3 text-xs text-neutral-400">
                  Essa mensagem fechará em {timeLeft}s.{" "}
                  <button
                    onClick={handlePermanentPause}
                    className="cursor-pointer text-neutral-600 underline transition-opacity hover:opacity-80 dark:text-neutral-100"
                  >
                    Clique para parar
                  </button>
                </div>
              )}
            </>
          )}

          {/* Custom Action */}
          {toast.action && (
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={toast.action.onClick}
                className="h-7 px-3 text-xs font-medium"
              >
                {toast.action.label}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 📊 Progress Bar */}
      {!toast.persistent && !isPermanentlyPaused && progress > 0 && (
        <motion.div
          className={`absolute bottom-0 left-0 h-1 rounded-b-xl ${getProgressBarClasses(toast.type)}`}
          initial={{ width: "100%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.15, ease: "linear" }}
          aria-hidden="true"
        />
      )}
    </motion.div>
  );
}
