/**
 * 📦 Supabase Storage Helper - Frontend
 * Helper para upload de arquivos no Supabase Storage (client-side)
 *
 * @see api-b-boss-club/docs/SUPABASE_STORAGE_SETUP.md para configuração do backend
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    "❌ SUPABASE_URL ou SUPABASE_ANON_KEY não configurado nas variáveis de ambiente",
  );
}

/**
 * 🏷️ Tipos
 */
export interface UploadOptions {
  bucket: string;
  path: string;
  file: File;
  onProgress?: (progress: number) => void;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

/**
 * ⚙️ Configurações
 */
export const STORAGE_CONFIG = {
  MAX_FILE_SIZE: 2 * 1024 * 1024, // 2MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
  BUCKETS: {
    STAFF_AVATARS: "staff-avatars",
  },
} as const;

/**
 * ✅ Valida tipo de arquivo
 */
export function validateImageType(file: File): boolean {
  return STORAGE_CONFIG.ALLOWED_IMAGE_TYPES.includes(
    file.type as "image/jpeg" | "image/png" | "image/webp",
  );
}

/**
 * ✅ Valida tamanho do arquivo
 */
export function validateFileSize(file: File): boolean {
  return file.size <= STORAGE_CONFIG.MAX_FILE_SIZE;
}

/**
 * ✅ Valida arquivo completo
 */
export function validateFile(file: File): {
  valid: boolean;
  error?: string;
} {
  if (!validateImageType(file)) {
    return {
      valid: false,
      error: `Tipo de arquivo não permitido. Use: ${STORAGE_CONFIG.ALLOWED_IMAGE_TYPES.join(", ")}`,
    };
  }

  if (!validateFileSize(file)) {
    return {
      valid: false,
      error: `Arquivo muito grande. Máximo: ${STORAGE_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
  }

  return { valid: true };
}

/**
 * 📤 Upload de arquivo para o Supabase Storage
 *
 * @example
 * ```ts
 * const result = await uploadFile({
 *   bucket: 'staff-avatars',
 *   path: 'user-123/avatar-1234567890.jpg',
 *   file: imageFile,
 *   accessToken: userAccessToken, // Token do usuário autenticado
 *   onProgress: (progress) => console.log(`${progress}%`)
 * });
 *
 * if (result.success) {
 *   console.log('Uploaded:', result.url);
 * }
 * ```
 */
export async function uploadFile(
  options: UploadOptions & { accessToken: string },
): Promise<UploadResult> {
  const { bucket, path, file, onProgress, accessToken } = options;

  try {
    // Validar arquivo
    const validation = validateFile(file);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    // Upload usando XMLHttpRequest para ter progresso
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`;

      // Progress tracking
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = Math.round((e.loaded / e.total) * 100);
          onProgress(progress);
        }
      });

      // Success
      xhr.addEventListener("load", () => {
        if (xhr.status === 200 || xhr.status === 201) {
          const publicUrl = getPublicUrl(bucket, path);
          resolve({
            success: true,
            url: publicUrl,
            path,
          });
        } else {
          const error = JSON.parse(xhr.responseText);
          resolve({
            success: false,
            error: error.message || "Erro ao fazer upload do arquivo",
          });
        }
      });

      // Error
      xhr.addEventListener("error", () => {
        resolve({
          success: false,
          error: "Erro de conexão durante o upload",
        });
      });

      // Configurar e enviar (USA TOKEN DO USUÁRIO!)
      xhr.open("POST", uploadUrl);
      xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`); // ✅ Token do usuário autenticado
      xhr.setRequestHeader("apikey", SUPABASE_ANON_KEY);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.send(file);
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido no upload";
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * 🗑️ Deleta arquivo do Supabase Storage
 */
export async function deleteFile(
  bucket: string,
  path: string,
): Promise<UploadResult> {
  try {
    const deleteUrl = `${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`;

    const response = await fetch(deleteUrl, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        apikey: SUPABASE_ANON_KEY,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || "Erro ao deletar arquivo",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido ao deletar";
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * 🌐 Gera URL pública do arquivo
 */
export function getPublicUrl(bucket: string, path: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

/**
 * 🖼️ Gera URL otimizada para imagem
 */
export function getOptimizedImageUrl(
  bucket: string,
  path: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: "webp" | "jpeg" | "png";
  },
): string {
  let url = getPublicUrl(bucket, path);

  if (options) {
    const params = new URLSearchParams();

    if (options.width) params.append("width", options.width.toString());
    if (options.height) params.append("height", options.height.toString());
    if (options.quality) params.append("quality", options.quality.toString());
    if (options.format) params.append("format", options.format);

    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  return url;
}

/**
 * 📸 Gera path único para avatar
 */
export function generateAvatarPath(userId: string, file: File): string {
  const timestamp = Date.now();
  const extension = file.name.split(".").pop() || "jpg";
  return `${userId}/avatar-${timestamp}.${extension}`;
}

/**
 * 📤 Helper: Upload rápido de avatar
 *
 * @example
 * ```ts
 * const result = await uploadAvatar(userId, file, accessToken, (progress) => {
 *   console.log(`Uploading: ${progress}%`);
 * });
 * ```
 */
export async function uploadAvatar(
  userId: string,
  file: File,
  accessToken: string,
  onProgress?: (progress: number) => void,
): Promise<UploadResult> {
  const path = generateAvatarPath(userId, file);

  return uploadFile({
    bucket: STORAGE_CONFIG.BUCKETS.STAFF_AVATARS,
    path,
    file,
    accessToken,
    onProgress,
  });
}

/**
 * 🖼️ Redimensiona imagem no cliente (antes do upload)
 * Útil para economizar bandwidth e storage
 */
export async function resizeImage(
  file: File,
  maxWidth: number = 1024,
  maxHeight: number = 1024,
  quality: number = 0.85,
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        // Calcular novas dimensões mantendo aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Não foi possível criar contexto do canvas"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Erro ao converter imagem"));
              return;
            }

            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });

            resolve(resizedFile);
          },
          file.type,
          quality,
        );
      };

      img.onerror = () => reject(new Error("Erro ao carregar imagem"));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error("Erro ao ler arquivo"));
    reader.readAsDataURL(file);
  });
}
