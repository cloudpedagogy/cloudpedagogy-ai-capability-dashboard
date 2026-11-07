import '@testing-library/jest-dom/vitest'
import React from 'react'
import { vi } from 'vitest'

// Mock ResizeObserver
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock ResponsiveContainer to provide concrete dimensions in jsdom
vi.mock('recharts', async (importOriginal) => {
  const original = await importOriginal<typeof import('recharts')>()
  return {
    ...original,
    ResponsiveContainer: ({ children }: { children?: React.ReactNode }) =>
      React.createElement('div', { style: { width: 800, height: 600 } }, children),
  }
})
