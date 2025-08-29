/**
 * 🎬 Animation System Demo
 * Comprehensive showcase of all animation components and variants
 */
import { Badge } from "@shared/components/ui/badge";
import { Button } from "@shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shared/components/ui/card";
import { Separator } from "@shared/components/ui/separator";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRightIcon,
  Calendar,
  CheckCircle,
  PlayIcon,
  RefreshCcw,
  Settings,
  SparklesIcon,
  User,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { AnimatedBox, AnimatedList, AnimatedTableRow } from "./motion";
import { modalVariants, overlayVariants } from "./variants";

export function AnimationSystemDemo() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [listKey, setListKey] = useState(0);

  const resetDemo = () => {
    setActiveDemo(null);
    setListKey((prev) => prev + 1);
  };

  const demoItems = [
    {
      id: 1,
      title: "Primeiro item",
      icon: <CheckCircle className="h-4 w-4" />,
    },
    { id: 2, title: "Segundo item", icon: <Calendar className="h-4 w-4" /> },
    { id: 3, title: "Terceiro item", icon: <User className="h-4 w-4" /> },
    { id: 4, title: "Quarto item", icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-6xl space-y-8"
      >
        {/* Header */}
        <div className="space-y-4 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-white"
          >
            <SparklesIcon className="h-5 w-5" />
            <span className="font-bold">Sistema de Animações</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-bold text-neutral-900"
          >
            Demonstração Interativa
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mx-auto max-w-2xl text-neutral-600"
          >
            Explore todas as animações e transições implementadas no sistema.
            Clique nos botões para ver cada animação em ação.
          </motion.p>
        </div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Button
            onClick={resetDemo}
            variant="outline"
            className="gap-2 transition-transform hover:scale-105"
          >
            <RefreshCcw className="h-4 w-4" />
            Reset All
          </Button>

          <Button
            onClick={() => setShowModal(true)}
            className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <PlayIcon className="h-4 w-4" />
            Show Modal Demo
          </Button>
        </motion.div>

        {/* Demo Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Fade In Animation */}
          <Card className="border-2 transition-all duration-300 hover:border-blue-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                Fade In
              </CardTitle>
              <CardDescription>
                Entrada suave com mudança de opacidade
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() =>
                  setActiveDemo(activeDemo === "fadeIn" ? null : "fadeIn")
                }
                variant="outline"
                size="sm"
                className="w-full"
              >
                {activeDemo === "fadeIn" ? "Reset" : "Demonstrar"}
              </Button>

              <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-neutral-200">
                <AnimatePresence>
                  {activeDemo === "fadeIn" && (
                    <AnimatedBox variant="fadeIn">
                      <div className="rounded-lg bg-blue-100 px-4 py-2 font-medium text-blue-800">
                        ✨ Fade In Effect!
                      </div>
                    </AnimatedBox>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>

          {/* Slide In Animation */}
          <Card className="border-2 transition-all duration-300 hover:border-green-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRightIcon className="h-5 w-5 text-green-600" />
                Slide In
              </CardTitle>
              <CardDescription>Deslizamento lateral com easing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() =>
                  setActiveDemo(activeDemo === "slideIn" ? null : "slideIn")
                }
                variant="outline"
                size="sm"
                className="w-full"
              >
                {activeDemo === "slideIn" ? "Reset" : "Demonstrar"}
              </Button>

              <div className="flex h-32 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-neutral-200">
                <AnimatePresence>
                  {activeDemo === "slideIn" && (
                    <AnimatedBox variant="slideIn">
                      <div className="rounded-lg bg-green-100 px-4 py-2 font-medium text-green-800">
                        🚀 Slide In Effect!
                      </div>
                    </AnimatedBox>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>

          {/* Scale In Animation */}
          <Card className="border-2 transition-all duration-300 hover:border-purple-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: activeDemo === "scaleIn" ? 360 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <SparklesIcon className="h-5 w-5 text-purple-600" />
                </motion.div>
                Scale In
              </CardTitle>
              <CardDescription>Crescimento com spring physics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() =>
                  setActiveDemo(activeDemo === "scaleIn" ? null : "scaleIn")
                }
                variant="outline"
                size="sm"
                className="w-full"
              >
                {activeDemo === "scaleIn" ? "Reset" : "Demonstrar"}
              </Button>

              <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-neutral-200">
                <AnimatePresence>
                  {activeDemo === "scaleIn" && (
                    <AnimatedBox variant="scaleIn">
                      <div className="rounded-lg bg-purple-100 px-4 py-2 font-medium text-purple-800">
                        💫 Scale In Effect!
                      </div>
                    </AnimatedBox>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>

          {/* Animated List */}
          <Card className="border-2 transition-all duration-300 hover:border-orange-300 hover:shadow-lg md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <motion.div
                  animate={{ y: [-2, 2, -2] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  📋
                </motion.div>
                Lista Animada
              </CardTitle>
              <CardDescription>
                Itens aparecem em sequência com delay escalonado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button
                  onClick={() =>
                    setActiveDemo(activeDemo === "list" ? null : "list")
                  }
                  variant="outline"
                  size="sm"
                >
                  {activeDemo === "list" ? "Reset" : "Animar Lista"}
                </Button>

                <Badge variant="secondary" className="ml-auto">
                  {demoItems.length} itens
                </Badge>
              </div>

              <div className="min-h-32 rounded-lg border-2 border-dashed border-neutral-200 p-4">
                <AnimatePresence>
                  {activeDemo === "list" && (
                    <AnimatedList key={listKey}>
                      {demoItems.map((item) => (
                        <div
                          key={item.id}
                          className="mb-2 flex items-center gap-3 rounded-lg border border-orange-200 bg-orange-50 p-3"
                        >
                          {item.icon}
                          <span className="font-medium text-orange-800">
                            {item.title}
                          </span>
                        </div>
                      ))}
                    </AnimatedList>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table Animation Demo */}
        <Card className="border-2 transition-all duration-300 hover:border-indigo-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <motion.div
                animate={{
                  rotateY: activeDemo === "table" ? [0, 180, 360] : 0,
                }}
                transition={{ duration: 1 }}
              >
                🗃️
              </motion.div>
              Tabela Animada
            </CardTitle>
            <CardDescription>
              Linhas da tabela com entrada sequencial
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() =>
                setActiveDemo(activeDemo === "table" ? null : "table")
              }
              variant="outline"
              size="sm"
            >
              {activeDemo === "table" ? "Reset" : "Animar Tabela"}
            </Button>

            <div className="overflow-hidden rounded-lg border">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="p-3 text-left font-medium">ID</th>
                    <th className="p-3 text-left font-medium">Nome</th>
                    <th className="p-3 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {activeDemo === "table" &&
                      demoItems.map((item, index) => (
                        <AnimatedTableRow key={item.id} index={index}>
                          <td className="border-t p-3">#{item.id}</td>
                          <td className="border-t p-3">{item.title}</td>
                          <td className="border-t p-3">
                            <Badge variant="secondary">Ativo</Badge>
                          </td>
                        </AnimatedTableRow>
                      ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Modal Demo */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Overlay */}
            <motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
              onClick={() => setShowModal(false)}
            >
              {/* Modal */}
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-4 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                  >
                    <SparklesIcon className="h-8 w-8 text-white" />
                  </motion.div>

                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl font-bold"
                  >
                    Modal Animado!
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-neutral-600"
                  >
                    Este modal usa spring physics para uma entrada suave e
                    natural.
                  </motion.p>

                  <Separator />

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button
                      onClick={() => setShowModal(false)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                    >
                      Fechar Modal
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
