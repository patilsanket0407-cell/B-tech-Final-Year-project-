import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Chakra } from './components/chakra/chakra';
import { SITE } from './config/site.config';
import { A11yService } from './services/a11y.service';
import { I18nService } from './services/i18n.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Chakra],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly i18n = inject(I18nService);
  protected readonly a11y = inject(A11yService);
  protected readonly site = SITE;
  protected readonly emblemMissing = signal(false);

  /** In-page skip link (a plain "#main" href would trigger the SPA router). */
  protected skip(ev: Event): void {
    ev.preventDefault();
    document.getElementById('main')?.focus();
  }
}
