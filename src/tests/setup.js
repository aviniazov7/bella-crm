import '@testing-library/jest-dom'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// Ensure the DOM is reset between tests
afterEach(() => {
  cleanup()
})

// react-big-calendar's drag selection calls these jsdom-missing APIs.
if (!document.elementFromPoint) {
  document.elementFromPoint = () => null
}
if (!Range.prototype.getBoundingClientRect) {
  Range.prototype.getBoundingClientRect = () => ({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
  })
}

// jsdom does not implement matchMedia — stub it for components that read it
window.matchMedia =
  window.matchMedia ||
  function matchMedia() {
    return {
      matches: false,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }
  }
