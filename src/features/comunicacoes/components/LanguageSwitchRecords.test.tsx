/**
 * 🧪 Integration test: switching language updates table headers (records namespace)
 */
import { setLocale } from "@/app/i18n/init";
import { mockComunicacoes } from "@/test/utils/test-utils";
import { render, screen, waitFor, within } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it } from "vitest";
import { DataTable } from "./table/DataTable";
import { createColumns } from "./table/columns";

// Helper to render with initial locale
function setup(lang: "pt-BR" | "en-US") {
  act(() => {
    setLocale(lang);
  });
  const data = mockComunicacoes(1);
  const columns = createColumns({ onEdit: () => {}, onDelete: () => {} });
  return render(<DataTable data={data} columns={columns} />);
}

describe("Language switch (records namespace)", () => {
  it("renders Portuguese headers then switches to English", async () => {
    const utils = setup("pt-BR");

    // Initial PT labels
    expect(screen.getByText(/Título/)).toBeInTheDocument();
    expect(screen.getByText(/Autor/)).toBeInTheDocument();

    // Switch to English
    await act(async () => {
      setLocale("en-US");
    });
    // Force a re-render to pick up changed i18n language in this simplified test scenario
    utils.rerender(
      <DataTable
        data={mockComunicacoes(1)}
        columns={createColumns({ onEdit: () => {}, onDelete: () => {} })}
      />,
    );

    await waitFor(
      () => {
        const headers = screen.getAllByRole("columnheader");
        const titleHeader = headers.find((h) => within(h).queryByText("Title"));
        const authorHeader = headers.find((h) =>
          within(h).queryByText("Author"),
        );
        expect(titleHeader).toBeTruthy();
        expect(authorHeader).toBeTruthy();
      },
      { timeout: 1500 },
    );
  });
});
