import { Injectable, effect, signal } from '@angular/core';

export type Lang = 'en' | 'hi';

type Entry = { en: string; hi: string };

const D: Record<string, Entry> = {
  // ---- general ----
  'app.title': { en: 'OT Readiness Prediction System', hi: 'ऑपरेशन थियेटर तत्परता पूर्वानुमान प्रणाली' },
  'app.subtitle': {
    en: 'Real-time monitoring and readiness prediction of the Operation Theatre environment',
    hi: 'ऑपरेशन थियेटर के पर्यावरण की वास्तविक-समय निगरानी एवं तत्परता पूर्वानुमान',
  },
  'util.skip': { en: 'Skip to main content', hi: 'मुख्य सामग्री पर जाएँ' },
  'util.textsize': { en: 'Text size', hi: 'पाठ का आकार' },
  'util.smaller': { en: 'Decrease text size', hi: 'पाठ छोटा करें' },
  'util.normal': { en: 'Reset text size', hi: 'सामान्य पाठ आकार' },
  'util.larger': { en: 'Increase text size', hi: 'पाठ बड़ा करें' },
  'util.contrast': { en: 'High contrast', hi: 'उच्च कंट्रास्ट' },
  'util.language': { en: 'Language', hi: 'भाषा' },
  'nav.main': { en: 'Main navigation', hi: 'मुख्य नेविगेशन' },
  'nav.dashboard': { en: 'Dashboard', hi: 'डैशबोर्ड' },
  'nav.control': { en: 'Control Panel', hi: 'नियंत्रण पैनल' },
  'nav.about': { en: 'About & Help', hi: 'परिचय एवं सहायता' },

  // ---- dashboard ----
  'dash.title': { en: 'Live Operation Theatre Status', hi: 'ऑपरेशन थियेटर की लाइव स्थिति' },
  'dash.status': { en: 'OT status', hi: 'ओटी की स्थिति' },
  'dash.score': { en: 'Readiness score', hi: 'तत्परता स्कोर' },
  'dash.outof': { en: 'out of 100', hi: '100 में से' },
  'dash.surgery': { en: 'Surgery type', hi: 'शल्य चिकित्सा का प्रकार' },
  'dash.lastupdate': { en: 'Last updated', hi: 'अंतिम अद्यतन' },
  'dash.auto': { en: 'Updates automatically every 5 seconds', hi: 'हर 5 सेकंड में स्वतः अद्यतन' },
  'dash.print': { en: 'Print / Save as PDF', hi: 'प्रिंट / PDF के रूप में सहेजें' },
  'dash.params': { en: 'Environmental parameters', hi: 'पर्यावरणीय मापदंड' },
  'dash.param': { en: 'Parameter', hi: 'मापदंड' },
  'dash.reading': { en: 'Current reading', hi: 'वर्तमान मान' },
  'dash.range': { en: 'Acceptable range', hi: 'स्वीकार्य सीमा' },
  'dash.check': { en: 'Check', hi: 'जाँच' },
  'dash.issues': { en: 'Issues detected', hi: 'पाई गई समस्याएँ' },
  'dash.noissues': { en: 'No issues detected.', hi: 'कोई समस्या नहीं पाई गई।' },
  'dash.trend': { en: 'Readiness score trend', hi: 'तत्परता स्कोर की प्रवृत्ति' },
  'dash.trend.note': { en: 'Last readings in this session', hi: 'इस सत्र की हाल की रीडिंग' },
  'dash.loading': { en: 'Loading data…', hi: 'डेटा लोड हो रहा है…' },
  'dash.error': {
    en: 'Unable to reach the server. Please check that the backend service is running.',
    hi: 'सर्वर से संपर्क नहीं हो पा रहा है। कृपया जाँचें कि बैकएंड सेवा चालू है।',
  },
  'check.ok': { en: 'Within range', hi: 'सीमा के भीतर' },
  'check.bad': { en: 'Out of range', hi: 'सीमा से बाहर' },
  'check.na': { en: 'Not scored', hi: 'अंकित नहीं' },
  'status.Ready': { en: 'Ready', hi: 'तैयार' },
  'status.Not Ready': { en: 'Not Ready', hi: 'तैयार नहीं' },

  // ---- sensors ----
  'sensor.Temperature': { en: 'Temperature', hi: 'तापमान' },
  'sensor.Humidity': { en: 'Relative humidity', hi: 'आपेक्षिक आर्द्रता' },
  'sensor.Differential_Pressure': { en: 'Differential pressure', hi: 'अंतर दाब' },
  'sensor.ACH': { en: 'Air changes per hour', hi: 'प्रति घंटा वायु परिवर्तन' },
  'sensor.CO2': { en: 'Carbon dioxide (CO₂)', hi: 'कार्बन डाइऑक्साइड (CO₂)' },
  'sensor.PM2.5': { en: 'Particulate matter PM2.5', hi: 'कणिकीय पदार्थ PM2.5' },
  'sensor.PM10': { en: 'Particulate matter PM10', hi: 'कणिकीय पदार्थ PM10' },
  'sensor.TVOC': { en: 'Total volatile organic compounds', hi: 'कुल वाष्पशील कार्बनिक यौगिक (TVOC)' },
  'sensor.Airflow_Velocity': { en: 'Airflow velocity', hi: 'वायु प्रवाह वेग' },
  'sensor.Light_Intensity': { en: 'Light intensity', hi: 'प्रकाश तीव्रता' },
  'sensor.Noise_Level': { en: 'Noise level', hi: 'ध्वनि स्तर' },

  // ---- surgery types ----
  'surgery.General Surgery': { en: 'General Surgery', hi: 'सामान्य शल्य चिकित्सा' },
  'surgery.Cardiac Surgery': { en: 'Cardiac Surgery', hi: 'हृदय शल्य चिकित्सा' },
  'surgery.Neurosurgery': { en: 'Neurosurgery', hi: 'तंत्रिका शल्य चिकित्सा' },
  'surgery.Orthopedic Surgery': { en: 'Orthopaedic Surgery', hi: 'अस्थि शल्य चिकित्सा' },

  // ---- issues (texts produced by the backend) ----
  'issue.temperature': { en: 'Temperature out of range', hi: 'तापमान सीमा से बाहर' },
  'issue.humidity': { en: 'Humidity out of range', hi: 'आर्द्रता सीमा से बाहर' },
  'issue.pressure': { en: 'Differential pressure out of range', hi: 'अंतर दाब सीमा से बाहर' },
  'issue.co2': { en: 'CO₂ level high', hi: 'CO₂ स्तर अधिक' },
  'issue.pm25': { en: 'PM2.5 level high', hi: 'PM2.5 स्तर अधिक' },
  'issue.pm10': { en: 'PM10 level high', hi: 'PM10 स्तर अधिक' },
  'issue.tvoc': { en: 'TVOC level high', hi: 'TVOC स्तर अधिक' },
  'issue.airflow': { en: 'Airflow velocity out of range', hi: 'वायु प्रवाह वेग सीमा से बाहर' },
  'issue.light': { en: 'Light intensity low', hi: 'प्रकाश तीव्रता कम' },
  'issue.noise': { en: 'Noise level high', hi: 'ध्वनि स्तर अधिक' },

  // ---- control panel ----
  'ctl.title': { en: 'OT Environment Control Panel', hi: 'ओटी पर्यावरण नियंत्रण पैनल' },
  'ctl.intro': {
    en: 'Choose where the dashboard gets its data. AUTO replays the recorded dataset. MANUAL uses the values entered below.',
    hi: 'चुनें कि डैशबोर्ड को डेटा कहाँ से मिले। AUTO दर्ज डेटासेट दोहराता है। MANUAL नीचे दर्ज मानों का उपयोग करता है।',
  },
  'ctl.mode': { en: 'Data source', hi: 'डेटा स्रोत' },
  'ctl.mode.AUTO': { en: 'AUTO – recorded dataset', hi: 'AUTO – दर्ज डेटासेट' },
  'ctl.mode.MANUAL': { en: 'MANUAL – values entered below', hi: 'MANUAL – नीचे दर्ज मान' },
  'ctl.surgery': { en: 'Surgery type', hi: 'शल्य चिकित्सा का प्रकार' },
  'ctl.values': { en: 'Environment values', hi: 'पर्यावरण मान' },
  'ctl.accept': { en: 'Acceptable', hi: 'स्वीकार्य' },
  'ctl.adminkey': { en: 'Administrator key', hi: 'प्रशासक कुंजी' },
  'ctl.adminkey.hint': {
    en: 'Required only if the server has been configured with an administrator key.',
    hi: 'केवल तभी आवश्यक जब सर्वर पर प्रशासक कुंजी सेट की गई हो।',
  },
  'ctl.save': { en: 'Save values', hi: 'मान सहेजें' },
  'ctl.test': { en: 'Test prediction (does not save)', hi: 'पूर्वानुमान जाँचें (सहेजता नहीं)' },
  'ctl.saved': { en: 'Values saved successfully.', hi: 'मान सफलतापूर्वक सहेजे गए।' },
  'ctl.result': { en: 'Prediction for the entered values', hi: 'दर्ज मानों के लिए पूर्वानुमान' },
  'ctl.loaderr': { en: 'Could not load the current values', hi: 'वर्तमान मान लोड नहीं हो सके' },
  'ctl.saveerr': { en: 'Could not save the values', hi: 'मान सहेजे नहीं जा सके' },
  'ctl.testerr': { en: 'Prediction failed', hi: 'पूर्वानुमान विफल रहा' },

  // ---- about ----
  'about.title': { en: 'About & Help', hi: 'परिचय एवं सहायता' },
  'about.purpose.h': { en: 'Purpose', hi: 'उद्देश्य' },
  'about.purpose.p': {
    en: 'This system monitors the environmental conditions of an Operation Theatre (OT) – temperature, humidity, pressure, air quality, airflow, lighting and noise – and uses a machine-learning model to indicate whether the OT is ready for surgery.',
    hi: 'यह प्रणाली ऑपरेशन थियेटर (ओटी) की पर्यावरणीय स्थितियों – तापमान, आर्द्रता, दाब, वायु गुणवत्ता, वायु प्रवाह, प्रकाश एवं ध्वनि – की निगरानी करती है और मशीन-लर्निंग मॉडल की सहायता से बताती है कि ओटी शल्य चिकित्सा के लिए तैयार है या नहीं।',
  },
  'about.method.h': { en: 'How the readiness score is calculated', hi: 'तत्परता स्कोर की गणना कैसे होती है' },
  'about.method.p': {
    en: 'The score starts at 100. Ten points are deducted for each parameter that is outside its acceptable range listed below. The Ready / Not Ready status is predicted separately by the trained model.',
    hi: 'स्कोर 100 से शुरू होता है। नीचे दी गई स्वीकार्य सीमा से बाहर प्रत्येक मापदंड के लिए 10 अंक घटाए जाते हैं। तैयार / तैयार नहीं की स्थिति प्रशिक्षित मॉडल द्वारा अलग से पूर्वानुमानित की जाती है।',
  },
  'about.disclaimer.h': { en: 'Disclaimer', hi: 'अस्वीकरण' },
  'about.disclaimer.p': {
    en: 'This system is a decision-support tool. The readiness score and the Ready / Not Ready status are generated from sensor readings and a machine-learning model. They do not replace the hospital’s infection-control protocols, clinical judgement or physical verification of the operation theatre before surgery.',
    hi: 'यह प्रणाली एक निर्णय-सहायक उपकरण है। तत्परता स्कोर तथा तैयार / तैयार नहीं की स्थिति सेंसर रीडिंग और मशीन-लर्निंग मॉडल से तैयार की जाती है। यह अस्पताल के संक्रमण-नियंत्रण प्रोटोकॉल, चिकित्सकीय निर्णय अथवा शल्य चिकित्सा से पूर्व ऑपरेशन थियेटर के भौतिक सत्यापन का स्थान नहीं लेती।',
  },
  'about.access.h': { en: 'Accessibility', hi: 'सुगम्यता' },
  'about.access.p': {
    en: 'This site supports keyboard navigation, a “skip to main content” link, adjustable text size, a high-contrast mode, screen-reader labels and a Hindi / English language switch. Status is never shown by colour alone.',
    hi: 'यह साइट कीबोर्ड नेविगेशन, “मुख्य सामग्री पर जाएँ” लिंक, पाठ के आकार में बदलाव, उच्च कंट्रास्ट मोड, स्क्रीन-रीडर लेबल तथा हिन्दी / अंग्रेज़ी भाषा परिवर्तन का समर्थन करती है। स्थिति केवल रंग से नहीं दर्शाई जाती।',
  },
  'about.contact.h': { en: 'Contact', hi: 'संपर्क' },
  'about.contact.email': { en: 'Email', hi: 'ईमेल' },
  'about.contact.phone': { en: 'Phone', hi: 'दूरभाष' },
  'about.contact.addr': { en: 'Address', hi: 'पता' },

  // ---- footer ----
  'foot.about': { en: 'About & Help', hi: 'परिचय एवं सहायता' },
  'foot.access': { en: 'Accessibility', hi: 'सुगम्यता' },
  'foot.disclaimer': { en: 'Disclaimer', hi: 'अस्वीकरण' },
  'foot.contact': { en: 'Contact', hi: 'संपर्क' },
  'foot.version': { en: 'Version', hi: 'संस्करण' },
  'foot.reviewed': { en: 'Last reviewed', hi: 'अंतिम समीक्षा' },
};

