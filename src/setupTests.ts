// Jest setup file
import '@testing-library/jest-dom';

/**
 * JSDOM (used by Jest) does not implement ResizeObserver yet.
 * Provide a minimal mock so components relying on Radix hooks
 * can mount without throwing.
 */
const mockResizeObserver = class {
    observe() {
        // noop
    }
    unobserve() {
        // noop
    }
    disconnect() {
        // noop
    }
};

if (typeof window !== 'undefined') {
    (window as any).ResizeObserver = mockResizeObserver;
}

(global as any).ResizeObserver = mockResizeObserver;
