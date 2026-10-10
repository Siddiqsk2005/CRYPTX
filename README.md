# TRACECHAIN-IN

**From Suspect Wallet to Actionable Intelligence.**

TRACECHAIN-IN is an SIH 2026 MVP for investigating victim-reported cryptocurrency wallets. It takes a report through traceable synthetic fund flow, explainable risk signals, carefully-qualified VASP attribution, investigator recommendations and draft evidence outputs.

## Demo-first workflow

The frontend operates in clearly labelled **DEMO MODE** out of the box. The data is synthetic, is never represented as a real fraud finding, and supports the complete presentation path:

1. Sign in as the victim and submit a suspect-wallet complaint.
2. Sign in as an investigator and open `TCIN-DEMO-001`.
3. Inspect the multi-hop graph: reported wallet → Intermediary A → Intermediary B → Demo Exchange Alpha.
4. Review deterministic risk signals, timeline, attribution confidence and recommendations.
5. Generate a locally downloaded investigation summary and a draft VASP/freeze-request file.

Demo credentials (development only):

| Role | Email | Password |
| --- | --- | --- |
| Victim | `victim@tracechain.demo` | `Victim@123` |
| Investigator | `investigator@tracechain.demo` | `Investigator@123` |
| Admin | `admin@tracechain.demo` | `Admin@123` |

## Run the interface

```bash
npm install
npm run dev
```

Open the URL shown by Vite (normally `http://localhost:5173`). No API key or database is needed for the DEMO MODE user flow.

## Run the API and PostgreSQL architecture

The Node/Express/TypeScript backend lives in `backend/` and provides JWT RBAC middleware, structured errors, rate limiting, Helmet, CORS, Prisma schema and modular blockchain-provider boundary.

```bash
cd backend
copy .env.example .env
npm install
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
npm run dev
```

Or run PostgreSQL only with Docker:

```bash
docker compose up -d postgres
```

Set `ETHEREUM_RPC_URL`, `ETHEREUM_API_KEY` and/or `BITCOIN_API_URL` in `backend/.env` to introduce live providers. The interface must show **LIVE BLOCKCHAIN DATA** only when a provider returns live data; otherwise it remains DEMO MODE.

## Safety and analytical safeguards

- Attribution is described as confirmed, probable, analytical cluster, or unknown—not wallet ownership.
- The risk engine is deterministic and evidence-oriented. Scores are analytical indicators, not legal determinations.
- VASP/freeze materials are generated as drafts for investigator review; the system never sends them.
- Do not add recovery phrases, passwords or API credentials to a complaint.

## Documentation

- [Architecture](docs/architecture.md)
- [API design](docs/api.md)
- [Investigation workflow](docs/investigation-workflow.md)

## Project layout

```text
src/trace/                 Demo data, presentation auth and graph components
src/pages/trace/           Role-based frontend screens
backend/src/               Express API and provider interfaces
backend/prisma/            PostgreSQL domain schema
docs/                      Architecture, API and workflow guides
```
