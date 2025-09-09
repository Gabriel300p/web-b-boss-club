/**
 * 🧪 Teste para verificar se AuthGuard funciona corretamente
 */
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthGuard } from "../components/AuthGuard";

// Mock do useAuthStatus
const mockUseAuthStatus = vi.fn();
vi.mock("../hooks/useAuth", () => ({
  useAuthStatus: () => mockUseAuthStatus(),
}));

// Mock do useNavigate
const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
}));

// Mock do useDelayedLoading
vi.mock("@/shared/hooks/useDelayedLoading", () => ({
  useDelayedLoading: (isLoading: boolean) => isLoading,
}));

describe("AuthGuard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show loading spinner when redirecting unauthenticated user", () => {
    // Mock: usuário não autenticado, não carregando
    mockUseAuthStatus.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });

    render(
      <AuthGuard requireAuth={true}>
        <div>Protected Content</div>
      </AuthGuard>,
    );

    // Deve mostrar loading spinner durante redirect
    expect(screen.getByRole("status", { hidden: true })).toBeInTheDocument();

    // Deve chamar navigate para login
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/auth/login" });
  });

  it("should render children when user is authenticated", () => {
    // Mock: usuário autenticado
    mockUseAuthStatus.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });

    render(
      <AuthGuard requireAuth={true}>
        <div>Protected Content</div>
      </AuthGuard>,
    );

    // Deve renderizar o conteúdo protegido
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("should show loading when checking authentication", () => {
    // Mock: carregando autenticação
    mockUseAuthStatus.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    });

    render(
      <AuthGuard requireAuth={true}>
        <div>Protected Content</div>
      </AuthGuard>,
    );

    // Deve mostrar loading (null por causa do useDelayedLoading)
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
