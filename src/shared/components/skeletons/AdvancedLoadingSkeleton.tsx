import { motion } from "framer-motion";

// 🎯 Skeleton para carregamento avançado com progressão
export function AdvancedLoadingSkeleton({
  stages = ["Carregando...", "Preparando dados...", "Quase pronto..."],
  currentStage = 0,
}: {
  stages?: string[];
  currentStage?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center space-y-6 py-12"
    >
      {/* Círculo de progresso animado */}
      <motion.div
        className="relative"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <div className="h-16 w-16 rounded-full border-4 border-neutral-200">
          <div
            className="h-full w-full rounded-full border-4 border-blue-600 border-t-transparent"
            style={{
              transform: `rotate(${(currentStage / (stages.length - 1)) * 360}deg)`,
            }}
          />
        </div>
      </motion.div>

      {/* Texto do estágio atual */}
      <motion.div
        key={currentStage}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="text-lg font-medium text-neutral-900">
          {stages[currentStage] || stages[0]}
        </p>
        <div className="mt-2 flex justify-center space-x-2">
          {stages.map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full transition-colors ${
                i <= currentStage ? "bg-blue-600" : "bg-neutral-300"
              }`}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
