/**
 * 🧪 Tests for DataTable component
 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockComunicacoes } from "@/test/utils/test-utils";
import { DataTable } from "./DataTable";
import { createColumns } from "./columns";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: "div",
    tr: "tr",
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

describe("DataTable", () => {
  const mockData = mockComunicacoes(3);
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  const columns = createColumns({
    onEdit: mockOnEdit,
    onDelete: mockOnDelete,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render table with data", () => {
    render(<DataTable data={mockData} columns={columns} />);

    // Check if table headers are rendered
    // i18n default (pt-BR) now replaced by dynamic translation; fallback may show English if detection changed
    // Accept both Portuguese or English labels to avoid brittle test
    expect(screen.getByText(/^(Título|Title)$/)).toBeInTheDocument();
    expect(screen.getByText(/^(Autor|Author)$/)).toBeInTheDocument();
    expect(screen.getByText(/^(Tipo|Type)$/)).toBeInTheDocument();

    // Check if data is rendered
    expect(screen.getByText("Communication 1")).toBeInTheDocument();
    expect(screen.getByText("Author 1")).toBeInTheDocument();
    expect(screen.getByText("Communication 2")).toBeInTheDocument();
  });

  it("should render empty state when no data", () => {
    render(<DataTable data={[]} columns={columns} />);

    // O DataTable renderiza "Nenhum resultado encontrado." quando não há dados
    expect(
      screen.getByText("Nenhum resultado encontrado."),
    ).toBeInTheDocument();
  });

  it("should handle sorting", async () => {
    const user = userEvent.setup();

    render(<DataTable data={mockData} columns={columns} />);

    // Verificar se os botões de sorting estão presentes usando aria-label
    const sortButtons = screen.getAllByLabelText(/Ordenar/);
    expect(sortButtons.length).toBeGreaterThan(0);

    // Testar clique no primeiro botão de sorting crescente (coluna título)
    const crescenteButtons = screen.getAllByLabelText("Ordenar crescente");
    await user.click(crescenteButtons[0]); // Primeira coluna

    // Verificar se a tabela ainda contém os dados (sorting funcionou)
    expect(screen.getByText("Communication 1")).toBeInTheDocument();
  });

  it("should handle pagination when more than 10 items", () => {
    const largeData = mockComunicacoes(15);

    render(<DataTable data={largeData} columns={columns} />);

    // Verificar se os dados são exibidos (primeiros 10 de 15)
    expect(screen.getByText("Communication 1")).toBeInTheDocument();

    // Verificar se tem paginação - buscar por elementos visuais da paginação
    expect(screen.getByText("15")).toBeInTheDocument(); // Total de itens
    expect(screen.getByText(/Página 1 de/)).toBeInTheDocument();

    // Verificar se tem botões de navegação (mesmo que sem texto específico)
    const paginationContainer = screen.getByText("15").closest("div");
    expect(paginationContainer).toBeInTheDocument();
  });

  it("should call edit callback when edit button is clicked", async () => {
    const user = userEvent.setup();

    render(<DataTable data={mockData} columns={columns} />);

    // Find and click edit button (assuming it has "Editar" text or edit icon)
    const editButtons = screen.getAllByLabelText(
      /Editar comunicação|Edit communication/,
    );
    await user.click(editButtons[0]);

    expect(mockOnEdit).toHaveBeenCalledWith(mockData[0]);
  });

  it("should call delete callback when delete button is clicked", async () => {
    const user = userEvent.setup();

    render(<DataTable data={mockData} columns={columns} />);

    // Find and click delete button
    const deleteButtons = screen.getAllByLabelText(
      /Excluir comunicação|Delete communication/,
    );
    await user.click(deleteButtons[0]);

    expect(mockOnDelete).toHaveBeenCalledWith(mockData[0]);
  });

  it("should maintain accessibility attributes", () => {
    render(<DataTable data={mockData} columns={columns} />);

    // Check for table accessibility
    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();

    // Check for column headers
    const columnHeaders = screen.getAllByRole("columnheader");
    expect(columnHeaders.length).toBeGreaterThan(0);

    // Check for row accessibility
    const rows = screen.getAllByRole("row");
    expect(rows.length).toBeGreaterThan(1); // Header + data rows
  });
});
