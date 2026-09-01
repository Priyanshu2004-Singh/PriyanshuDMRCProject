# PriyanshuDMRCProject

**DMRC Vendor Registration & Empanelment Portal** — built for Delhi Metro Rail Corporation (DMRC).

Vendors register a company account and submit empanelment applications for Civil, Electrical, and Architectural products.

---

## Quick Start (Clone & Run)

### Prerequisites
- **Node.js v18+** → [https://nodejs.org](https://nodejs.org)
- **npm v9+** (comes with Node.js)

### 1. Clone the repository
```bash
git clone https://github.com/Priyanshu2004-Singh/PriyanshuDMRCProject.git
cd PriyanshuDMRCProject
```

### 2. Start the Backend (Terminal 1)
```bash
cd backend
npm install
npm run dev
```
> Backend runs at **http://localhost:5001**  
> Database is auto-created and seeded on first run ✅

### 3. Start the Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```
> Frontend runs at **http://localhost:5173**

### 4. Open in Browser
**http://localhost:5173**

---

## Login Credentials

| Role | User ID | Password |
|---|---|---|
| DMRC Admin | `DMRC-ADMIN-01` | `admin123` |
| Vendor (test) | `DMRC-VND-0004` | `BuildRight@2024` |

Or **register a new vendor** at [/register](http://localhost:5173/register)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| Database | SQLite (via better-sqlite3, zero-config) |
| Auth | JWT + bcrypt + SVG CAPTCHA |
| File Upload | Multer (PDF only, 5MB limit) |

---

## Project Structure

```
PriyanshuDMRCProject/
├── backend/
│   ├── src/
│   │   ├── controllers/   ← Auth, Materials, Applications, Admin
│   │   ├── routes/        ← Express route definitions
│   │   ├── middleware/    ← JWT auth, file upload
│   │   ├── services/      ← DB seed, file storage
│   │   └── server.ts      ← Entry point
│   ├── data/              ← SQLite database (auto-created)
│   ├── uploads/           ← Uploaded PDFs (runtime)
│   └── .env               ← PORT, JWT_SECRET
└── frontend/
    └── src/
        ├── pages/         ← Login, Register, Dashboard, Civil, Electrical, Architecture, Admin
        ├── components/    ← Navbar, Footer, Captcha, FileUpload, Modal
        └── services/      ← Axios API client
```

---

## Features

- ✅ Company registration with GSTIN / PAN / CIN validation + CAPTCHA
- ✅ JWT-based login with role-based routing (VENDOR → dashboard, ADMIN → /admin)
- ✅ Civil Application Form (8 sections, 45 material items)
- ✅ Electrical Application Form (13 sections, OHE EMI/EMC toggle)
- ✅ Architecture Application Form (4 sections, IS/International code rows)
- ✅ DMRC Admin portal — review, approve, or reject applications
- ✅ PDF upload with MIME-type validation (PDF only, 5 MB limit)
- ✅ Draft save + full submission with confirmation modal

---

## Troubleshooting

| Error | Fix |
|---|---|
| `EADDRINUSE :::5001` | Run `lsof -ti:5001 \| xargs kill -9` |
| `EADDRINUSE :::5173` | Run `lsof -ti:5173 \| xargs kill -9` |
| White page / API errors | Make sure **both** terminals are running |
| Fresh database needed | Delete `backend/data/dmrc_vendors.db` and restart backend |

---

> Reference: DMRC/Plg./Vendor/7000/Vol.2/2025/ dated 29.09.2025 — Annexures A–D
