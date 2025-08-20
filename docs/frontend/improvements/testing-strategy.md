# 🧪 Estratégia de Testes para Sistema de Filtros

## 1. Testes de Integração
```typescript
// src/features/comunicacoes/components/__tests__/ComunicacoesPage.integration.test.tsx
describe('ComunicacoesPage Integration', () => {
  it('should filter comunicacoes by type', async () => {
    const mockData = createMockComunicacoes(10);
    render(<ComunicacoesPage />, { 
      wrapper: ({ children }) => (
        <QueryClient>
          <MockProvider data={mockData}>
            {children}
          </MockProvider>
        </QueryClient>
      )
    });
    
    // Open type filter
    await user.click(screen.getByRole('button', { name: /tipo/i }));
    
    // Select "Comunicado"
    await user.click(screen.getByRole('option', { name: /comunicado/i }));
    
    // Verify filtered results
    expect(screen.getByText(/filtrado para \d+ de \d+ resultados/i)).toBeInTheDocument();
    
    // Verify only comunicados are shown
    const comunicados = screen.getAllByRole('row');
    comunicados.forEach(row => {
      expect(row).toHaveTextContent('Comunicado');
    });
  });
});
```

## 2. Testes de Performance
```typescript
// src/shared/components/filters/__tests__/Filter.performance.test.tsx
describe('Filter Performance', () => {
  it('should handle large datasets efficiently', async () => {
    const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      title: `Item ${i}`,
      type: i % 3 === 0 ? 'Type A' : 'Type B'
    }));
    
    const startTime = performance.now();
    
    render(<Filter options={largeDataset} />);
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Should render in less than 100ms
    expect(renderTime).toBeLessThan(100);
  });
  
  it('should debounce search input', async () => {
    const mockOnChange = vi.fn();
    render(<TextFilter onChange={mockOnChange} />);
    
    const input = screen.getByRole('textbox');
    
    // Type rapidly
    await user.type(input, 'test search');
    
    // Should not call onChange for each keystroke
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('test search');
  });
});
```

## 3. Testes de Acessibilidade
```typescript
// src/shared/components/filters/__tests__/Filter.a11y.test.tsx
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Filter Accessibility', () => {
  it('should meet WCAG guidelines', async () => {
    const { container } = render(<Filter options={mockOptions} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('should support keyboard navigation', async () => {
    render(<Filter options={mockOptions} />);
    
    const trigger = screen.getByRole('button');
    trigger.focus();
    
    // Open with keyboard
    await user.keyboard('{Enter}');
    expect(screen.getByRole('listbox')).toBeVisible();
    
    // Navigate with arrows
    await user.keyboard('{ArrowDown}');
    expect(screen.getAllByRole('option')[0]).toHaveFocus();
    
    // Select with keyboard
    await user.keyboard('{Enter}');
    expect(mockOnChange).toHaveBeenCalled();
  });
  
  it('should announce filter changes to screen readers', async () => {
    render(<FilterWithAnnouncements />);
    
    // Apply filter
    await user.click(screen.getByRole('option', { name: 'Type A' }));
    
    // Check announcement
    expect(screen.getByRole('status')).toHaveTextContent(
      /filtrado para \d+ resultados/i
    );
  });
});
```

## 4. Testes E2E com Playwright
```typescript
// tests/e2e/filters.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Filter System E2E', () => {
  test('should persist filters in URL', async ({ page }) => {
    await page.goto('/comunicacoes');
    
    // Apply search filter
    await page.fill('[placeholder*="Buscar"]', 'test');
    
    // Apply type filter
    await page.click('button:has-text("Tipo")');
    await page.click('text=Comunicado');
    
    // Check URL contains filter parameters
    expect(page.url()).toContain('search=test');
    expect(page.url()).toContain('tipo=Comunicado');
    
    // Refresh page
    await page.reload();
    
    // Verify filters are restored
    expect(await page.inputValue('[placeholder*="Buscar"]')).toBe('test');
    expect(await page.textContent('button:has-text("Tipo")')).toContain('Comunicado');
  });
  
  test('should handle filter combinations correctly', async ({ page }) => {
    await page.goto('/comunicacoes');
    
    // Apply multiple filters
    await page.fill('[placeholder*="Buscar"]', 'important');
    await page.click('button:has-text("Tipo")');
    await page.click('text=Comunicado');
    await page.click('button:has-text("Autor")');
    await page.click('text=Admin');
    
    // Verify results are filtered correctly
    const results = await page.locator('[data-testid="comunicacao-item"]').all();
    
    for (const result of results) {
      const text = await result.textContent();
      expect(text).toContain('important');
      expect(text).toContain('Comunicado');
      expect(text).toContain('Admin');
    }
  });
});
```
