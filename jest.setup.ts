import "@testing-library/jest-dom";
import { installMatchMedia } from "./test-utils/match-media";

installMatchMedia();

class IntersectionObserverStub {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds = [];
  constructor(private callback: IntersectionObserverCallback) {}
  observe(target: Element) {
    this.callback([{ isIntersecting: true, target } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
  }
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(window, "IntersectionObserver", { writable: true, value: IntersectionObserverStub });
Object.defineProperty(window, "ResizeObserver", { writable: true, value: ResizeObserverStub });
Object.defineProperty(window, "scrollTo", { writable: true, value: jest.fn() });
