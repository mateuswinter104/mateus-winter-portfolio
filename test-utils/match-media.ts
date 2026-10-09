type Listener = (event: MediaQueryListEvent) => void;

const matches = new Map<string, boolean>();
const listeners = new Map<string, Set<Listener>>();

function listenersFor(query: string) {
  if (!listeners.has(query)) listeners.set(query, new Set());
  return listeners.get(query)!;
}

export function installMatchMedia() {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      get matches() {
        return matches.get(query) ?? false;
      },
      media: query,
      onchange: null,
      addEventListener: (_type: string, listener: Listener) => listenersFor(query).add(listener),
      removeEventListener: (_type: string, listener: Listener) => listenersFor(query).delete(listener),
      addListener: (listener: Listener) => listenersFor(query).add(listener),
      removeListener: (listener: Listener) => listenersFor(query).delete(listener),
      dispatchEvent: () => true,
    }),
  });
}

export function setMediaQuery(query: string, value: boolean) {
  matches.set(query, value);
  listenersFor(query).forEach((listener) => listener({ matches: value, media: query } as MediaQueryListEvent));
}

export function resetMediaQueries() {
  matches.clear();
}
