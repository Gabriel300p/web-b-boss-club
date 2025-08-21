// src/features/auth/services/auth.service.ts
import axios from "axios";

export async function loginRequest(values: {
  email: string;
  password: string;
}) {
  const { data } = await axios.post(
    `${import.meta.env.VITE_SUPABASE_URL}/auth/v1/token?grant_type=password`,
    values,
    {
      headers: {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
      },
    },
  );

  return data;
}

export async function forgotPasswordRequest(values: { email: string }) {
  const { data } = await axios.post(
    `${import.meta.env.VITE_SUPABASE_URL}/auth/reset-password`,
    values,
    {
      headers: {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
      },
    },
  );

  return data;
}

export async function mfaVerificationRequest(values: { email: string }) {
  const { data } = await axios.post(
    `${import.meta.env.VITE_SUPABASE_URL}/auth/verify-mfa`,
    values,
    {
      headers: {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
      },
    },
  );

  return data;
}
