# UPI Sentinel – Digital Payment Fraud Detection System (Prototype)

Frontend prototype: all 11 pages work, with login, fraud detection, dashboard charts, history, notifications, admin panel and contact.
Data is kept in the browser's localStorage, which stands in for MySQL in this phase.

## Run
```
python -m http.server 5500
```
Then open http://localhost:5500

## Demo logins (test accounts)
| Role | Email | Password |
|---|---|---|
| Showcase user (140 transactions) | showcase@sentinel.test | Sentinel@2026 |
| Demo user | demo@sentinel.test | demo1234 |
| Admin | admin@sentinel.test | admin1234 |

To reset the demo data, open Admin panel and click "Reset demo data".

## Structure
- `index.html`: app shell
- `css/style.css`: gold/black theme
- `js/engine.js`: explainable risk engine (0–100, Safe / Suspicious / Potential Fraud)
- `js/store.js`: data layer and seed data
- `js/pages.js`: page templates
- `js/app.js`: router, charts, UI

## Next phase
Flask API, MySQL tables, a scikit-learn Random Forest trained on the same features as `engine.js`.
