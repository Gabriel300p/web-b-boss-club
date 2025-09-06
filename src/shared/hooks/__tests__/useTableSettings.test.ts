/**
 * 🧪 useTableSettings Hook Tests
 * Unit tests for table settings hook functionality
 */

import { act, renderHook } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";

import { useTableSettings } from "@shared/hooks/useTableSettings";
import type { TableColumn } from "@shared/types/table.types";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

const mockColumns: TableColumn[] = [
  { id: "name", label: "Nome", defaultVisible: true },
  { id: "email", label: "Email", defaultVisible: true },
  { id: "phone", label: "Telefone", defaultVisible: false },
  { id: "status", label: "Status" }, // No defaultVisible
  { id: "created", label: "Criado em" }, // No defaultVisible
  { id: "updated", label: "Atualizado", fixed: true },
];

describe("useTableSettings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it("should initialize with default settings when no localStorage data exists", () => {
    const { result } = renderHook(() =>
      useTableSettings("test-table", mockColumns),
    );

    expect(result.current.settings.order).toEqual([
      "name",
      "email",
      "phone",
      "status",
      "created",
      "updated",
    ]);

    // Should use defaultVisible when provided, otherwise first 5 columns
    expect(result.current.settings.visibility).toEqual({
      name: true, // defaultVisible: true
      email: true, // defaultVisible: true
      phone: false, // defaultVisible: false
      status: true, // no defaultVisible, index < 5
      created: true, // no defaultVisible, index < 5
      updated: false, // no defaultVisible, index >= 5
    });
  });

  it("should load and merge settings from localStorage", () => {
    const storedSettings = {
      order: ["email", "name", "status"],
      visibility: { name: false, email: true, status: true },
      updatedAt: "2024-01-01T00:00:00.000Z",
    };

    localStorageMock.getItem.mockReturnValue(JSON.stringify(storedSettings));

    const { result } = renderHook(() =>
      useTableSettings("test-table", mockColumns),
    );

    // Should merge stored order with new columns
    expect(result.current.settings.order).toEqual([
      "email",
      "name",
      "status",
      "phone", // new column added at end
      "created", // new column added at end
      "updated", // new column added at end
    ]);

    // Should merge stored visibility with defaults for new columns
    expect(result.current.settings.visibility).toEqual({
      name: false, // from stored
      email: true, // from stored
      phone: false, // defaultVisible: false
      status: true, // from stored
      created: true, // default (index < 5)
      updated: false, // default (index >= 5)
    });
  });

  it("should handle corrupted localStorage data gracefully", () => {
    localStorageMock.getItem.mockReturnValue("invalid-json");

    const { result } = renderHook(() =>
      useTableSettings("test-table", mockColumns),
    );

    // Should fall back to defaults
    expect(result.current.settings.order).toHaveLength(6);
    expect(result.current.appliedColumns).toHaveLength(6);
  });

  it("should update settings correctly", () => {
    const { result } = renderHook(() =>
      useTableSettings("test-table", mockColumns),
    );

    act(() => {
      result.current.updateSettings({
        visibility: { name: false, email: true },
      });
    });

    expect(result.current.settings.visibility.name).toBe(false);
    expect(result.current.settings.visibility.email).toBe(true);
  });

  it("should reset settings to defaults", () => {
    const storedSettings = {
      order: ["email", "name"],
      visibility: { name: false, email: true },
      updatedAt: "2024-01-01T00:00:00.000Z",
    };

    localStorageMock.getItem.mockReturnValue(JSON.stringify(storedSettings));

    const { result } = renderHook(() =>
      useTableSettings("test-table", mockColumns),
    );

    act(() => {
      result.current.resetSettings();
    });

    // Should reset to defaults
    expect(result.current.settings.order).toEqual([
      "name",
      "email",
      "phone",
      "status",
      "created",
      "updated",
    ]);

    expect(localStorageMock.removeItem).toHaveBeenCalledWith(
      "table-settings:test-table",
    );
  });

  it("should save settings to localStorage", () => {
    const { result } = renderHook(() =>
      useTableSettings("test-table", mockColumns),
    );

    act(() => {
      result.current.updateSettings({
        order: ["email", "name"],
      });
    });

    act(() => {
      result.current.saveSettings();
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "table-settings:test-table",
      expect.stringContaining('"order":["email","name"]'),
    );
  });

  it("should apply column order correctly", () => {
    const { result } = renderHook(() =>
      useTableSettings("test-table", mockColumns),
    );

    act(() => {
      result.current.updateSettings({
        order: ["status", "name", "email"],
      });
    });

    const appliedOrder = result.current.appliedColumns.map((col) => col.id);
    expect(appliedOrder).toEqual([
      "status",
      "name",
      "email",
      "phone", // remaining columns
      "created",
      "updated",
    ]);
  });

  it("should handle localStorage save errors gracefully", () => {
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error("Storage quota exceeded");
    });

    const { result } = renderHook(() =>
      useTableSettings("test-table", mockColumns),
    );

    act(() => {
      result.current.saveSettings();
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to save table settings:",
      expect.any(Error),
    );

    consoleSpy.mockRestore();
  });
});
