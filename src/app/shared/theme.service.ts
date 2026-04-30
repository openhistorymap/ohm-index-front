import { DOCUMENT } from '@angular/common';
import { Injectable, computed, effect, inject, signal } from '@angular/core';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'ohm-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly systemPrefersDark = signal(this.readSystemPreference());
  private readonly preference = signal<ThemePreference>(this.readStoredPreference());

  readonly resolved = computed<ResolvedTheme>(() => {
    const pref = this.preference();
    if (pref === 'system') {
      return this.systemPrefersDark() ? 'dark' : 'light';
    }
    return pref;
  });

  readonly current = this.preference.asReadonly();

  constructor() {
    this.watchSystemPreference();
    effect(() => this.applyResolved(this.resolved(), this.preference()));
  }

  set(preference: ThemePreference) {
    this.preference.set(preference);
  }

  cycle() {
    const pref = this.preference();
    const next: ThemePreference = pref === 'system' ? 'light' : pref === 'light' ? 'dark' : 'system';
    this.preference.set(next);
  }

  private applyResolved(resolved: ResolvedTheme, preference: ThemePreference) {
    const root = this.document.documentElement;
    if (preference === 'system') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', preference);
    }
    root.style.colorScheme = resolved;
    try {
      if (preference === 'system') {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, preference);
      }
    } catch { /* private mode — silently ignore */ }
  }

  private readStoredPreference(): ThemePreference {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') return stored;
    } catch { /* ignore */ }
    return 'system';
  }

  private readSystemPreference(): boolean {
    const win = this.document.defaultView;
    return !!win?.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private watchSystemPreference() {
    const win = this.document.defaultView;
    if (!win?.matchMedia) return;
    const mq = win.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', e => this.systemPrefersDark.set(e.matches));
  }
}
