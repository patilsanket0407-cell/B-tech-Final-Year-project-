import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { OtReading, SENSORS, SensorDef, rangeText } from '../../models/ot.models';
import { I18nService } from '../../services/i18n.service';
import { OtApiService } from '../../services/ot-api.service';

const POLL_MS = 5000;
const HISTORY_LEN = 20;
const ARC_LENGTH = Math.PI * 80; // half circle, radius 80

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, OnDestroy {
  private api = inject(OtApiService);
  protected readonly i18n = inject(I18nService);
  private timer?: ReturnType<typeof setInterval>;

  protected readonly sensors = SENSORS;
  protected readonly rangeText = rangeText;
  protected readonly reading = signal<OtReading | null>(null);
  protected readonly failed = signal(false);
  protected readonly history = signal<number[]>([]);

  protected readonly isReady = computed(() => this.reading()?.OT_Status === 'Ready');
  protected readonly score = computed(() => this.reading()?.Readiness_Score ?? 0);

  protected readonly arcLength = ARC_LENGTH;
  protected readonly dashOffset = computed(() => ARC_LENGTH * (1 - this.score() / 100));
  protected readonly scoreClass = computed(() => {
    const s = this.score();
    return s >= 70 ? 'ok' : s >= 40 ? 'warn' : 'bad';
  });

  /** Trend chart geometry (SVG viewBox 0 0 400 130, plot area x 30..390, y 10..110). */
  protected readonly trend = computed(() => {
    const h = this.history();
    const pts = h.map((v, i) => ({
      x: 30 + (h.length < 2 ? 0 : (i / (HISTORY_LEN - 1)) * 360),
      y: 110 - (v / 100) * 100,
      v,
    }));
    return { pts, line: pts.map((p) => `${p.x},${p.y}`).join(' ') };
  });

  ngOnInit(): void {
    this.load();
    this.timer = setInterval(() => this.load(), POLL_MS);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  private load(): void {
    this.api.getLive().subscribe({
      next: (r) => {
        this.reading.set(r);
        this.failed.set(false);
        this.history.update((h) => [...h, r.Readiness_Score].slice(-HISTORY_LEN));
      },
      error: () => this.failed.set(true),
    });
  }

  protected valueOf(s: SensorDef): number | null {
    const r = this.reading();
    return r ? (r[s.key] as number) : null;
  }

  /** null = this parameter has no limit and is not scored. */
  protected inRange(s: SensorDef): boolean | null {
    if (s.min === undefined && s.max === undefined) return null;
    const v = this.valueOf(s);
    if (v === null) return null;
    return !((s.min !== undefined && v < s.min) || (s.max !== undefined && v > s.max));
  }

  protected print(): void {
    window.print();
  }
}
