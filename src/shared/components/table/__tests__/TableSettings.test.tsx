/**
 * 🧪 TableSettings Component Tests
 * Integration tests for the table settings component
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";

import { TableSettings } from "@shared/components/table/TableSettings";
import type { TableColumn } from "@shared/types/table.types";

// Mock @dnd-kit modules
vi.mock("@dnd-kit/core", () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dnd-context">{children}</div>
  ),
  DragOverlay: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="drag-overlay">{children}</div>
  ),
  useSensor: vi.fn(),
  useSensors: vi.fn(() => []),
  PointerSensor: vi.fn(),
  KeyboardSensor: vi.fn(),
  closestCenter: vi.fn(),
}));

vi.mock("@dnd-kit/sortable", () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sortable-context">{children}</div>
  ),
  arrayMove: vi.fn((array, from, to) => {
    const result = [...array];
    const [moved] = result.splice(from, 1);
    result.splice(to, 0, moved);
    return result;
  }),
  sortableKeyboardCoordinates: vi.fn(),
  verticalListSortingStrategy: vi.fn(),
}));

vi.mock("@dnd-kit/sortable", () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: null,
    isDragging: false,
    setActivatorNodeRef: vi.fn(),
  }),
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

const mockColumns: TableColumn[] = [
  { id: "name", label: "Nome", defaultVisible: true },
  { id: "email", label: "Email", defaultVisible: true },
  { id: "phone", label: "Telefone", defaultVisible: false },
  { id: "status", label: "Status", fixed: true },
];

const defaultProps = {
  tableId: "test-table",
  columnsFromApi: mockColumns,
  onChange: vi.fn(),
};

// Mock useToast hook
vi.mock("@shared/hooks/useToast", () => ({
  useToast: () => ({
    showToast: vi.fn(),
  }),
}));

const renderWithProviders = (props = defaultProps) => {
  return render(<TableSettings {...props} />);
};

describe("TableSettings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it("should render settings button with column count", () => {
    renderWithProviders();

    const button = screen.getByRole("button", { name: /configurar colunas/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Colunas");
  });

  it("should open popover when button is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders();

    const button = screen.getByRole("button", { name: /configurar colunas/i });
    await user.click(button);

    expect(screen.getByText("Configurar Colunas")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Buscar colunas...")).toBeInTheDocument();
  });

  it("should filter columns based on search term", async () => {
    const user = userEvent.setup();
    renderWithProviders();

    // Open popover
    const button = screen.getByRole("button", { name: /configurar colunas/i });
    await user.click(button);

    // Type in search
    const searchInput = screen.getByPlaceholderText("Buscar colunas...");
    await user.type(searchInput, "email");

    // Should show only email column
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.queryByText("Nome")).not.toBeInTheDocument();
  });

  it("should show 'no columns found' when search has no results", async () => {
    const user = userEvent.setup();
    renderWithProviders();

    // Open popover
    const button = screen.getByRole("button", { name: /configurar colunas/i });
    await user.click(button);

    // Type search with no results
    const searchInput = screen.getByPlaceholderText("Buscar colunas...");
    await user.type(searchInput, "nonexistent");

    expect(screen.getByText("Nenhuma coluna encontrada")).toBeInTheDocument();
  });

  it("should toggle column visibility", async () => {
    const mockOnChange = vi.fn();
    const user = userEvent.setup();

    renderWithProviders({ ...defaultProps, onChange: mockOnChange });

    // Open popover
    const button = screen.getByRole("button", { name: /configurar colunas/i });
    await user.click(button);

    // Find and click a checkbox
    const phoneCheckbox = screen.getByLabelText("Telefone");
    await user.click(phoneCheckbox);

    // Click save
    const saveButton = screen.getByRole("button", { name: /salvar/i });
    await user.click(saveButton);

    expect(mockOnChange).toHaveBeenCalledWith({
      order: expect.arrayContaining(["name", "email", "phone", "status"]),
      visibility: expect.objectContaining({
        phone: true, // Should be toggled to true
      }),
    });
  });

  it("should not allow toggling fixed columns", async () => {
    const user = userEvent.setup();
    renderWithProviders();

    // Open popover
    const button = screen.getByRole("button", { name: /configurar colunas/i });
    await user.click(button);

    // Fixed column checkbox should be disabled
    const statusCheckbox = screen.getByLabelText("Status");
    expect(statusCheckbox).toBeDisabled();

    // Should show fixed indicator
    expect(screen.getByTitle(/coluna fixa/i)).toBeInTheDocument();
  });

  it("should reset settings when reset button is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders();

    // Open popover
    const button = screen.getByRole("button", { name: /configurar colunas/i });
    await user.click(button);

    // Click reset
    const resetButton = screen.getByRole("button", { name: /reset/i });
    await user.click(resetButton);

    expect(localStorageMock.removeItem).toHaveBeenCalledWith(
      "table-settings:test-table",
    );
  });

  it("should save settings when save button is clicked", async () => {
    const mockOnChange = vi.fn();
    const user = userEvent.setup();

    renderWithProviders({ ...defaultProps, onChange: mockOnChange });

    // Open popover
    const button = screen.getByRole("button", { name: /configurar colunas/i });
    await user.click(button);

    // Click save
    const saveButton = screen.getByRole("button", { name: /salvar/i });
    await user.click(saveButton);

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "table-settings:test-table",
      expect.stringContaining('"updatedAt"'),
    );
    expect(mockOnChange).toHaveBeenCalled();
  });

  it("should close popover after saving", async () => {
    const user = userEvent.setup();
    renderWithProviders();

    // Open popover
    const button = screen.getByRole("button", { name: /configurar colunas/i });
    await user.click(button);

    expect(screen.getByText("Configurar Colunas")).toBeInTheDocument();

    // Click save
    const saveButton = screen.getByRole("button", { name: /salvar/i });
    await user.click(saveButton);

    // Wait for popover to close
    await waitFor(() => {
      expect(screen.queryByText("Configurar Colunas")).not.toBeInTheDocument();
    });
  });

  it("should handle keyboard navigation", async () => {
    const user = userEvent.setup();
    renderWithProviders();

    const button = screen.getByRole("button", { name: /configurar colunas/i });

    // Should open with Enter key
    await user.type(button, "{Enter}");
    expect(screen.getByText("Configurar Colunas")).toBeInTheDocument();
  });

  it("should display correct visible column count in button", () => {
    // Mock localStorage with some settings
    localStorageMock.getItem.mockReturnValue(
      JSON.stringify({
        order: ["name", "email"],
        visibility: { name: true, email: false, phone: false, status: true },
        updatedAt: "2024-01-01T00:00:00.000Z",
      }),
    );

    renderWithProviders();

    // Should show (2/4) - only name and status are visible
    const button = screen.getByRole("button", { name: /configurar colunas/i });
    expect(button).toHaveTextContent("(2/4)");
  });
});
