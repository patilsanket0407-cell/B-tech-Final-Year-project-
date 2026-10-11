import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OtReading, OtSensors, OtSettings, SENSORS, SURGERY_TYPES, rangeText } from '../../models/ot.models';
import { I18nService } from '../../services/i18n.service';
import { OtApiService, errMsg } from '../../services/ot-api.service';

@Component({
  selector: 'app-control-panel',
  imports: [ReactiveFormsModule],
  templateUrl: './control-panel.html',
  styleUrl: './control-panel.css',
})
export class ControlPanel implements OnInit {
  private api = inject(OtApiService);
  private fb = inject(FormBuilder).nonNullable;
  protected readonly i18n = inject(I18nService);

  protected readonly sensors = SENSORS;
  protected readonly rangeText = rangeText;
  protected readonly surgeryTypes = SURGERY_TYPES;

  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly message = signal<string | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly prediction = signal<OtReading | null>(null);

  protected readonly form = this.fb.group({
    Mode: this.fb.control<'AUTO' | 'MANUAL'>('AUTO'),
    Surgery_Type: this.fb.control<string>(SURGERY_TYPES[0], Validators.required),
    Temperature: this.fb.control(22, Validators.required),
    Humidity: this.fb.control(50, Validators.required),
    Differential_Pressure: this.fb.control(20, Validators.required),
    ACH: this.fb.control(25, Validators.required),
    CO2: this.fb.control(550, Validators.required),
    'PM2.5': this.fb.control(5, Validators.required),
    PM10: this.fb.control(15, Validators.required),
    TVOC: this.fb.control(150, Validators.required),
    Airflow_Velocity: this.fb.control(0.25, Validators.required),
    Light_Intensity: this.fb.control(1100, Validators.required),
    Noise_Level: this.fb.control(45, Validators.required),
    AdminKey: this.fb.control(''),
  });

  ngOnInit(): void {
    this.api.getSettings().subscribe({
      next: (s) => {
        this.form.patchValue(s);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(`${this.i18n.t('ctl.loaderr')}: ${errMsg(e)}`);
        this.loading.set(false);
      },
    });
  }

  protected save(): void {
    this.reset();
    this.saving.set(true);
    const { AdminKey, ...settings } = this.form.getRawValue();
    this.api.saveSettings(settings as OtSettings, AdminKey).subscribe({
      next: () => {
        this.message.set(this.i18n.t('ctl.saved'));
        this.saving.set(false);
      },
      error: (e) => {
        this.error.set(`${this.i18n.t('ctl.saveerr')}: ${errMsg(e)}`);
        this.saving.set(false);
      },
    });
  }

  /** Try the form values against the model without saving them. */
  protected test(): void {
    this.reset();
    const { Mode, AdminKey, ...sensors } = this.form.getRawValue();
    this.api.predict(sensors as OtSensors).subscribe({
      next: (r) => this.prediction.set(r),
      error: (e) => this.error.set(`${this.i18n.t('ctl.testerr')}: ${errMsg(e)}`),
    });
  }

  private reset(): void {
    this.message.set(null);
    this.error.set(null);
    this.prediction.set(null);
  }
}
