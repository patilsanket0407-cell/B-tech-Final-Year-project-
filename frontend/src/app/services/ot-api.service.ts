import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { OtReading, OtSensors, OtSettings } from '../models/ot.models';

/**
 * Talks to the Flask backend. Requests go to "/api/..." and the dev proxy
 * (proxy.conf.json) forwards them to Flask. Change API_BASE for production.
 */
const API_BASE = '/api';

/** Flask returns HTTP 200 with {"error": "..."} on some failures, so turn that into a real error. */
function failOnErrorField<T>() {
  return map((res: T & { error?: string }) => {
    if (res && res.error) {
      throw new Error(res.error);
    }
    return res as T;
  });
}

/** Readable message from any failed request. */
export function errMsg(e: unknown): string {
  const err = e as { error?: { error?: string }; message?: string };
  return err?.error?.error ?? err?.message ?? String(e);
}

@Injectable({ providedIn: 'root' })
export class OtApiService {
  private http = inject(HttpClient);

  /** GET /live – next reading (AUTO = dataset row, MANUAL = control-panel values) + prediction. */
  getLive(): Observable<OtReading> {
    return this.http.get<OtReading>(`${API_BASE}/live`).pipe(failOnErrorField<OtReading>());
  }

  /** POST /predict – run the model on values you supply. */
  predict(values: OtSensors): Observable<OtReading> {
    return this.http.post<OtReading>(`${API_BASE}/predict`, values).pipe(failOnErrorField<OtReading>());
  }

  /** GET /settings – current control-panel values. */
  getSettings(): Observable<OtSettings> {
    return this.http.get<OtSettings>(`${API_BASE}/settings`).pipe(failOnErrorField<OtSettings>());
  }

  /** POST /settings – save control-panel values. adminKey is sent only if the server requires one. */
  saveSettings(settings: OtSettings, adminKey = ''): Observable<OtSettings> {
    const headers = adminKey ? new HttpHeaders({ 'X-Admin-Key': adminKey }) : undefined;
    return this.http
      .post<OtSettings>(`${API_BASE}/settings`, settings, { headers })
      .pipe(failOnErrorField<OtSettings>());
  }
}
