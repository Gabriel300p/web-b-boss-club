import { Button } from "@shared/components/ui/button";
import { motion } from "framer-motion";
import { Filter, RefreshCw, SearchX } from "lucide-react";

interface EmptyStateProps {
  type?: "noResults" | "noData" | "filtered";
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

// 🎯 Componente SVG animado personalizado
const EmptyIllustration = ({ type }: { type: EmptyStateProps["type"] }) => {
  if (type === "filtered") {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative"
      >
        <motion.div
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative mx-auto h-32 w-32"
        >
          <svg
            viewBox="0 0 128 128"
            className="h-full w-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background circle */}
            <motion.circle
              cx="64"
              cy="64"
              r="60"
              fill="url(#gradient1)"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            />

            {/* Search icon */}
            <motion.g
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <circle
                cx="50"
                cy="50"
                r="16"
                stroke="#6366f1"
                strokeWidth="3"
                fill="none"
              />
              <motion.line
                x1="62"
                y1="62"
                x2="78"
                y2="78"
                stroke="#6366f1"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.6, duration: 0.3 }}
              />
            </motion.g>

            {/* Filter icon */}
            <motion.g
              initial={{ scale: 0, x: 20 }}
              animate={{ scale: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
            >
              <path
                d="M80 35h8a2 2 0 012 2v4l-6 6v8a2 2 0 01-1 1.73l-4 2A2 2 0 0177 57v-6l-6-6v-4a2 2 0 012-2h7z"
                fill="#f59e0b"
                stroke="#f59e0b"
                strokeWidth="1"
              />
            </motion.g>

            {/* Floating particles */}
            {[...Array(6)].map((_, i) => (
              <motion.circle
                key={i}
                cx={30 + i * 15}
                cy={90 + (i % 2) * 10}
                r="2"
                fill={i % 2 === 0 ? "#6366f1" : "#f59e0b"}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  y: [0, -20, 0],
                }}
                transition={{
                  delay: 1 + i * 0.2,
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              />
            ))}

            <defs>
              <linearGradient
                id="gradient1"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#e0e7ff" />
                <stop offset="100%" stopColor="#f0f4ff" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </motion.div>
    );
  }

  // Default empty illustration
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative"
    >
      <motion.div
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative mx-auto h-32 w-32"
      >
        <svg
          viewBox="0 0 128 128"
          className="h-full w-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background */}
          <motion.circle
            cx="64"
            cy="64"
            r="60"
            fill="url(#gradient2)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          />

          {/* Document icon */}
          <motion.rect
            x="40"
            y="30"
            width="48"
            height="60"
            rx="4"
            fill="white"
            stroke="#e5e7eb"
            strokeWidth="2"
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          />

          {/* Document lines */}
          {[0, 1, 2].map((i) => (
            <motion.line
              key={i}
              x1="48"
              y1={45 + i * 8}
              x2={72 - i * 4}
              y2={45 + i * 8}
              stroke="#d1d5db"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.6 + i * 0.1, duration: 0.3 }}
            />
          ))}

          <defs>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f3f4f6" />
              <stop offset="100%" stopColor="#e5e7eb" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    </motion.div>
  );
};

export function EmptyState({
  type = "noData",
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  const getContent = () => {
    switch (type) {
      case "filtered":
        return {
          icon: <Filter className="h-12 w-12 text-blue-500" />,
          title: title || "Nenhum resultado encontrado",
          description:
            description ||
            "Tente ajustar seus filtros para ver mais resultados.",
        };
      case "noResults":
        return {
          icon: <SearchX className="h-12 w-12 text-orange-500" />,
          title: title || "Nenhuma comunicação encontrada",
          description:
            description ||
            "Não encontramos comunicações que correspondam à sua busca.",
        };
      default:
        return {
          icon: null,
          title: title || "Nenhuma comunicação disponível",
          description:
            description || "Não há comunicações para exibir no momento.",
        };
    }
  };

  const content = getContent();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col items-center justify-center px-4 py-16 text-center ${className}`}
    >
      {/* Custom illustration or icon */}
      <div className="mb-6">
        {type === "filtered" || type === "noData" ? (
          <EmptyIllustration type={type} />
        ) : (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
            className="mb-4"
          >
            {content.icon}
          </motion.div>
        )}
      </div>

      {/* Text content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="max-w-md space-y-2"
      >
        <h3 className="text-lg font-semibold text-gray-900">{content.title}</h3>
        <p className="text-sm text-gray-500">{content.description}</p>
      </motion.div>

      {/* Action button */}
      {action && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="mt-6"
        >
          <Button
            onClick={action.onClick}
            variant="outline"
            className="gap-2 transition-transform hover:scale-105"
          >
            <RefreshCw className="h-4 w-4" />
            {action.label}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
