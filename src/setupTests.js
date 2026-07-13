import '@testing-library/jest-dom'

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {}
  },
  writable: true
})

// You can start MSW here for integration tests if needed.
// Example (optional):
// import { server } from './mocks/server'
// beforeAll(() => server.listen())
// afterEach(() => server.resetHandlers())
// afterAll(() => server.close())
