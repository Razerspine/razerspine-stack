export type Theme = 'dark' | 'light';
export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem?(key: string): void;
}

export interface ThemeServiceOptions {
  storageKey?: string;
  storage?: StorageLike | null;
  autoApply?: boolean;
  dataAttribute?: string;
  fallback?: Theme;
}

interface ApplyOptions {
  persist?: boolean;
  notify?: boolean;
  applyToDom?: boolean;
}

export default class ThemeService {
  private storageKey: string;
  private storage: StorageLike | null;
  private autoApply: boolean;
  private dataAttribute: string;
  private fallback: Theme;
  private current: Theme | null = null;
  private _listeners: Set<(theme: Theme) => void> = new Set();

  constructor(options: ThemeServiceOptions = {}) {
    const {
      storageKey = 'theme',
      storage = typeof localStorage !== 'undefined'
        ? (localStorage as StorageLike)
        : null,
      autoApply = true,
      dataAttribute = 'data-theme',
      fallback = 'light',
    } = options;

    this.storageKey = storageKey;
    this.storage = storage;
    this.autoApply = Boolean(autoApply);
    this.dataAttribute = dataAttribute;
    this.fallback = fallback === 'dark' ? 'dark' : 'light';
  }

  /**
   * Initialize service: determine and apply initial theme.
   */
  public init(): void {
    const initial =
      this._getStoredTheme() || this._detectSystemTheme() || this.fallback;
    this._apply(initial, {
      persist: false,
      notify: true,
      applyToDom: this.autoApply,
    });
  }

  /**
   * Get current theme
   */
  public getTheme(): Theme | null {
    return this.current;
  }

  /**
   * Set theme programmatically
   */
  public setTheme(theme: Theme): void {
    if (theme !== 'dark' && theme !== 'light') return;
    this._apply(theme, {
      persist: true,
      notify: true,
      applyToDom: this.autoApply,
    });
  }

  /**
   * Subscribe to theme changes. Returns unsubscribe function.
   */
  public onChange(cb: (theme: Theme) => void): () => void {
    if (typeof cb !== 'function') return () => {};
    this._listeners.add(cb);
    return () => this._listeners.delete(cb);
  }

  /**
   * Remove all listeners and reset state
   */
  public destroy(): void {
    this._listeners.clear();
    this.current = null;
  }

  /**
   * Internal: apply theme to state, persist, notify and optionally apply to DOM
   */
  private _apply(
    theme: Theme,
    { persist = true, notify = true, applyToDom = true }: ApplyOptions = {},
  ): void {
    if (!theme || (theme !== 'dark' && theme !== 'light')) return;

    // update current
    this.current = theme;

    if (persist) this._saveTheme(theme);

    if (
      applyToDom &&
      typeof document !== 'undefined' &&
      document.documentElement
    ) {
      try {
        document.documentElement.setAttribute(this.dataAttribute, theme);
      } catch {
        // ignore DOM errors
      }
    }

    if (notify) {
      for (const cb of Array.from(this._listeners)) {
        try {
          cb(theme);
        } catch {
          // ignore listener errors
        }
      }
    }
  }

  /**
   * Read stored theme from storage safely
   */
  private _getStoredTheme(): Theme | null {
    if (!this.storage) return null;
    try {
      const v = this.storage.getItem(this.storageKey);
      return v === 'dark' || v === 'light' ? (v as Theme) : null;
    } catch {
      return null;
    }
  }

  /**
   * Persist theme to storage safely
   */
  private _saveTheme(theme: Theme): void {
    if (!this.storage) return;
    try {
      this.storage.setItem(this.storageKey, theme);
    } catch {
      // ignore storage errors
    }
  }

  /**
   * Detect system preference for dark mode
   */
  private _detectSystemTheme(): Theme | null {
    try {
      if (
        typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function'
      ) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
      }
    } catch {
      // ignore
    }
    return null;
  }
}
