/**
 * 📸 Avatar Upload Component
 * Componente de upload de foto de perfil com preview circular
 *
 * Features:
 * - Preview circular com iniciais como fallback
 * - Drag & drop
 * - Click to upload
 * - Validação de tipo e tamanho
 * - Progress indicator
 * - Crop/resize automático
 */

import { useAuth } from "@/features/auth/_index";
import { tokenManager } from "@/shared/services/token-manager";
import {
  STORAGE_CONFIG,
  resizeImage,
  uploadAvatar,
  validateFile,
} from "@/shared/utils/supabase-storage.utils";
import { Camera, Loader2, X } from "lucide-react";
import {
  type ChangeEvent,
  type DragEvent,
  useCallback,
  useRef,
  useState,
} from "react";

interface AvatarUploadProps {
  /** URL atual do avatar (opcional) */
  currentAvatarUrl?: string | null;
  /** Nome completo para gerar iniciais */
  fullName?: string;
  /** Callback quando upload completa com sucesso */
  onUploadSuccess: (url: string) => void;
  /** Callback quando há erro */
  onUploadError?: (error: string) => void;
  /** Modo de visualização (não permite edição) */
  disabled?: boolean;
  /** Tamanho do avatar */
  size?: "sm" | "md" | "lg";
}

export function AvatarUpload({
  currentAvatarUrl,
  fullName = "",
  onUploadSuccess,
  onUploadError,
  disabled = false,
  size = "lg",
}: AvatarUploadProps) {
  const { user } = useAuth();
  const [preview, setPreview] = useState<string | null>(
    currentAvatarUrl || null,
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * 🔤 Gera iniciais do nome
   */
  const getInitials = useCallback(() => {
    if (!fullName || fullName.trim() === "") return "?";

    const nameParts = fullName.trim().split(/\s+/);
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }

    const firstInitial = nameParts[0].charAt(0).toUpperCase();
    const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  }, [fullName]);

  /**
   * 📤 Processa e faz upload da imagem
   */
  const handleFileUpload = useCallback(
    async (file: File) => {
      if (!user) {
        onUploadError?.("Usuário não autenticado");
        return;
      }

      // Validar arquivo
      const validation = validateFile(file);
      if (!validation.valid) {
        onUploadError?.(validation.error || "Arquivo inválido");
        return;
      }

      try {
        setIsUploading(true);
        setUploadProgress(0);

        // Redimensionar imagem antes do upload (economia de bandwidth)
        const resizedFile = await resizeImage(file, 512, 512, 0.85);

        // Criar preview local
        const previewUrl = URL.createObjectURL(resizedFile);
        setPreview(previewUrl);

        // Pegar access token do sistema de auth
        const accessToken = tokenManager.getAccessToken();

        if (!accessToken) {
          throw new Error("Usuário não autenticado");
        }

        // Upload para Supabase Storage
        const result = await uploadAvatar(
          user.id,
          resizedFile,
          accessToken,
          (progress) => {
            setUploadProgress(progress);
          },
        );

        if (result.success && result.url) {
          onUploadSuccess(result.url);
        } else {
          // Remover preview em caso de erro
          setPreview(currentAvatarUrl || null);
          onUploadError?.(
            result.error || "Erro ao fazer upload. Tente novamente.",
          );
        }
      } catch (error) {
        setPreview(currentAvatarUrl || null);
        onUploadError?.(
          error instanceof Error
            ? error.message
            : "Erro inesperado. Tente novamente.",
        );
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [user, currentAvatarUrl, onUploadSuccess, onUploadError],
  );

  /**
   * 📁 Handler para seleção de arquivo
   */
  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileUpload(file);
      }
      // Resetar input para permitir selecionar o mesmo arquivo novamente
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [handleFileUpload],
  );

  /**
   * 🖱️ Handler para clique no avatar
   */
  const handleClick = useCallback(() => {
    if (disabled || isUploading) return;
    fileInputRef.current?.click();
  }, [disabled, isUploading]);

  /**
   * 🗑️ Remove avatar atual
   */
  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (disabled || isUploading) return;
      setPreview(null);
      onUploadSuccess(""); // Enviar string vazia para remover
    },
    [disabled, isUploading, onUploadSuccess],
  );

  /**
   * 🎯 Drag & Drop handlers
   */
  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled || isUploading) return;

      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleFileUpload(file);
      }
    },
    [disabled, isUploading, handleFileUpload],
  );

  /**
   * 🎨 Classes CSS dinâmicas
   */
  const sizeClasses = {
    sm: "size-20",
    md: "size-28",
    lg: "size-32",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const buttonSizeClasses = {
    sm: "size-7",
    md: "size-9",
    lg: "size-10",
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar Container */}
      <div
        className={`relative ${sizeClasses[size]} group cursor-pointer`}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Avatar Circle */}
        <div
          className={` ${sizeClasses[size]} flex items-center justify-center overflow-hidden rounded-full transition-all duration-200 ${
            isDragging
              ? "ring-primary/50 scale-105 ring-4"
              : "ring-2 ring-neutral-700/50"
          } ${disabled && "cursor-not-allowed opacity-60"} bg-neutral-800`}
        >
          {/* Loading State */}
          {isUploading && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-neutral-900/90">
              <Loader2 className="text-primary size-8 animate-spin" />
              <span className="text-xs text-neutral-400">
                {uploadProgress}%
              </span>
            </div>
          )}

          {/* Preview Image */}
          {preview ? (
            <img
              src={preview}
              alt="Avatar"
              className="size-full object-cover"
            />
          ) : (
            /* Fallback: Iniciais */
            <span
              className={`font-bold text-neutral-300 ${textSizeClasses[size]}`}
            >
              {getInitials()}
            </span>
          )}

          {/* Overlay com ícone de câmera (aparece no hover) */}
          {!disabled && !isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/60 opacity-0 transition-opacity group-hover:opacity-100">
              <Camera className="size-8 text-white" />
            </div>
          )}
        </div>

        {/* Botão de remover (só aparece se tiver imagem) */}
        {preview && !disabled && !isUploading && (
          <button
            type="button"
            onClick={handleRemove}
            className={`absolute -top-1 -right-1 ${buttonSizeClasses[size]} flex items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-all group-hover:opacity-100 hover:scale-110 hover:bg-red-600 focus:opacity-100 focus:ring-2 focus:ring-red-500 focus:outline-none`}
            aria-label="Remover foto"
          >
            <X className="size-4" />
          </button>
        )}

        {/* Input de arquivo (hidden) */}
        <input
          ref={fileInputRef}
          type="file"
          accept={STORAGE_CONFIG.ALLOWED_IMAGE_TYPES.join(",")}
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled || isUploading}
        />
      </div>

      {/* Instruções */}
      {!disabled && (
        <div className="text-center">
          <p className="text-xs text-neutral-400">
            Clique ou arraste para fazer upload
          </p>
          <p className="text-xs text-neutral-500">JPG, PNG ou WebP • Máx 2MB</p>
        </div>
      )}
    </div>
  );
}
