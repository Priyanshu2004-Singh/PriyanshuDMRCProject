import { Request, Response } from 'express';
import db from '../config/db';

export function getCivilMaterials(req: Request, res: Response) {
  try {
    const rows = db.prepare('SELECT * FROM civil_materials ORDER BY id ASC').all();
    const formatted = rows.map((r: any) => ({
      id: r.id,
      sno: r.sno,
      details: r.details,
      label: `${r.sno} – ${r.details}`,
    }));
    res.json(formatted);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch Civil materials' });
  }
}

export function getArcMaterials(req: Request, res: Response) {
  try {
    const rows = db.prepare('SELECT * FROM arc_materials ORDER BY id ASC').all();
    const formatted = rows.map((r: any) => ({
      id: r.id,
      sno: r.sno,
      workCategory: r.work_category,
      itemProduct: r.item_product,
      label: `${r.sno} – ${r.work_category} – ${r.item_product}`,
    }));
    res.json(formatted);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch Architectural materials' });
  }
}

export function getElectricalMaterials(req: Request, res: Response) {
  try {
    const rows = db.prepare('SELECT * FROM electrical_materials ORDER BY id ASC').all();
    const formatted = rows.map((r: any) => ({
      id: r.id,
      sno: r.sno,
      itemProduct: r.item_product,
      assignTo: r.assign_to,
      label: `${r.sno} – ${r.item_product}`,
    }));
    res.json(formatted);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch Electrical materials' });
  }
}
