import { Component, inject } from '@angular/core';
import { SENSORS, rangeText } from '../../models/ot.models';
import { SITE } from '../../config/site.config';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  protected readonly i18n = inject(I18nService);
  protected readonly site = SITE;
  protected readonly rules = SENSORS.filter((s) => rangeText(s));
  protected readonly rangeText = rangeText;
}
