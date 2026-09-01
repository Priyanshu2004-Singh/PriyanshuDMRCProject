# DMRC Vendor Empanelment Portal — Setup & Run Guide

---

## Prerequisites

Before running this project, ensure the following tools are installed on your machine.

### 1. Node.js (v18 or above)

Check if you have it:
```bash
node -v
```

If not installed, download from [https://nodejs.org](https://nodejs.org) and install the **LTS** version.

---

### 2. npm (comes with Node.js)

Check version:
```bash
npm -v
```

Should be **v9 or above**.

---

### 3. Git (optional, for cloning)

```bash
git --version
```

---

### 4. macOS Specific — Disable AirPlay Receiver (IMPORTANT)

On **macOS Monterey and above**, port `5000` is reserved by AirPlay Receiver. The backend in this project uses port `5001` by default to avoid this conflict. No action needed — this is already configured.

> ⚠️ If you see `EADDRINUSE: address already in use :::5001`, run:
> ```bash
> lsof -ti:5001 | xargs kill -9
> ```

---

## Project Structure

```
freelancingProject/
├── backend/           ← Node.js + Express + TypeScript API Server
│   ├── src/
│   ├── data/          ← SQLite database file (auto-created)
│   ├── uploads/       ← Uploaded PDF files (auto-created)
│   └── .env
└── frontend/          ← React + Vite + TypeScript Web App
    └── src/
```

---

## Step-by-Step Installation & Run

### Step 1 — Install Backend Dependencies

Open a terminal and run:

```bash
cd path/to/freelancingProject/backend
npm install
```

This installs Express, SQLite, JWT, bcrypt, multer, svg-captcha, and all TypeScript tooling.

---

### Step 2 — Install Frontend Dependencies

Open a **second** terminal tab and run:

```bash
cd path/to/freelancingProject/frontend
npm install
```

This installs React, Vite, Tailwind CSS, Axios, React Router, and all UI dependencies.

---

### Step 3 — Start the Backend API Server

In the backend terminal:

```bash
cd path/to/freelancingProject/backend
npm run dev
```

Expected output:
```
[INFO] ts-node-dev starting...
Database seeded successfully.
DMRC Vendor Portal Backend running on http://localhost:5001
```

> The database (`data/dmrc_vendors.db`) is **created automatically** on first run.  
> All seed data (45 Civil items, 61 Architecture items, 10 Electrical items, Admin user) is inserted automatically.

---

### Step 4 — Start the Frontend Development Server

In the frontend terminal:

```bash
cd path/to/freelancingProject/frontend
npm run dev
```

Expected output:
```
VITE v6.x.x  ready in 300 ms
➜  Local:   http://localhost:5173/
```

---

### Step 5 — Open the Portal in Your Browser

Go to: **[http://localhost:5173](http://localhost:5173)**

---

## Default Login Credentials

| Role | User ID | Password | Landing Page |
|---|---|---|---|
| DMRC Admin Officer | `DMRC-ADMIN-01` | `admin123` | `/admin` — Application Review Queue |
| (Register as Vendor) | Use Register page | Your choice | `/dashboard` |

---

## Registering a New Vendor

1. Click **Register Company** on the login page.
2. Fill in all fields in **Section A** (Company Details): Name, Business Structure, Address, GSTIN, PAN, CIN, and upload the respective PDF certificates.
3. Fill in **Section B** (Authorised Representative): Name, Designation, Power of Attorney PDF, Mobile, Email.
4. In **Section C** (Credentials): Enter your desired password, type the CAPTCHA, accept the declaration, and click **Submit Registration Form**.
5. You'll be assigned a User ID in the format `DMRC-VND-XXXX` and redirected to your vendor dashboard.

---

## Submitting an Empanelment Application

### Civil (8 Sections)
1. Click **New Civil Application** on the dashboard.
2. Select the material (C1–C45), fill all 8 sections.
3. ⚠️ Section C requires **minimum 3 approvals**, at least **1 from Metro/Railways**.
4. ⚠️ Section G (OCS Test Report) date **cannot be older than 12 months**.
5. Click **Save as Draft** to save progress, or **Submit Application** (confirmation dialog will appear).

### Electrical (13 Sections)
1. Click **New Electrical Application** on the dashboard.
2. Select the electrical system (E1–E10), fill Capacity, Rating fields.
3. Declare in-house Design/Testing/R&D capability (conditional PDF uploads).
4. Fill blacklisting & litigation checks (Section C).
5. Fill financial data with Net Worth, Solvency certificate, and per-FY P&L + Balance Sheet.
6. Fill Type Test Certificate section (Section F — gate field).
7. Section H has the **25kV OHE EMI/EMC 3-way toggle** (Yes/No/Not Applicable).

### Architecture (4 Sections)
1. Click **New Architecture Application** on the dashboard.
2. Select the architectural item (`A1 – Flooring – Vitrified Tiles` etc.).
3. Add IS Codes and International Codes with validity dates (repeatable rows).
4. Declare NABL accredited lab test, ISO certification, Green material certification.
5. Enter SRI (Solar Reflectance Index) value if applicable.
6. Check Interior / Exterior application type.

---

## DMRC Admin Review Portal

1. Log in as `DMRC-ADMIN-01` / `admin123` → auto-redirected to `/admin`.
2. View all submitted vendor applications in the queue table.
3. Filter by Category (Civil / Electrical / Architecture) and Status.
4. Click **Inspect & Review** on any application.
5. Enter official remarks and click **Empanel / Approve Product** or **Reject Application**.

---

## Environment Variables

The backend `.env` file is at `backend/.env`:

```env
PORT=5001
JWT_SECRET=dmrc_vendor_empanelment_secret_key_2025
NODE_ENV=development
```

Change `JWT_SECRET` to a strong random string in production.

---

## PDF Upload Rules

- All document uploads are **PDF format only** (`.pdf`, MIME type `application/pdf`).
- Default max file size: **5 MB** per upload.
- Some fields (10 MB) are noted in the UI.
- Files are stored in `backend/uploads/`.

---

## Known Gap — Electrical Items

Per the project brief (§5), the full Electrical items list was not provided. The `electrical_materials` table is seeded with **10 representative items** (`E1` to `E10`). To add more electrical items, edit the `electricalMaterials` array in:

```
backend/src/services/seedService.ts
```

Then delete the SQLite database file and restart the server to re-seed:

```bash
rm backend/data/dmrc_vendors.db
npm run dev   # (in backend directory)
```

---

## Troubleshooting

| Issue | Fix |
|---|---|
| `EADDRINUSE :::5001` | Run `lsof -ti:5001 \| xargs kill -9` |
| `EADDRINUSE :::5173` | Run `lsof -ti:5173 \| xargs kill -9` |
| White page / 404 | Make sure both frontend AND backend are running |
| Login says "Invalid User ID" | Admin user must be seeded — delete the `.db` file and restart backend |
| CAPTCHA not loading | Backend must be running on port 5001 before opening the frontend |
| PDF upload fails | File must be in `.pdf` format and under 5 MB |

---

## Production Build

To build for production:

**Backend:**
```bash
cd backend && npm run build
node dist/server.js
```

**Frontend:**
```bash
cd frontend && npm run build
# Then serve the dist/ folder via Nginx or any static host
```
