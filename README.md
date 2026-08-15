# Creation

Construction projects fall apart when budgets, site reports, and procurement live in different spreadsheets. Creation connects the full operational chain — BOQ → progress → materials → purchase orders → receipts → expenses — into one system where the numbers always match reality.

## What It Solves

Small construction companies currently track projects across WhatsApp, Excel, and paper. This creates gaps between what was budgeted, what was ordered, what arrived on site, and what was actually spent. Creation closes those gaps by making every step part of one connected workflow.

## What It Does

One chain, start to finish:

Organization → Users & Roles → Client → Project → Milestones → BOQ/Budget → Site Progress → Material Request → Approval → Purchase Order → PO Approval → Goods Receipt → Material Balance → Expense → Project Cost → Dashboard → Audit

Each step has state-machine enforcement. A rejected material request cannot become a purchase order. An unapproved expense does not hit the budget. The backend computes every financial total; the frontend never guesses.

## Who It Is For

Small-to-medium construction companies running multiple concurrent projects with a team of 10–50 people across site supervisors, project managers, procurement officers, storekeepers, and finance staff.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Python 3.12, FastAPI, SQLAlchemy 2 (async) |
| Database | PostgreSQL 16, Alembic migrations |
| Frontend | React 18, Vite, Tailwind CSS |
| State | TanStack Query (server), Zustand (client) |
| Charts | Recharts |
| i18n | react-i18next (English + Urdu, RTL ready) |
| AI | Ollama (local LLM), Qwen 2.5 7B |
| Auth | JWT access + refresh, bcrypt |
| Containers | Docker, Docker Compose |
| Testing | pytest (backend), Vitest + React Testing Library (frontend) |

## Core Features

- **Multi-tenant workspaces** — Each organization is fully isolated. Users cannot see or touch another company's data.
- **RBAC** — Roles (Company Admin, Project Manager, Site Supervisor, Procurement Officer, Storekeeper, Finance Officer) are resolved through permissions, never hard-coded role names.
- **Budget & BOQ** — Hierarchical bill of quantities with planned vs actual cost tracking, commitment calculations, and variance alerts.
- **Site Progress** — Daily site reports with weather, worker count, work completed, issues, blockers, and photo attachments. Mobile-first form for field use.
- **Material Requests** — Request → Approve → Order → Receive workflow with budget linkage and quantity enforcement.
- **Procurement** — Supplier directory, purchase orders with tax/discount/total computed server-side, approval gates.
- **Goods Receipts** — Record what actually arrived vs what was ordered. Accepted quantity updates material balance; rejected quantity is tracked separately.
- **Expenses** — Submit with receipt attachment, approval workflow, reversal support. Only approved expenses hit project cost.
- **Dashboard** — Real-time project health: contract value, budget usage, committed costs, actual costs, physical progress, pending approvals, late deliveries.
- **AI Assistant** — Analyzes raw site reports and drafts structured summaries (completed work, issues, risk level, suggested actions). Human review required; AI cannot approve or mutate state.
- **Audit Trail** — Every approval, rejection, state change, and budget mutation is logged immutably with actor, before/after state, and request correlation ID.
- **Bilingual** — Full English and Urdu support, including RTL layout, PKR currency formatting, and locale-aware dates.

## Architecture Principles

1. **Workflow first** — Every feature participates in the real business chain, never a standalone screen.
2. **Backend authoritative** — Financial totals are computed server-side; the frontend sends inputs, never totals.
3. **State machines** — Requests, POs, receipts, expenses, and reports cannot jump arbitrarily between states.
4. **No floating-point money** — All financial values use Decimal / NUMERIC(18,2).
5. **Optimistic locking** — Version columns prevent silent overwrites when two users edit the same budget or PO.
6. **Idempotent writes** — Idempotency keys prevent duplicate records from retries or double-clicks.
7. **Soft delete only** — Organization data is archived, never hard-deleted, preserving audit and financial history.

## Project Structure
creation/
├── backend/
│   ├── app/
│   │   ├── core/          
│   │   ├── shared/        
│   │   ├── dependencies/ 
│   │   └── modules/      
│   │                     
│   │                    
│   ├── tests/
│   └── alembic/
├── frontend/
│   ├── src/
│   │   ├── modules/       
│   │   ├── components/    
│   │   ├── locales/      
│   │   └── types/         
│   └── Dockerfile
├── docker-compose.yml
└── .env.example
plain

## Getting Started

```bash
# Clone and start all services
git clone <repo>
cd tameer
cp .env.example .env
docker compose up

# Backend API
http://localhost:8000

# Frontend
http://localhost:5173

# Health check
http://localhost:8000/health