import { Component, input } from '@angular/core';

/**
 * Ashoka Chakra: navy-blue wheel with 24 spokes (as on the National Flag).
 * Pure SVG, no external file needed.
 */
@Component({
  selector: 'app-chakra',
  template: `
    <svg viewBox="0 0 100 100" [attr.width]="size()" [attr.height]="size()" role="img" aria-label="Ashoka Chakra">
      <circle cx="50" cy="50" r="47" fill="none" [attr.stroke]="color()" stroke-width="3" />
      <circle cx="50" cy="50" r="6" [attr.fill]="color()" />
      @for (s of spokes; track $index) {
        <line [attr.x1]="s.x1" [attr.y1]="s.y1" [attr.x2]="s.x2" [attr.y2]="s.y2"
              [attr.stroke]="color()" stroke-width="1.8" stroke-linecap="round" />
      }
      @for (d of dots; track $index) {
        <circle [attr.cx]="d.x" [attr.cy]="d.y" r="1.7" [attr.fill]="color()" />
      }
    </svg>
  `,
  styles: [':host { display: inline-flex; }'],
})
export class Chakra {
  readonly size = input(48);
  readonly color = input('#000080');

  protected readonly spokes = Array.from({ length: 24 }, (_, i) => {
    const a = (i * 15 * Math.PI) / 180;
    return {
      x1: 50 + 7 * Math.cos(a), y1: 50 + 7 * Math.sin(a),
      x2: 50 + 41 * Math.cos(a), y2: 50 + 41 * Math.sin(a),
    };
  });
  protected readonly dots = Array.from({ length: 24 }, (_, i) => {
    const a = ((i * 15 + 7.5) * Math.PI) / 180;
    return { x: 50 + 42.5 * Math.cos(a), y: 50 + 42.5 * Math.sin(a) };
  });
}
