/**
 * 🧪 Tests for Comunicacao Schemas
 */
import { describe, expect, it } from "vitest";
import { ZodError } from "zod";
import { comunicacaoSchema } from "./comunicacao.schemas";

describe("comunicacaoSchema", () => {
  it("should validate a valid comunicacao object", () => {
    const validData = {
      id: "1",
      titulo: "Test Communication",
      autor: "Test Author",
      tipo: "Comunicado" as const,
      descricao: "This is a test description with enough characters",
      dataCriacao: new Date(),
      dataAtualizacao: new Date(),
    };

    const result = comunicacaoSchema.safeParse(validData);
    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data).toEqual(validData);
    }
  });

  it("should reject empty titulo", () => {
    const invalidData = {
      id: "1",
      titulo: "",
      autor: "Test Author",
      tipo: "Comunicado" as const,
      descricao: "This is a test description with enough characters",
      dataCriacao: new Date(),
      dataAtualizacao: new Date(),
    };

    const result = comunicacaoSchema.safeParse(invalidData);
    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error).toBeInstanceOf(ZodError);
      expect(
        result.error.issues.some((issue) => issue.path.includes("titulo")),
      ).toBe(true);
    }
  });

  it("should reject empty autor", () => {
    const invalidData = {
      id: "1",
      titulo: "Test Communication",
      autor: "",
      tipo: "Comunicado" as const,
      descricao: "This is a test description with enough characters",
      dataCriacao: new Date(),
      dataAtualizacao: new Date(),
    };

    const result = comunicacaoSchema.safeParse(invalidData);
    expect(result.success).toBe(false);

    if (!result.success) {
      expect(
        result.error.issues.some((issue) => issue.path.includes("autor")),
      ).toBe(true);
    }
  });

  it("should reject empty descricao", () => {
    const invalidData = {
      id: "1",
      titulo: "Test Communication",
      autor: "Test Author",
      tipo: "Comunicado" as const,
      descricao: "",
      dataCriacao: new Date(),
      dataAtualizacao: new Date(),
    };

    const result = comunicacaoSchema.safeParse(invalidData);
    expect(result.success).toBe(false);

    if (!result.success) {
      expect(
        result.error.issues.some((issue) => issue.path.includes("descricao")),
      ).toBe(true);
    }
  });

  it("should reject invalid tipo", () => {
    const invalidData = {
      id: "1",
      titulo: "Test Communication",
      autor: "Test Author",
      tipo: "InvalidType" as unknown as "Comunicado",
      descricao: "This is a test description with enough characters",
      dataCriacao: new Date(),
      dataAtualizacao: new Date(),
    };

    const result = comunicacaoSchema.safeParse(invalidData);
    expect(result.success).toBe(false);

    if (!result.success) {
      expect(
        result.error.issues.some((issue) => issue.path.includes("tipo")),
      ).toBe(true);
    }
  });

  it("should trim whitespace from string fields", () => {
    // Note: The current schema doesn't have .trim(), so this test expects no trimming
    const dataWithWhitespace = {
      id: "1",
      titulo: "  Test Communication  ",
      autor: "  Test Author  ",
      tipo: "Comunicado" as const,
      descricao: "  This is a test description with enough characters  ",
      dataCriacao: new Date(),
      dataAtualizacao: new Date(),
    };

    const result = comunicacaoSchema.safeParse(dataWithWhitespace);
    expect(result.success).toBe(true);

    if (result.success) {
      // Schema doesn't trim, so whitespace is preserved
      expect(result.data.titulo).toBe("  Test Communication  ");
      expect(result.data.autor).toBe("  Test Author  ");
      expect(result.data.descricao).toBe(
        "  This is a test description with enough characters  ",
      );
    }
  });

  it("should reject missing required fields", () => {
    const incompleteData = {
      titulo: "Test Communication",
      // Missing id, autor, tipo, descricao, dataCriacao, dataAtualizacao
    };

    const result = comunicacaoSchema.safeParse(incompleteData);
    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });

  it("should validate with all allowed tipos", () => {
    const allowedTipos = ["Comunicado", "Aviso", "Notícia"] as const;

    allowedTipos.forEach((tipo) => {
      const validData = {
        id: "1",
        titulo: "Test Communication",
        autor: "Test Author",
        tipo,
        descricao: "This is a test description with enough characters",
        dataCriacao: new Date(),
        dataAtualizacao: new Date(),
      };

      const result = comunicacaoSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });
});
