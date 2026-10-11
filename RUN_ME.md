# OT Readiness Prediction System – Flask backend + Angular frontend (Government-portal style)

## 1. Run on your computer (two terminals, project folder open in VS Code)
```bash
# one-time
pip install flask flask-cors joblib pandas scikit-learn
cd frontend && npm install && cd ..

# terminal 1 – backend  (http://127.0.0.1:5000)
python app.py

# terminal 2 – frontend (http://localhost:4200)
cd frontend
npm start
```
Open http://localhost:4200  (Node.js 20.19+ or 22.12+ required)

## 2. BEFORE PUBLISHING – edit these
| What | Where |
|---|---|
| Ministry / Department name, contact details, "content owned by" | `frontend/src/app/config/site.config.ts` |
| Official State Emblem (only if you are an authorised Govt. body) | save as `frontend/public/emblem/emblem.svg`, then set `useEmblemImage: true` in site.config.ts. Read `frontend/public/emblem/README.txt` (legal note). |
| Hindi translations (have them reviewed by an official translator) | `frontend/src/app/services/i18n.service.ts` |
| Acceptable ranges shown on screen (must match app.py rules) | `frontend/src/app/models/ot.models.ts` |

The Ashoka Chakra and tricolour band are drawn in the app itself.
The State Emblem is NOT included – download it only from the official Government of India source.

## 3. Security settings for a public / production deployment
- **Admin key**: set the environment variable `OT_ADMIN_KEY` before starting Flask; changing values in the
  Control Panel then requires that key.
  - Windows (cmd):  `set OT_ADMIN_KEY=your-long-secret` then `python app.py`
  - Windows (PowerShell):  `$env:OT_ADMIN_KEY="your-long-secret"; python app.py`
- **CORS**: by default only http://localhost:4200 may call the API. For production serve Angular and Flask on
  the same domain (reverse proxy `/api` -> Flask) or set `OT_CORS_ORIGINS=https://your-domain.gov.in`.
- **Debug mode is OFF** by default. Do not set `FLASK_DEBUG=1` in production.
- Do not use `python app.py` (Flask development server) in production. Use a production server, e.g.
  `pip install waitress` then `waitress-serve --port=5000 app:app`, behind Nginx/IIS with HTTPS.
- The `/predict` and `/live` endpoints are open (read-only). Add authentication if the data is sensitive.

## 4. Production build of the frontend
```bash
cd frontend
npm run build          # output: frontend/dist/frontend/browser
```
Serve that folder from Nginx/IIS, and forward `/api/` to Flask (strip the `/api` prefix), e.g. Nginx:
```
location /api/ { proxy_pass http://127.0.0.1:5000/; }
location /     { root /path/to/browser; try_files $uri /index.html; }
```

## 5. Government-portal features included (aligned with GIGW principles)
Bilingual English / हिन्दी switch, skip-to-content link, text-size controls (A- A A+), high-contrast mode,
keyboard focus outlines, screen-reader labels, status never shown by colour alone, responsive layout,
printable view, DD/MM/YYYY dates, Noto Sans / Noto Sans Devanagari fonts bundled locally (no external requests),
About / Accessibility / Disclaimer / Contact pages, last-reviewed date and content-owner footer.

NOTE: This is NOT a formal GIGW / STQC certification. Government websites normally need a formal
accessibility/security audit and hosting approval (e.g. .gov.in domain via NIC) before launch.
