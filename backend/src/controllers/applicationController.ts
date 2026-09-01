import { Response } from 'express';
import db from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';

export function listApplications(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthenticated' });
      return;
    }

    const rows = db.prepare(`
      SELECT a.*, c.company_name, c.email_id
      FROM applications a
      JOIN companies c ON a.company_id = c.id
      WHERE a.company_id = ?
      ORDER BY a.updated_at DESC
    `).all(req.user.companyId);

    const formatted = rows.map((r: any) => ({
      id: r.id,
      companyId: r.company_id,
      userId: r.user_id,
      category: r.category,
      applyingAs: r.applying_as,
      materialId: r.material_id,
      materialName: r.material_name,
      status: r.status,
      formData: JSON.parse(r.form_data),
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));

    res.json(formatted);
  } catch (error: any) {
    console.error('List Applications Error:', error);
    res.status(500).json({ error: 'Failed to fetch vendor applications' });
  }
}

export function getApplicationById(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthenticated' });
      return;
    }

    const id = req.params.id;
    const row: any = db.prepare('SELECT * FROM applications WHERE id = ? AND company_id = ?').get(id, req.user.companyId);

    if (!row) {
      res.status(404).json({ error: 'Application not found' });
      return;
    }

    res.json({
      id: row.id,
      companyId: row.company_id,
      userId: row.user_id,
      category: row.category,
      applyingAs: row.applying_as,
      materialId: row.material_id,
      materialName: row.material_name,
      status: row.status,
      formData: JSON.parse(row.form_data),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch application details' });
  }
}

export function saveApplication(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthenticated' });
      return;
    }

    const { id, category, applyingAs, materialId, materialName, status, formData } = req.body;

    if (!category || !applyingAs || !materialId || !materialName || !formData) {
      res.status(400).json({ error: 'Category, Applying As, Material, and Form Data are required' });
      return;
    }

    const targetStatus = status === 'SUBMITTED' ? 'SUBMITTED' : 'DRAFT';

    // Validation rules for Civil Submit
    if (category === 'CIVIL' && targetStatus === 'SUBMITTED') {
      const approvals = formData.approvals || [];
      if (approvals.length < 3) {
        res.status(400).json({ error: 'Civil Empanelment requires at least 3 approval certificates from major agencies.' });
        return;
      }

      const hasMetroOrRailway = approvals.some((app: any) =>
        (app.agencyType && (app.agencyType.toUpperCase().includes('METRO') || app.agencyType.toUpperCase().includes('RAILWAY'))) ||
        (app.agencyName && (app.agencyName.toUpperCase().includes('METRO') || app.agencyName.toUpperCase().includes('RAILWAY')))
      );

      if (!hasMetroOrRailway) {
        res.status(400).json({ error: 'Civil Empanelment requires at least 1 approval from a Metro Rail or Railway agency.' });
        return;
      }

      // Check OCS date constraint: <= 12 months old
      const ocsIssuanceDate = formData.ocsIssuanceDate;
      if (ocsIssuanceDate) {
        const issueDate = new Date(ocsIssuanceDate);
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
        if (issueDate < twelveMonthsAgo) {
          res.status(400).json({ error: 'DMRC OCS Test Report / Certificate cannot be older than 12 months from today.' });
          return;
        }
      }
    }

    const now = new Date().toISOString();
    let appId = id;

    if (id) {
      // Update existing record
      const existing: any = db.prepare('SELECT id FROM applications WHERE id = ? AND company_id = ?').get(id, req.user.companyId);
      if (!existing) {
        res.status(404).json({ error: 'Application not found or unauthorized' });
        return;
      }

      db.prepare(`
        UPDATE applications
        SET applying_as = ?, material_id = ?, material_name = ?, status = ?, form_data = ?, updated_at = ?
        WHERE id = ? AND company_id = ?
      `).run(applyingAs, materialId, materialName, targetStatus, JSON.stringify(formData), now, id, req.user.companyId);
    } else {
      // Insert new record
      const result = db.prepare(`
        INSERT INTO applications (company_id, user_id, category, applying_as, material_id, material_name, status, form_data, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(req.user.companyId, req.user.userId, category, applyingAs, materialId, materialName, targetStatus, JSON.stringify(formData), now, now);

      appId = result.lastInsertRowid;
    }

    res.json({
      message: targetStatus === 'SUBMITTED' ? 'Application submitted successfully' : 'Application saved as draft',
      id: appId,
      status: targetStatus,
    });
  } catch (error: any) {
    console.error('Save Application Error:', error);
    res.status(500).json({ error: error.message || 'Failed to save application' });
  }
}
