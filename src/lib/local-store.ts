"use client";

export type LocalStore<T> = {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => T | null;
  getServerSnapshot: () => null;
  set: (value: T) => void;
  clear: () => void;
};

/**
 * A localStorage-backed store shaped for useSyncExternalStore.
 *
 * The subtle part is `getSnapshot`: React calls it on every render and bails
 * out only if the result is referentially equal, so the parsed value is cached
 * and rebuilt only when the underlying raw string actually changes.
 */
export function createLocalStore<T>(
  key: string,
  parse: (value: unknown) => T | null,
): LocalStore<T> {
  const listeners = new Set<() => void>();
  let cachedRaw: string | null = null;
  let cached: T | null = null;

  const read = (): string | null => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  };

  const emit = () => {
    for (const listener of listeners) listener();
  };

  return {
    subscribe(listener) {
      listeners.add(listener);
      // Keeps other tabs in sync when this key is written elsewhere.
      window.addEventListener("storage", listener);
      return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", listener);
      };
    },

    getSnapshot() {
      if (typeof window === "undefined") return null;
      const raw = read();
      if (raw !== cachedRaw) {
        cachedRaw = raw;
        if (raw === null) {
          cached = null;
        } else {
          try {
            cached = parse(JSON.parse(raw));
          } catch {
            cached = null;
          }
        }
      }
      return cached;
    },

    getServerSnapshot() {
      return null;
    },

    set(value) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // Private-mode quota failures shouldn't break the flow in progress.
      }
      emit();
    },

    clear() {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // Already unreachable — nothing to do.
      }
      emit();
    },
  };
}
