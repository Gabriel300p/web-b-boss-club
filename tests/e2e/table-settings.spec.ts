/**
 * 🎭 TableSettings E2E Tests
 * End-to-end tests for table settings functionality using Playwright
 */

import { test, expect } from "@playwright/test";

test.describe("TableSettings Component", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a page with TableSettings (adjust URL as needed)
    await page.goto("/users"); // or whatever page has the table
    
    // Wait for page to load
    await page.waitForLoadState("networkidle");
  });

  test("should open table settings popover", async ({ page }) => {
    // Find and click the settings button
    const settingsButton = page.getByRole("button", { name: /configurar colunas/i });
    await expect(settingsButton).toBeVisible();
    
    await settingsButton.click();
    
    // Check if popover opened
    await expect(page.getByText("Configurar Colunas")).toBeVisible();
    await expect(page.getByPlaceholder("Buscar colunas...")).toBeVisible();
  });

  test("should filter columns with search", async ({ page }) => {
    // Open settings
    await page.getByRole("button", { name: /configurar colunas/i }).click();
    
    // Type in search
    const searchInput = page.getByPlaceholder("Buscar colunas...");
    await searchInput.fill("email");
    
    // Should show only email column
    await expect(page.getByText("Email")).toBeVisible();
    
    // Other columns should not be visible (adjust based on your columns)
    await expect(page.getByText("Nome")).not.toBeVisible();
  });

  test("should toggle column visibility", async ({ page }) => {
    // Open settings
    await page.getByRole("button", { name: /configurar colunas/i }).click();
    
    // Find a checkbox and toggle it
    const phoneCheckbox = page.getByRole("checkbox").filter({ hasText: /telefone/i });
    await phoneCheckbox.click();
    
    // Save settings
    await page.getByRole("button", { name: /salvar/i }).click();
    
    // Verify popover closed
    await expect(page.getByText("Configurar Colunas")).not.toBeVisible();
    
    // Check if localStorage was updated
    const localStorage = await page.evaluate(() => 
      Object.keys(window.localStorage).filter(key => key.startsWith("table-settings"))
    );
    expect(localStorage.length).toBeGreaterThan(0);
  });

  test("should persist settings after page reload", async ({ page }) => {
    // Open settings and make changes
    await page.getByRole("button", { name: /configurar colunas/i }).click();
    
    // Toggle a column
    const checkbox = page.getByRole("checkbox").first();
    const isChecked = await checkbox.isChecked();
    await checkbox.click();
    
    // Save
    await page.getByRole("button", { name: /salvar/i }).click();
    
    // Reload page
    await page.reload();
    await page.waitForLoadState("networkidle");
    
    // Open settings again
    await page.getByRole("button", { name: /configurar colunas/i }).click();
    
    // Verify the setting persisted
    const checkboxAfterReload = page.getByRole("checkbox").first();
    await expect(checkboxAfterReload).toHaveAttribute("aria-checked", String(!isChecked));
  });

  test("should reset settings to default", async ({ page }) => {
    // Open settings
    await page.getByRole("button", { name: /configurar colunas/i }).click();
    
    // Make some changes first
    const checkbox = page.getByRole("checkbox").first();
    await checkbox.click();
    
    // Reset settings
    await page.getByRole("button", { name: /reset/i }).click();
    
    // Should show success toast
    await expect(page.getByText(/configurações resetadas/i)).toBeVisible();
    
    // Verify localStorage was cleared
    const hasSettings = await page.evaluate(() => {
      const keys = Object.keys(window.localStorage);
      return keys.some(key => key.startsWith("table-settings"));
    });
    expect(hasSettings).toBeFalsy();
  });

  test("should support keyboard navigation", async ({ page }) => {
    // Focus the settings button with keyboard
    await page.keyboard.press("Tab");
    
    // Open with Enter
    await page.keyboard.press("Enter");
    
    // Should open popover
    await expect(page.getByText("Configurar Colunas")).toBeVisible();
    
    // Navigate within popover with Tab
    await page.keyboard.press("Tab");
    
    // Close with Escape
    await page.keyboard.press("Escape");
    
    // Should close popover
    await expect(page.getByText("Configurar Colunas")).not.toBeVisible();
  });

  test("should show correct column count in button", async ({ page }) => {
    const settingsButton = page.getByRole("button", { name: /configurar colunas/i });
    
    // Should show column count (adjust based on your default columns)
    await expect(settingsButton).toContainText(/\(\d+\/\d+\)/);
  });

  test("should handle fixed columns correctly", async ({ page }) => {
    // Open settings
    await page.getByRole("button", { name: /configurar colunas/i }).click();
    
    // Look for a fixed column (like "Ações")
    const fixedColumn = page.locator('[data-testid="sortable-item"]').filter({
      hasText: /ações/i
    });
    
    if (await fixedColumn.count() > 0) {
      // Fixed column checkbox should be disabled
      const checkbox = fixedColumn.getByRole("checkbox");
      await expect(checkbox).toBeDisabled();
      
      // Should show lock icon
      await expect(fixedColumn.locator('[data-testid="lock-icon"]')).toBeVisible();
    }
  });

  test("should validate drag and drop interaction", async ({ page }) => {
    // Open settings
    await page.getByRole("button", { name: /configurar colunas/i }).click();
    
    // Get first two sortable items
    const items = page.locator('[data-testid="sortable-item"]');
    const firstItem = items.first();
    const secondItem = items.nth(1);
    
    if (await items.count() >= 2) {
      const firstText = await firstItem.textContent();
      const secondText = await secondItem.textContent();
      
      // Get drag handle of first item
      const dragHandle = firstItem.locator('[aria-label*="arrastar"]').first();
      
      // Perform drag and drop (simplified - actual implementation depends on your drag library)
      await dragHandle.hover();
      await page.mouse.down();
      await secondItem.hover();
      await page.mouse.up();
      
      // Save settings
      await page.getByRole("button", { name: /salvar/i }).click();
      
      // Reopen and verify order changed
      await page.getByRole("button", { name: /configurar colunas/i }).click();
      
      const firstItemAfter = items.first();
      const firstTextAfter = await firstItemAfter.textContent();
      
      // Order should have changed
      expect(firstTextAfter).not.toBe(firstText);
    }
  });

  test("should show toast notifications", async ({ page }) => {
    // Open settings
    await page.getByRole("button", { name: /configurar colunas/i }).click();
    
    // Save settings
    await page.getByRole("button", { name: /salvar/i }).click();
    
    // Should show success toast
    await expect(page.getByText(/configurações salvas/i)).toBeVisible();
    
    // Toast should disappear after timeout
    await expect(page.getByText(/configurações salvas/i)).not.toBeVisible({ 
      timeout: 5000 
    });
  });

  test("should be responsive on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Settings button should still be visible and clickable
    const settingsButton = page.getByRole("button", { name: /configurar colunas/i });
    await expect(settingsButton).toBeVisible();
    
    await settingsButton.click();
    
    // Popover should adapt to mobile screen
    const popover = page.locator('[role="dialog"]');
    await expect(popover).toBeVisible();
    
    // Should still be functional
    await expect(page.getByPlaceholder("Buscar colunas...")).toBeVisible();
  });
});

test.describe("TableSettings Integration", () => {
  test("should integrate with existing table filters", async ({ page }) => {
    await page.goto("/users");
    
    // Should appear alongside other filters
    const filtersContainer = page.locator(".filters-container, [data-testid='filters']").first();
    
    if (await filtersContainer.count() > 0) {
      await expect(filtersContainer.getByRole("button", { name: /configurar colunas/i }))
        .toBeVisible();
    }
  });

  test("should update table when settings change", async ({ page }) => {
    await page.goto("/users");
    
    // Count visible columns before
    const columnsBefore = await page.locator("table th").count();
    
    // Open settings and hide a column
    await page.getByRole("button", { name: /configurar colunas/i }).click();
    
    // Find a visible checkbox and uncheck it
    const checkboxes = page.getByRole("checkbox");
    const visibleCheckbox = checkboxes.filter({ hasAttribute: "checked" }).first();
    
    if (await visibleCheckbox.count() > 0) {
      await visibleCheckbox.click();
      await page.getByRole("button", { name: /salvar/i }).click();
      
      // Table should have fewer columns
      const columnsAfter = await page.locator("table th").count();
      expect(columnsAfter).toBeLessThan(columnsBefore);
    }
  });
});
