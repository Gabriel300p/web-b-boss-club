import "@testing-library/jest-dom";

// Mock para crypto.randomUUID() que não está disponível no jsdom
Object.defineProperty(globalThis, "crypto", {
  value: {
    randomUUID: () => Math.random().toString(36).substr(2, 9),
  },
});

// Mock para matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});
