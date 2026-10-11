import { Injectable, effect, signal } from '@angular/core';

const SCALES = [0.875, 1, 1.125, 1.25];

/** Text-size and high-contrast preferences (remembered in the browser). */
@Injectable({ providedIn: 'root' })
export class A11yService {
  readonly scaleIndex = signal(this.read('ot-scale', 1));
  readonly highContrast = signal(this.read('ot-contrast', 0) === 1);

  constructor() {
    effect(() => {
      document.documentElement.style.fontSize = `${SCALES[this.scaleIndex()] * 100}%`;
      this.write('ot-scale', this.scaleIndex());
    });
    effect(() => {
      const on = this.highContrast();
      document.documentElement.setAttribute('data-theme', on ? 'hc' : 'default');
      this.write('ot-contrast', on ? 1 : 0);
    });
  }

  smaller(): void { this.scaleIndex.update((i) => Math.max(0, i - 1)); }
  normal(): void { this.scaleIndex.set(1); }
  larger(): void { this.scaleIndex.update((i) => Math.min(SCALES.length - 1, i + 1)); }
  toggleContrast(): void { this.highContrast.update((v) => !v); }

  private read(key: string, fallback: number): number {
    try {
      const v = Number(localStorage.getItem(key));
      return Number.isFinite(v) && localStorage.getItem(key) !== null ? v : fallback;
    } catch { return fallback; }
  }
  private write(key: string, v: number): void {
    try { localStorage.setItem(key, String(v)); } catch { /* ignore */ }
  }
}
