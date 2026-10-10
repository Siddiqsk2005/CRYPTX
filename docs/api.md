# API design

All API responses use `{ success, data }` or `{ success: false, error: { code, message } }`. Protected requests use `Authorization: Bearer <JWT>` and the backend validates role and access; UI role visibility is never the authorization boundary.

| Area | Routes |
| --- | --- |
| Authentication | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| Complaints | `POST /api/complaints`, `GET /api/complaints` |
| Investigations | `GET /api/investigations`, `GET /api/investigations/:id`, `POST /api/investigations/:id/analyze`, `GET /api/investigations/:id/risk` |
| Wallets | `GET /api/wallets/:address/graph` |
| VASPs | `GET /api/vasps` |
| Reports | `POST /api/reports/:investigationId` |
| Analytics | `GET /api/analytics/dashboard` |
| Admin | `GET /api/admin/audit-logs` |

The production expansion should add the remaining contract endpoints—notes, evidence, status changes, VASP CRUD, full tracing routes and download streaming—to matching controllers while preserving the same RBAC middleware.
