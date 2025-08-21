/**
 * 🎭 Auth Animation Components
 *
 * Specialized animation components for authentication pages.
 * Uses the existing animation system for consistency.
 */

import {
  FadeIn,
  PageTransition,
  StaggeredItem,
  StaggeredList,
} from "@/shared/animations";
import { ANIMATION_DURATION } from "@/shared/animations/config";
import Logo from "@shared/assets/logo/logo-simple.png";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

// 🎯 Auth Page Wrapper with Enhanced Animations
interface AuthPageWrapperProps {
  children: ReactNode;
  className?: string;
}

export function AuthPageWrapper({
  children,
  className = "",
}: AuthPageWrapperProps) {
  return (
    <PageTransition variant="slideUp" duration={ANIMATION_DURATION.slow}>
      <div
        className={`flex min-h-screen items-center justify-center p-4 ${className}`}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{
            duration: ANIMATION_DURATION.slow,
            ease: "easeOut",
          }}
          className="w-full max-w-md space-y-8"
        >
          {children}
        </motion.div>
      </div>
    </PageTransition>
  );
}

// 🎯 Auth Form with Staggered Animation
interface AuthFormProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}

export function AuthForm({
  children,
  title,
  subtitle,
  className = "",
}: AuthFormProps) {
  return (
    <StaggeredList className={`space-y-6 ${className}`}>
      <StaggeredItem>
        <FadeIn delay={0.1}>
          <div className="mb-8 flex flex-col items-center gap-5">
            <img src={Logo} alt="Logo" className="size-20" />
          </div>
          <div className="space-y-3 text-center">
            <motion.h1
              className="text-2xl font-bold tracking-tight text-neutral-50"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: ANIMATION_DURATION.normal,
                delay: 0.2,
              }}
            >
              {title}
            </motion.h1>
            {subtitle && (
              <motion.p
                className="text-base text-neutral-400"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: ANIMATION_DURATION.normal,
                  delay: 0.3,
                }}
              >
                {subtitle}
              </motion.p>
            )}
          </div>
        </FadeIn>
      </StaggeredItem>

      <StaggeredItem>
        <FadeIn delay={1}>{children}</FadeIn>
      </StaggeredItem>
    </StaggeredList>
  );
}

// 🎯 Auth Button with Enhanced Micro-interactions
interface AuthButtonProps {
  children: ReactNode;
  isLoading?: boolean;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

export function AuthButton({
  children,
  isLoading = false,
  className = "",
  onClick,
  type = "button",
  disabled = false,
}: AuthButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`relative w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${className} `}
      initial={{ scale: 1 }}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{ duration: ANIMATION_DURATION.fast }}
    >
      <motion.div
        className="flex items-center justify-center space-x-2"
        animate={isLoading ? { opacity: 0.7 } : { opacity: 1 }}
        transition={{ duration: ANIMATION_DURATION.fast }}
      >
        {children}
      </motion.div>

      {/* Loading overlay */}
      {isLoading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: ANIMATION_DURATION.fast }}
        >
          <motion.div
            className="h-5 w-5 rounded-full border-2 border-white border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        </motion.div>
      )}
    </motion.button>
  );
}

// 🎯 Auth Error Message with Shake Animation
interface AuthErrorProps {
  message: string;
  className?: string;
}

export function AuthError({ message, className = "" }: AuthErrorProps) {
  return (
    <motion.div
      className={`rounded-lg border border-red-900/30 bg-red-950/20 p-3 text-center text-sm text-red-400 ${className} `}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: 1,
        scale: 1,
        x: [0, -5, 5, -5, 5, 0], // Shake animation
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: ANIMATION_DURATION.slow,
        x: { duration: 0.5, ease: "easeInOut" },
      }}
    >
      {message}
    </motion.div>
  );
}

// 🎯 Auth Success Message with Slide Animation
interface AuthSuccessProps {
  message: string;
  className?: string;
}

export function AuthSuccess({ message, className = "" }: AuthSuccessProps) {
  return (
    <motion.div
      className={`rounded-lg border border-green-900/30 bg-green-950/20 p-3 text-center text-sm text-green-400 ${className} `}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: ANIMATION_DURATION.normal }}
    >
      {message}
    </motion.div>
  );
}
