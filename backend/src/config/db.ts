import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbDir = path.resolve(__dirname, '../../data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'dmrc_vendors.db');
export const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS companies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_name TEXT NOT NULL,
      business_structure TEXT NOT NULL,
      business_structure_other TEXT,
      registered_address_street TEXT NOT NULL,
      registered_address_city TEXT NOT NULL,
      registered_address_state TEXT NOT NULL,
      registered_address_country TEXT NOT NULL,
      gst_number TEXT NOT NULL,
      gst_document TEXT NOT NULL,
      pan_number TEXT NOT NULL,
      pan_document TEXT NOT NULL,
      cin_number TEXT NOT NULL,
      cin_document TEXT NOT NULL,
      date_of_registration TEXT NOT NULL,
      contact_number TEXT NOT NULL,
      email_id TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS representatives (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      designation TEXT NOT NULL,
      authorisation_documents TEXT NOT NULL, -- JSON array of file paths
      mobile_number TEXT NOT NULL,
      email_id TEXT NOT NULL,
      FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      company_id INTEGER NOT NULL,
      role TEXT NOT NULL DEFAULT 'VENDOR', -- 'VENDOR' or 'ADMIN'
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS civil_materials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sno TEXT UNIQUE NOT NULL,
      details TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS arc_materials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sno TEXT NOT NULL,
      work_category TEXT NOT NULL,
      item_product TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS electrical_materials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sno TEXT UNIQUE NOT NULL,
      item_product TEXT NOT NULL,
      assign_to TEXT
    );

    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_id INTEGER NOT NULL,
      user_id TEXT NOT NULL,
      category TEXT NOT NULL, -- 'CIVIL', 'ELECTRICAL', 'ARCHITECTURE'
      applying_as TEXT NOT NULL, -- 'MANUFACTURER', 'AUTHORISED RESELLER', 'FABRICATOR'
      material_id INTEGER NOT NULL,
      material_name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'DRAFT', -- 'DRAFT', 'SUBMITTED', 'EMPANELLED', 'UNDER_REVIEW', 'REJECTED'
      form_data TEXT NOT NULL, -- Full JSON payload of all form sections & child tables
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
    );
  `);
}

export default db;