/** Backend issue text (English) -> dictionary key */
const ISSUE_KEYS: Record<string, string> = {
  'temperature out of range': 'issue.temperature',
  'humidity out of range': 'issue.humidity',
  'differential pressure out of range': 'issue.pressure',
  'pressure out of range': 'issue.pressure',
  'co2 level high': 'issue.co2',
  'high co₂': 'issue.co2',
  'pm2.5 level high': 'issue.pm25',
  'high pm2.5': 'issue.pm25',
  'pm10 level high': 'issue.pm10',
  'high pm10': 'issue.pm10',
  'tvoc level high': 'issue.tvoc',
  'high tvoc': 'issue.tvoc',
  'airflow velocity out of range': 'issue.airflow',
  'airflow out of range': 'issue.airflow',
  'light intensity low': 'issue.light',
  'low light': 'issue.light',
  'noise level high': 'issue.noise',
  'high noise': 'issue.noise',
};

@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly lang = signal<Lang>(this.initialLang());

  constructor() {
    effect(() => {
      const l = this.lang();
      document.documentElement.lang = l;
      try { localStorage.setItem('ot-lang', l); } catch { /* ignore */ }
    });
  }

  private initialLang(): Lang {
    try { return localStorage.getItem('ot-lang') === 'hi' ? 'hi' : 'en'; } catch { return 'en'; }
  }

  setLang(l: Lang): void { this.lang.set(l); }

  /** Translate a key; falls back to the key itself. Reads the signal so templates update. */
  t(key: string): string {
    const e = D[key];
    return e ? e[this.lang()] : key;
  }

  /** Translate a backend value (status, surgery type, sensor name) with a prefix. */
  tv(prefix: string, value: string): string {
    const e = D[`${prefix}.${value}`];
    return e ? e[this.lang()] : value;
  }

  issue(text: string): string {
    const k = ISSUE_KEYS[text.trim().toLowerCase()];
    return k ? this.t(k) : text;
  }

  /** "2026-10-11 10:37:05" -> "11/10/2026 10:37:05" (Indian DD/MM/YYYY). */
  dateTime(ts?: string | null): string {
    if (!ts) return '—';
    const m = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}:\d{2}:\d{2})/.exec(ts);
    return m ? `${m[3]}/${m[2]}/${m[1]} ${m[4]}` : ts;
  }
}
