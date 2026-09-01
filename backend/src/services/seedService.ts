import db, { initDatabase } from '../config/db';
import bcrypt from 'bcryptjs';

export function seedDatabase() {
  initDatabase();

  // 1. Seed Civil Materials (C1 - C45)
  const civilCount = (db.prepare('SELECT COUNT(*) as count FROM civil_materials').get() as any).count;
  if (civilCount === 0) {
    const civilMaterials = [
      { sno: 'C1', details: 'CEMENT (OPC 43/53 Grade, PPC, PSC)' },
      { sno: 'C2', details: 'REINFORCEMENT STEEL (FE 500D / FE 550D TMT BARS)' },
      { sno: 'C3', details: 'STRUCTURAL STEEL (PLATES, SECTIONS, HOLLOW SECTIONS)' },
      { sno: 'C4', details: 'PRESTRESSING STEEL STRANDS (LRPC STRANDS)' },
      { sno: 'C5', details: 'CONCRETE ADMIXTURES (SUPERPLASTICIZERS, RETARDERS)' },
      { sno: 'C6', details: 'CONCRETE CURING COMPOUND' },
      { sno: 'C7', details: 'READY MIX CONCRETE (RMC)' },
      { sno: 'C8', details: 'MICRO SILICA / SILICA FUME' },
      { sno: 'C9', details: 'FLY ASH' },
      { sno: 'C10', details: 'GROUND GRANULATED BLAST FURNACE SLAG (GGBS)' },
      { sno: 'C11', details: 'POT PTFE BEARINGS' },
      { sno: 'C12', details: 'ELASTOMERIC BEARINGS' },
      { sno: 'C13', details: 'SPHERICAL BEARINGS' },
      { sno: 'C14', details: 'EXPANSION JOINTS (STRIP SEAL / MODULAR)' },
      { sno: 'C15', details: 'SHEARING STUDS / CONNECTIONS' },
      { sno: 'C16', details: 'HIGH STRENGTH FRICTION GRIP (HSFG) BOLTS' },
      { sno: 'C17', details: 'PRECAST SEGMENT COUPLERS & DOWELS' },
      { sno: 'C18', details: 'GROUTING MATERIAL (NON-SHRINK HIGH STRENGTH CEMENTITIOUS)' },
      { sno: 'C19', details: 'EPOXY GROUT FOR ANCHORS & BEARINGS' },
      { sno: 'C20', details: 'WATERPROOFING MEMBRANE (APP / SBS MODIFIED BITUMEN)' },
      { sno: 'C21', details: 'WATERPROOFING MEMBRANE (EPDM / TPO / PVC)' },
      { sno: 'C22', details: 'LIQUID APPLIED WATERPROOFING SYSTEM (POLYURETHANE / POLYUREA)' },
      { sno: 'C23', details: 'HIGH DENSITY POLYETHYLENE (HDPE) MEMBRANE FOR TUNNELS' },
      { sno: 'C24', details: 'GEOTEXTILE FABRIC' },
      { sno: 'C25', details: 'INTEGRAL CRYSTALLINE WATERPROOFING' },
      { sno: 'C26', details: 'PVC WATERSTOPS & HYDROPHILIC SWELLED WATERSTOPS' },
      { sno: 'C27', details: 'SHOTCRETE / SPRAYED CONCRETE ADMIXTURES' },
      { sno: 'C28', details: 'FIBER REINFORCED CONCRETE (STEEL / SYNTHETIC FIBERS)' },
      { sno: 'C29', details: 'TUNNEL LINING SEGMENT GASKETS (EPDM)' },
      { sno: 'C30', details: 'PACKER PIPE & BENTONITE CLAY POWDER FOR TBM BORE' },
      { sno: 'C31', details: 'FOAMING AGENT FOR TBM EXCAVATION' },
      { sno: 'C32', details: 'TAIL SEAL GREASE FOR TBM' },
      { sno: 'C33', details: 'MAIN BEARING GREASE FOR TBM' },
      { sno: 'C34', details: 'CHEMICAL ANCHORS & MECHANICAL EXPANSION ANCHORS' },
      { sno: 'C35', details: 'CARBON FIBER REINFORCED POLYMER (CFRP) WRAP / LAMINATES' },
      { sno: 'C36', details: 'STRUCTURAL REPAIR MORTAR (POLYMER MODIFIED CEMENTITIOUS)' },
      { sno: 'C37', details: 'ANTI-CARBONATION COATING FOR CONCRETE STRUCTURES' },
      { sno: 'C38', details: 'EPOXY BONDING AGENT FOR FRESH TO OLD CONCRETE' },
      { sno: 'C39', details: 'DRAINAGE CELL / GEOTECHNICAL DRAINAGE MAT' },
      { sno: 'C40', details: 'POLYPROPYLENE PIPES FOR SUBSURFACE DRAINAGE' },
      { sno: 'C41', details: 'NOISE BARRIERS (POLYCARBONATE / ALUMINUM ABSORPTIVE)' },
      { sno: 'C42', details: 'CRASH BARRIERS & W-BEAM METAL HIGHWAY GUARD RAILS' },
      { sno: 'C43', details: 'MICRO PILE CASINGS & DRILLING BITS' },
      { sno: 'C44', details: 'DRILLING POLYMER FOR BORED CAST-IN-SITU PILES' },
      { sno: 'C45', details: 'BENTONITE POWDER FOR PILING & DIAPHRAGM WALLS' }
    ];

    const insertCivil = db.prepare('INSERT INTO civil_materials (sno, details) VALUES (?, ?)');
    for (const item of civilMaterials) {
      insertCivil.run(item.sno, item.details);
    }
  }

  // 2. Seed Architectural Materials (A1 - A12 across categories, 61 items)
  const arcCount = (db.prepare('SELECT COUNT(*) as count FROM arc_materials').get() as any).count;
  if (arcCount === 0) {
    const arcMaterials = [
      // Flooring
      { sno: 'A1', work_category: 'Flooring', item_product: 'Heavy Duty Vitrified Tiles (Full Body / Technical)' },
      { sno: 'A1', work_category: 'Flooring', item_product: 'Granite Flooring & Skirting Slabs (Pre-polished)' },
      { sno: 'A1', work_category: 'Flooring', item_product: 'Tactile Tiles for Visually Impaired (Vitrified / Stainless Steel)' },
      { sno: 'A1', work_category: 'Flooring', item_product: 'Epoxy / Polyurethane Flooring System for Depot & Plant Rooms' },
      { sno: 'A1', work_category: 'Flooring', item_product: 'Kota Stone / Marble / Terrazzo Tile Flooring' },
      { sno: 'A1', work_category: 'Flooring', item_product: 'Raised Access Flooring System for OCC & Equipment Rooms' },

      // Finishing
      { sno: 'A2', work_category: 'Finishing', item_product: 'High Performance Anti-Vandal Exterior Acrylic Paint' },
      { sno: 'A2', work_category: 'Finishing', item_product: 'Low VOC Premium Emulsion Interior Wall Paint' },
      { sno: 'A2', work_category: 'Finishing', item_product: 'Textured Wall Finish & Mineral Plaster Coating' },
      { sno: 'A2', work_category: 'Finishing', item_product: 'Fluoropolymer (PVDF) Exterior Coating' },
      { sno: 'A2', work_category: 'Finishing', item_product: 'Intumescent Fire Retardant Paint Coating' },

      // Cladding
      { sno: 'A3', work_category: 'Cladding', item_product: 'Aluminum Composite Panels (ACP) - Fire Rated Class A2 / FR' },
      { sno: 'A3', work_category: 'Cladding', item_product: 'Vitreous Enamelled Steel (VES) Wall Panels' },
      { sno: 'A3', work_category: 'Cladding', item_product: 'High Pressure Laminate (HPL) Exterior / Interior Wall Cladding' },
      { sno: 'A3', work_category: 'Cladding', item_product: 'Dry Stone Cladding Fixing Systems & Stainless Steel Clamps' },
      { sno: 'A3', work_category: 'Cladding', item_product: 'Terracotta / Ceramic Exterior Louvers & Facade Panels' },

      // False Ceiling
      { sno: 'A4', work_category: 'False Ceiling', item_product: 'Perforated Aluminum Baffle / Strip Ceiling with Acoustic Fleece' },
      { sno: 'A4', work_category: 'False Ceiling', item_product: 'Lay-in Metal Tile Ceiling (Galvanized Steel / Aluminum)' },
      { sno: 'A4', work_category: 'False Ceiling', item_product: 'Calcium Silicate / Gypsum Acoustic False Ceiling Board' },
      { sno: 'A4', work_category: 'False Ceiling', item_product: 'Cellular / Open Grid Metal Ceiling' },
      { sno: 'A4', work_category: 'False Ceiling', item_product: 'Expanded Metal Mesh False Ceiling' },

      // Adhesives/Fillers/Sealants
      { sno: 'A5', work_category: 'Adhesives / Fillers / Sealants', item_product: 'Structural Silicone Sealant (1-Part / 2-Part)' },
      { sno: 'A5', work_category: 'Adhesives / Fillers / Sealants', item_product: 'Polyurethane Joint Sealant for Expansion Joints' },
      { sno: 'A5', work_category: 'Adhesives / Fillers / Sealants', item_product: 'High Polymer Modified Tile Adhesive (Class C2TE S1/S2)' },
      { sno: 'A5', work_category: 'Adhesives / Fillers / Sealants', item_product: 'Epoxy Grout for High Traffic Tile Joints' },
      { sno: 'A5', work_category: 'Adhesives / Fillers / Sealants', item_product: 'Fire Stop Acrylic & Silicone Sealant' },

      // Joinery Woodwork
      { sno: 'A6', work_category: 'Joinery Woodwork', item_product: 'Flush Doors with BWP Grade Plywood & Fire Retardant Core' },
      { sno: 'A6', work_category: 'Joinery Woodwork', item_product: 'Stainless Steel Frame Glass Partition & Doors' },
      { sno: 'A6', work_category: 'Joinery Woodwork', item_product: 'Heavy Duty Laminated Wooden Door Shutter & Frames' },
      { sno: 'A6', work_category: 'Joinery Woodwork', item_product: 'Modular Toilet Cubicle Partition System (Compact Laminate)' },

      // Fire Rated Doors
      { sno: 'A7', work_category: 'Fire Rated Doors', item_product: 'Hollow Metal Steel Fire Doors (120 Mins / 180 Mins Rated)' },
      { sno: 'A7', work_category: 'Fire Rated Doors', item_product: 'Fire Rated Glazed Doors & Windows with Intumescent Glass' },
      { sno: 'A7', work_category: 'Fire Rated Doors', item_product: 'Motorized Fire & Smoke Curtain Rolling Shutter' },

      // Plumbing
      { sno: 'A8', work_category: 'Plumbing', item_product: 'Commercial Heavy Duty Sanitaryware (Water Closets, Urinals, Wash Basins)' },
      { sno: 'A8', work_category: 'Plumbing', item_product: 'Sensor Operated Auto-Faucets & Auto-Flushing Valves' },
      { sno: 'A8', work_category: 'Plumbing', item_product: 'Stainless Steel Grab Bars & Disabled Access Toilet Fittings' },
      { sno: 'A8', work_category: 'Plumbing', item_product: 'Floor Drains with Stainless Steel Grating & Trap' },

      // Hardware
      { sno: 'A9', work_category: 'Hardware', item_product: 'Heavy Duty Overhead Door Closer (EN 1154 Certified)' },
      { sno: 'A9', work_category: 'Hardware', item_product: 'Panic Exit Hardware & Touch Bar for Fire Doors (UL / CE Listed)' },
      { sno: 'A9', work_category: 'Hardware', item_product: 'SS Grade 316 Mortise Locks & Lever Handles' },
      { sno: 'A9', work_category: 'Hardware', item_product: 'Continuous Stainless Steel Piano Hinges & Ball Bearing Hinges' },
      { sno: 'A9', work_category: 'Hardware', item_product: 'Floor Springs & Patch Fittings for Glass Doors' },

      // Pipes & Fittings
      { sno: 'A10', work_category: 'Pipes & Fittings', item_product: 'CPVC Pipes & Fittings for Hot & Cold Water Supply' },
      { sno: 'A10', work_category: 'Pipes & Fittings', item_product: 'PPR Triple Layer Anti-Microbial Pipes' },
      { sno: 'A10', work_category: 'Pipes & Fittings', item_product: 'Centrifugally Cast Iron (SML / Soil & Waste) Pipes & Fittings' },
      { sno: 'A10', work_category: 'Pipes & Fittings', item_product: 'HDPE Pipes & Electrofusion Fittings' },
      { sno: 'A10', work_category: 'Pipes & Fittings', item_product: 'GI Heavy Duty Pipes (IS 1239 / IS 3589)' },

      // Waterproofing
      { sno: 'A11', work_category: 'Waterproofing', item_product: 'Polyurethane Spray Applied Liquid Waterproofing Membrane for Roofs' },
      { sno: 'A11', work_category: 'Waterproofing', item_product: 'Pre-Applied HDPE Self-Adhesive Membrane for Substructures' },
      { sno: 'A11', work_category: 'Waterproofing', item_product: 'Acrylic Polymer Modified Cementitious Coating for Wet Areas' },
      { sno: 'A11', work_category: 'Waterproofing', item_product: 'Thermal Insulation Roof System (XPS Boards & Screed)' },

      // Metal & Roofing
      { sno: 'A12', work_category: 'Metal & Roofing', item_product: 'Standing Seam Aluminum Roofing Sheets (Zip Profile)' },
      { sno: 'A12', work_category: 'Metal & Roofing', item_product: 'Polycarbonate Solid & Multiwall Sheets for Roof Canopy' },
      { sno: 'A12', work_category: 'Metal & Roofing', item_product: 'Tensile Fabric Structure Membrane (PVDF Coated Polyester / PTFE)' },
      { sno: 'A12', work_category: 'Metal & Roofing', item_product: 'Stainless Steel Handrails & Balustrades (SS 316 Satin Finish)' },
      { sno: 'A12', work_category: 'Metal & Roofing', item_product: 'Structural Glazing Aluminum Extrusion Profiles' }
    ];

    const insertArc = db.prepare('INSERT INTO arc_materials (sno, work_category, item_product) VALUES (?, ?, ?)');
    for (const item of arcMaterials) {
      insertArc.run(item.sno, item.work_category, item.item_product);
    }
  }

  // 3. Seed Electrical Materials (E1 - E10)
  const elecCount = (db.prepare('SELECT COUNT(*) as count FROM electrical_materials').get() as any).count;
  if (elecCount === 0) {
    const electricalMaterials = [
      { sno: 'E1', item_product: '25 KV SINGLE PHASE DRY TYPE / OIL IMMERSED TRANSFORMERS', assign_to: 'ELECTRICAL_TRACTION' },
      { sno: 'E2', item_product: '33 KV / 11 KV HT SWITCHGEAR & GAS INSULATED SWITCHGEAR (GIS)', assign_to: 'POWER_SUPPLY' },
      { sno: 'E3', item_product: '25 KV FLEXIBLE OVERHEAD EQUIPMENT (OHE) CONDUCTORS & CATENARY WIRES', assign_to: 'OHE_TRACTION' },
      { sno: 'E4', item_product: '25 KV COMPOSITE / PORCELAIN INSULATORS', assign_to: 'OHE_TRACTION' },
      { sno: 'E5', item_product: '25 KV STJ / CABLE TERMINATIONS & JOINTING KITS', assign_to: 'CABLE_SYSTEMS' },
      { sno: 'E6', item_product: '110V / 220V DC BATTERY BANKS & BATTERY CHARGERS FOR SUBSTATIONS', assign_to: 'POWER_SUPPLY' },
      { sno: 'E7', item_product: 'LT PANEL BOARDS, MCCB, ACB & AUTOMATIC TRANSFER SWITCHES (ATS)', assign_to: 'E_AND_M' },
      { sno: 'E8', item_product: 'FRLSH / HF INSULATED POWER & CONTROL CABLES (XLPE / PVC)', assign_to: 'CABLE_SYSTEMS' },
      { sno: 'E9', item_product: 'ENERGY EFFICIENT LED STATION LIGHTING FIXTURES & FLOODLIGHTS', assign_to: 'E_AND_M' },
      { sno: 'E10', item_product: 'DIESEL GENERATOR (DG) SETS WITH ACOUSTIC ENCLOSURES (500 KVA - 2000 KVA)', assign_to: 'E_AND_M' }
    ];

    const insertElec = db.prepare('INSERT INTO electrical_materials (sno, item_product, assign_to) VALUES (?, ?, ?)');
    for (const item of electricalMaterials) {
      insertElec.run(item.sno, item.item_product, item.assign_to);
    }
  }

  // 4. Seed Default Admin User if not existing
  const adminCompany = db.prepare('SELECT id FROM companies WHERE email_id = ?').get('admin@dmrc.org') as any;
  let adminCompId = adminCompany?.id;
  if (!adminCompId) {
    const compResult = db.prepare(`
      INSERT INTO companies (
        company_name, business_structure, registered_address_street, registered_address_city,
        registered_address_state, registered_address_country, gst_number, gst_document,
        pan_number, pan_document, cin_number, cin_document, date_of_registration,
        contact_number, email_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'Delhi Metro Rail Corporation Ltd.', 'Public Limited Company', 'Metro Bhawan, Fire Brigade Lane, Barakhamba Road',
      'New Delhi', 'Delhi', 'India', '07AAACD9999A1Z1', '/uploads/sample_gst.pdf',
      'AAACD9999A', '/uploads/sample_pan.pdf', 'U60100DL1995GOI066597', '/uploads/sample_cin.pdf',
      '1995-05-03', '+911123417910', 'admin@dmrc.org'
    );
    adminCompId = compResult.lastInsertRowid;
  }

  const adminUser = db.prepare('SELECT id FROM users WHERE user_id = ?').get('DMRC-ADMIN-01');
  if (!adminUser) {
    const hashed = bcrypt.hashSync('admin123', 10);
    db.prepare(`
      INSERT INTO users (user_id, password_hash, company_id, role)
      VALUES (?, ?, ?, 'ADMIN')
    `).run('DMRC-ADMIN-01', hashed, adminCompId);
  }

  console.log('Database seeded successfully.');
}

if (require.main === module) {
  seedDatabase();
}
