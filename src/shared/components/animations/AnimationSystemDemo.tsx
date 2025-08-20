/**
 * 🎬 Animation System Demo
 * Comprehensive showcase of all animation components and variants
 */
import { Badge } from "@shared/components/ui/badge";
import { Button } from "@shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shared/components/ui/card";
import { Separator } from "@shared/components/ui/separator";
import { AnimatePresence, motion } from "framer-motion";
import { 
  PlayIcon, 
  RefreshCcw, 
  SparklesIcon, 
  Zap, 
  ArrowRightIcon,
  CheckCircle,
  Calendar,
  User,
  Settings
} from "lucide-react";
import { useState } from "react";
import { AnimatedBox, AnimatedList, AnimatedTableRow } from "./motion";
import { 
  modalVariants, 
  overlayVariants,
} from "./variants";

export function AnimationSystemDemo() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [listKey, setListKey] = useState(0);

  const resetDemo = () => {
    setActiveDemo(null);
    setListKey(prev => prev + 1);
  };

  const demoItems = [
    { id: 1, title: "Primeiro item", icon: <CheckCircle className="h-4 w-4" /> },
    { id: 2, title: "Segundo item", icon: <Calendar className="h-4 w-4" /> },
    { id: 3, title: "Terceiro item", icon: <User className="h-4 w-4" /> },
    { id: 4, title: "Quarto item", icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full"
          >
            <SparklesIcon className="h-5 w-5" />
            <span className="font-bold">Sistema de Animações</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-bold text-gray-900"
          >
            Demonstração Interativa
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-600 max-w-2xl mx-auto"
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
          className="flex flex-wrap gap-4 justify-center"
        >
          <Button
            onClick={resetDemo}
            variant="outline"
            className="gap-2 hover:scale-105 transition-transform"
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Fade In Animation */}
          <Card className="border-2 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
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
                onClick={() => setActiveDemo(activeDemo === "fadeIn" ? null : "fadeIn")}
                variant="outline"
                size="sm"
                className="w-full"
              >
                {activeDemo === "fadeIn" ? "Reset" : "Demonstrar"}
              </Button>
              
              <div className="h-32 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
                <AnimatePresence>
                  {activeDemo === "fadeIn" && (
                    <AnimatedBox variant="fadeIn">
                      <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-medium">
                        ✨ Fade In Effect!
                      </div>
                    </AnimatedBox>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>

          {/* Slide In Animation */}
          <Card className="border-2 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRightIcon className="h-5 w-5 text-green-600" />
                Slide In
              </CardTitle>
              <CardDescription>
                Deslizamento lateral com easing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => setActiveDemo(activeDemo === "slideIn" ? null : "slideIn")}
                variant="outline"
                size="sm"
                className="w-full"
              >
                {activeDemo === "slideIn" ? "Reset" : "Demonstrar"}
              </Button>
              
              <div className="h-32 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                <AnimatePresence>
                  {activeDemo === "slideIn" && (
                    <AnimatedBox variant="slideIn">
                      <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-medium">
                        🚀 Slide In Effect!
                      </div>
                    </AnimatedBox>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>

          {/* Scale In Animation */}
          <Card className="border-2 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
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
              <CardDescription>
                Crescimento com spring physics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => setActiveDemo(activeDemo === "scaleIn" ? null : "scaleIn")}
                variant="outline"
                size="sm"
                className="w-full"
              >
                {activeDemo === "scaleIn" ? "Reset" : "Demonstrar"}
              </Button>
              
              <div className="h-32 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
                <AnimatePresence>
                  {activeDemo === "scaleIn" && (
                    <AnimatedBox variant="scaleIn">
                      <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg font-medium">
                        💫 Scale In Effect!
                      </div>
                    </AnimatedBox>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>

          {/* Animated List */}
          <Card className="md:col-span-2 lg:col-span-3 border-2 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
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
                  onClick={() => setActiveDemo(activeDemo === "list" ? null : "list")}
                  variant="outline"
                  size="sm"
                >
                  {activeDemo === "list" ? "Reset" : "Animar Lista"}
                </Button>
                
                <Badge variant="secondary" className="ml-auto">
                  {demoItems.length} itens
                </Badge>
              </div>
              
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 min-h-32">
                <AnimatePresence>
                  {activeDemo === "list" && (
                    <AnimatedList key={listKey}>
                      {demoItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg mb-2"
                        >
                          {item.icon}
                          <span className="font-medium text-orange-800">{item.title}</span>
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
        <Card className="border-2 hover:border-indigo-300 transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <motion.div
                animate={{ 
                  rotateY: activeDemo === "table" ? [0, 180, 360] : 0 
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
              onClick={() => setActiveDemo(activeDemo === "table" ? null : "table")}
              variant="outline"
              size="sm"
            >
              {activeDemo === "table" ? "Reset" : "Animar Tabela"}
            </Button>
            
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3 font-medium">ID</th>
                    <th className="text-left p-3 font-medium">Nome</th>
                    <th className="text-left p-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {activeDemo === "table" && demoItems.map((item, index) => (
                      <AnimatedTableRow key={item.id} index={index}>
                        <td className="p-3 border-t">#{item.id}</td>
                        <td className="p-3 border-t">{item.title}</td>
                        <td className="p-3 border-t">
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
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowModal(false)}
            >
              {/* Modal */}
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto flex items-center justify-center"
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
                    className="text-gray-600"
                  >
                    Este modal usa spring physics para uma entrada suave e natural.
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
