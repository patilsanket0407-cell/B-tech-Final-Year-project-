export type Mode = 'AUTO' | 'MANUAL';

export const SURGERY_TYPES = [
  'General Surgery',
  'Cardiac Surgery',
  'Neurosurgery',
  'Orthopedic Surgery',
] as const;

/** Values you can set in the control panel (same keys as current_values.json). */
export interface OtSettings {
  Mode: Mode;
  Surgery_Type: string;
  Temperature: number;
  Humidity: number;
  Differential_Pressure: number;
  ACH: number;
  CO2: number;
  'PM2.5': number;
  PM10: number;
  TVOC: number;
  Airflow_Velocity: number;
  Light_Intensity: number;
  Noise_Level: number;
}

/** Sensor values sent to / returned from the backend. */
export type OtSensors = Omit<OtSettings, 'Mode'>;

/** Response of GET /live and POST /predict. */
export interface OtReading extends OtSensors {
  Timestamp: string;
  OT_Status: string;
  Readiness_Score: number;
  Issues: string[];
}

export interface SensorDef {
  key: keyof OtSensors;
  unit: string;
  /** Acceptable range used by the backend scoring rules (undefined = no limit). */
  min?: number;
  max?: number;
  step: number;
}

/** Ranges mirror the readiness-score rules in app.py. Labels come from I18nService. */
export const SENSORS: SensorDef[] = [
  { key: 'Temperature', unit: '°C', min: 20, max: 24, step: 0.1 },
  { key: 'Humidity', unit: '%', min: 40, max: 60, step: 1 },
  { key: 'Differential_Pressure', unit: 'Pa', min: 15, max: 25, step: 1 },
  { key: 'ACH', unit: 'ACH', step: 1 },
  { key: 'CO2', unit: 'ppm', max: 700, step: 1 },
  { key: 'PM2.5', unit: 'µg/m³', max: 10, step: 1 },
  { key: 'PM10', unit: 'µg/m³', max: 20, step: 1 },
  { key: 'TVOC', unit: 'ppb', max: 500, step: 1 },
  { key: 'Airflow_Velocity', unit: 'm/s', min: 0.2, max: 0.3, step: 0.01 },
  { key: 'Light_Intensity', unit: 'lux', min: 1000, step: 10 },
  { key: 'Noise_Level', unit: 'dB', max: 60, step: 1 },
];

/** "20 – 24 °C", "≤ 700 ppm", "≥ 1000 lux" or "" when the parameter is not scored. */
export function rangeText(s: SensorDef): string {
  if (s.min !== undefined && s.max !== undefined) return `${s.min} – ${s.max} ${s.unit}`;
  if (s.max !== undefined) return `≤ ${s.max} ${s.unit}`;
  if (s.min !== undefined) return `≥ ${s.min} ${s.unit}`;
  return '';
}
