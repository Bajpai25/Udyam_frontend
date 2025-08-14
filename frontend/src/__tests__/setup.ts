import "@testing-library/jest-dom"
import { cleanup } from "@testing-library/react"
import { afterEach, beforeAll } from "vitest"

// Mock API base URL
beforeAll(() => {
  process.env.VITE_API_BASE_URL = "http://localhost:3001"
})

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}
