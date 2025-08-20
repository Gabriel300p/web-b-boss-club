/**
 * 🧪 Test Utils for Toast System
 * Utilities and mocks for testing toast functionality
 */
import { act, render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { vi, beforeEach } from 'vitest';
import { TestToastProvider } from './toast-test-utils';

// Mock toast functions for testing
export const mockToastFunctions = {
  success: vi.fn(),
  error: vi.fn(), 
  warning: vi.fn(),
  info: vi.fn(),
  showToast: vi.fn(),
  removeToast: vi.fn(),
  clearToasts: vi.fn(),
  toasts: [],
};

// Reset all mock functions
export const resetToastMocks = () => {
  Object.values(mockToastFunctions).forEach(fn => {
    if (typeof fn === 'function') {
      fn.mockClear();
    }
  });
};

// Helper to render components with toast provider and handle act warnings
export const renderWithToast = (component: ReactElement) => {
  let renderResult: ReturnType<typeof render>;
  
  act(() => {
    renderResult = render(
      <TestToastProvider>
        {component}
      </TestToastProvider>
    );
  });
  
  return renderResult!;
};

// Helper to simulate toast actions in tests with proper act wrapping
export const simulateToastAction = (action: () => void) => {
  act(() => {
    action();
  });
};

// Mock implementation for useToast hook in tests
export const mockUseToast = () => ({
  ...mockToastFunctions,
});

// Setup function to be used in test files
export const setupToastTests = () => {
  beforeEach(() => {
    resetToastMocks();
  });
  
  // Mock the useToast hook
  vi.mock('@shared/hooks/useToast', () => ({
    useToast: mockUseToast,
  }));
};
