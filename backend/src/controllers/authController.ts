import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import svgCaptcha from 'svg-captcha';
import db from '../config/db';
import { JWT_SECRET, AuthRequest } from '../middleware/authMiddleware';

let captchaStore: { [key: string]: string } = {};

export function getCaptcha(req: Request, res: Response) {
  const captcha = svgCaptcha.create({
    size: 5,
    noise: 2,
    color: true,
    background: '#f8fafc',
  });
  
  const captchaId = Math.random().toString(36).substring(2, 12);
  captchaStore[captchaId] = captcha.text.toLowerCase();

  // Clean up old captcha keys periodically
  if (Object.keys(captchaStore).length > 500) {
    captchaStore = {};
  }

  res.json({
    captchaId,
    captchaSvg: captcha.data,
    // Dev mode hint — not exposed in production
    ...(process.env.NODE_ENV !== 'production' ? { devAnswer: captcha.text.toLowerCase() } : {}),
  });
}

export async function register(req: Request, res: Response) {
  try {
    const {
      companyName,
      businessStructure,
      businessStructureOther,
      registeredAddressStreet,
      registeredAddressCity,
      registeredAddressState,
      registeredAddressCountry,
      gstNumber,
      gstDocument,
      panNumber,
      panDocument,
      cinNumber,
      cinDocument,
      dateOfRegistration,
      contactNumber,
      emailId,
      repName,
      repDesignation,
      repAuthorisationDocs, // Array of PDF paths
      repMobileNumber,
      repEmailId,
      password,
      captchaId,
      captchaText,
    } = req.body;

    // 1. Verify CAPTCHA
    // Dev bypass: in development mode, captchaId='DEV_BYPASS' and captchaText='dev_bypass' is accepted
    const isDevBypass =
      process.env.NODE_ENV !== 'production' &&
      captchaId === 'DEV_BYPASS' &&
      captchaText === 'dev_bypass';

    if (!isDevBypass) {
      if (!captchaId || !captchaText || captchaStore[captchaId] !== captchaText.toLowerCase()) {
        delete captchaStore[captchaId];
        res.status(400).json({ error: 'Invalid or expired CAPTCHA code. Please try again.' });
        return;
      }
      delete captchaStore[captchaId];
    }

    // 2. Validate GST & PAN patterns
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (gstNumber && !gstRegex.test(gstNumber.toUpperCase())) {
      res.status(400).json({ error: 'Invalid GSTIN format. Must be 15 characters (e.g. 07AAAAA0000A1Z5).' });
      return;
    }

    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (panNumber && !panRegex.test(panNumber.toUpperCase())) {
      res.status(400).json({ error: 'Invalid PAN format. Must be 10 characters (e.g. ABCDE1234F).' });
      return;
    }

    // 3. Check existing email
    const existingCompany = db.prepare('SELECT id FROM companies WHERE email_id = ?').get(emailId);
    if (existingCompany) {
      res.status(400).json({ error: 'Company email address is already registered.' });
      return;
    }

    // 4. Generate unique User ID
    const countRow = db.prepare('SELECT COUNT(*) as total FROM users').get() as any;
    const seq = (countRow.total + 1).toString().padStart(4, '0');
    const userId = `DMRC-VND-${seq}`;

    // 5. Insert Company
    const compStmt = db.prepare(`
      INSERT INTO companies (
        company_name, business_structure, business_structure_other,
        registered_address_street, registered_address_city, registered_address_state, registered_address_country,
        gst_number, gst_document, pan_number, pan_document, cin_number, cin_document,
        date_of_registration, contact_number, email_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const compResult = compStmt.run(
      companyName,
      businessStructure,
      businessStructureOther || null,
      registeredAddressStreet,
      registeredAddressCity,
      registeredAddressState,
      registeredAddressCountry,
      gstNumber.toUpperCase(),
      gstDocument || '',
      panNumber.toUpperCase(),
      panDocument || '',
      cinNumber || '',
      cinDocument || '',
      dateOfRegistration,
      contactNumber,
      emailId
    );

    const companyId = compResult.lastInsertRowid as number;

    // 6. Insert Representative
    const docsJson = JSON.stringify(repAuthorisationDocs || []);
    db.prepare(`
      INSERT INTO representatives (company_id, name, designation, authorisation_documents, mobile_number, email_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(companyId, repName, repDesignation, docsJson, repMobileNumber, repEmailId);

    // 7. Insert User Credentials
    const passwordHash = await bcrypt.hash(password, 10);
    db.prepare(`
      INSERT INTO users (user_id, password_hash, company_id, role)
      VALUES (?, ?, ?, 'VENDOR')
    `).run(userId, passwordHash, companyId);

    // 8. Generate JWT
    const token = jwt.sign(
      { userId, companyId, role: 'VENDOR' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Registration successful',
      userId,
      token,
      company: {
        id: companyId,
        companyName,
        emailId,
        gstNumber,
        panNumber,
        cinNumber,
      },
    });
  } catch (error: any) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: error.message || 'Server error during registration' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { userIdOrEmail, password } = req.body;

    if (!userIdOrEmail || !password) {
      res.status(400).json({ error: 'User ID / Email and password are required' });
      return;
    }

    // Find user by userId or company email
    let userRow: any = db.prepare('SELECT * FROM users WHERE user_id = ?').get(userIdOrEmail);

    if (!userRow) {
      const companyRow: any = db.prepare('SELECT id FROM companies WHERE email_id = ?').get(userIdOrEmail);
      if (companyRow) {
        userRow = db.prepare('SELECT * FROM users WHERE company_id = ?').get(companyRow.id);
      }
    }

    if (!userRow) {
      res.status(401).json({ error: 'Invalid User ID/Email or Password' });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, userRow.password_hash);
    if (!passwordMatch) {
      res.status(401).json({ error: 'Invalid User ID/Email or Password' });
      return;
    }

    const company: any = db.prepare('SELECT * FROM companies WHERE id = ?').get(userRow.company_id);

    const token = jwt.sign(
      { userId: userRow.user_id, companyId: userRow.company_id, role: userRow.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        userId: userRow.user_id,
        role: userRow.role,
        companyId: userRow.company_id,
      },
      company,
    });
  } catch (error: any) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
}

export function getMe(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthenticated' });
      return;
    }

    const userRow: any = db.prepare('SELECT user_id, company_id, role FROM users WHERE user_id = ?').get(req.user.userId);
    const company: any = db.prepare('SELECT * FROM companies WHERE id = ?').get(req.user.companyId);
    const representative: any = db.prepare('SELECT * FROM representatives WHERE company_id = ?').get(req.user.companyId);

    if (representative) {
      representative.authorisation_documents = JSON.parse(representative.authorisation_documents || '[]');
    }

    res.json({
      user: userRow,
      company,
      representative,
    });
  } catch (error: any) {
    console.error('GetMe Error:', error);
    res.status(500).json({ error: 'Server error fetching user details' });
  }
}
