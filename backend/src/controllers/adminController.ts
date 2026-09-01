import { Response } from 'express';
import db from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';

export function getAllApplications(req: AuthRequest, res: Response) {
  try {
    const rows = db.prepare(`
      SELECT a.*, c.company_name, c.email_id, c.gst_number, c.pan_number, c.contact_number
      FROM applications a
      JOIN companies c ON a.company_id = c.id
      ORDER BY a.updated_at DESC
    `).all();

    const formatted = rows.map((r: any) => ({
      id: r.id,
      companyId: r.company_id,
      companyName: r.company_name,
      companyEmail: r.email_id,
      gstNumber: r.gst_number,
      panNumber: r.pan_number,
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
    res.status(500).json({ error: 'Failed to fetch applications for admin' });
  }
}

export function updateApplicationStatus(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id;
    const { status, remarks } = req.body;

    if (!['EMPANELLED', 'UNDER_REVIEW', 'REJECTED', 'CLARIFICATION_NEEDED'].includes(status)) {
      res.status(400).json({ error: 'Invalid status value' });
      return;
    }

    const app: any = db.prepare('SELECT * FROM applications WHERE id = ?').get(id);
    if (!app) {
      res.status(404).json({ error: 'Application not found' });
      return;
    }

    const formData = JSON.parse(app.form_data);
    formData.adminRemarks = remarks || '';
    formData.adminReviewDate = new Date().toISOString();

    db.prepare(`
      UPDATE applications
      SET status = ?, form_data = ?, updated_at = ?
      WHERE id = ?
    `).run(status, JSON.stringify(formData), new Date().toISOString(), id);

    res.json({
      message: `Application status updated to ${status}`,
      id,
      status,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update application status' });
  }
}
