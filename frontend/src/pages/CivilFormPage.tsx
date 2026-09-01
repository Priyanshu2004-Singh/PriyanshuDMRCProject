import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, Save, Send, ArrowLeft, CheckCircle2, AlertTriangle, FileText, HardHat } from 'lucide-react';
import api from '../services/api';
import { getFinancialYears } from '../utils/fyHelper';
import { ReadOnlyCompanyHeader } from '../components/ReadOnlyCompanyHeader';
import { FileUploadInput } from '../components/FileUploadInput';
import { ConfirmationModal } from '../components/ConfirmationModal';

export const CivilFormPage: React.FC<{ company: any }> = ({ company }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id && id !== 'new');

  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const financialYears = getFinancialYears(3);
  const fiveFinancialYears = getFinancialYears(5);
  const todayStr = new Date().toISOString().split('T')[0];

  // Civil Form State
  const [formData, setFormData] = useState<any>({
    // Section A
    applyingAs: 'MANUFACTURER',
    materialId: '',
    materialName: '',
    productTradeName: '',
    otherDetails: '',
    manufacturingUnits: [
      {
        address: '',
        location: '',
        certName: '',
        certPdf: '',
        certValidTill: '',
        landArea: '',
        landAreaUnit: 'Sq. Meters',
        coveredArea: '',
        coveredAreaUnit: 'Sq. Meters',
        licensedCapacity: '',
        licensedCapacityRate: 'per month',
        actualProduction: '',
        actualProductionRate: 'per month',
      },
    ],

    // Section B
    shareholdingPdf: '',
    boardOfDirectorsPdf: '',
    manufacturedInIndia: 'Yes',
    countryOfOrigin: '',
    techCataloguePdf: '',
    mfgDurationYears: '',
    orgChartPdf: '',
    manpowerPdf: '',
    keyManpowerPdf: '',

    // Section C
    approvals: [
      { agencyType: 'Metro Rail', agencyName: '', certPdf: '', certDate: '' },
      { agencyType: 'Railways / PSU', agencyName: '', certPdf: '', certDate: '' },
      { agencyType: 'State / Central Govt', agencyName: '', certPdf: '', certDate: '' },
    ],

    // Section D
    purchaseOrders: Array(2).fill(null).map(() => ({
      clientType: 'Metro / Railways',
      clientName: '',
      scopeOfWork: '',
      typeModel: '',
      quantity: '',
      quantityUnit: 'MT',
      valueLakhs: '',
      contractNumber: '',
      contractorName: '',
      workOrderPdf: '',
      completionCertPdf: '',
    })),
    completionCertificates: Array(2).fill(null).map(() => ({
      clientType: 'Govt. Infra',
      clientName: '',
      completionCertPdf: '',
    })),
    executedMetroWork: fiveFinancialYears.map((fy) => ({
      financialYear: fy,
      clientType: 'Metro / Railways',
      clientName: '',
      workOrderPdf: '',
    })),

    // Section E
    qualityPlanDetails: '',
    qualityPlanPdf: '',
    accreditationCertName: '',
    accreditationCertPdf: '',
    accreditationValidTill: '',
    referenceCodesText: '',
    referenceCodesPdf: '',
    inHouseTestingAccredited: 'Yes',
    inHouseTestingPdf: '',
    externalTestingConducted: 'No',
    externalTestingPdf: '',

    // Section F
    financials: financialYears.map((fy) => ({
      financialYear: fy,
      pnlStatementPdf: '',
      balanceSheetPdf: '',
    })),

    // Section G
    ocsStandardName: '',
    ocsLaboratoryName: '',
    ocsTestReportPdf: '',
    ocsIssuanceDate: '',

    // Section H
    undertakingA: 'Yes',
    undertakingBYears: '5',
    undertakingC: 'Yes',
    undertakingD: 'Yes',
    signedAnnexurePdf: '',
    undertakingE: 'Yes',
    undertakingF: 'Yes',
  });

  useEffect(() => {
    // Load Civil Materials
    api.get('/materials/civil').then((res) => {
      setMaterials(res.data);
      if (!isEdit && res.data.length > 0) {
        setFormData((prev: any) => ({
          ...prev,
          materialId: res.data[0].id.toString(),
          materialName: res.data[0].label,
        }));
      }
    });

    if (isEdit) {
      setLoading(true);
      api
        .get(`/applications/${id}`)
        .then((res) => {
          const app = res.data;
          setFormData(app.formData);
        })
        .catch((err) => setError('Failed to load application record.'))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const updateField = (field: string, val: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: val }));
  };

  const handleMaterialChange = (matId: string) => {
    const selected = materials.find((m) => m.id.toString() === matId);
    setFormData((prev: any) => ({
      ...prev,
      materialId: matId,
      materialName: selected ? selected.label : '',
    }));
  };

  // Section A: Manufacturing Unit Row Handlers
  const addMfgUnit = () => {
    setFormData((prev: any) => ({
      ...prev,
      manufacturingUnits: [
        ...prev.manufacturingUnits,
        {
          address: '',
          location: '',
          certName: '',
          certPdf: '',
          certValidTill: '',
          landArea: '',
          landAreaUnit: 'Sq. Meters',
          coveredArea: '',
          coveredAreaUnit: 'Sq. Meters',
          licensedCapacity: '',
          licensedCapacityRate: 'per month',
          actualProduction: '',
          actualProductionRate: 'per month',
        },
      ],
    }));
  };

  const removeMfgUnit = (index: number) => {
    if (formData.manufacturingUnits.length === 1) return;
    setFormData((prev: any) => ({
      ...prev,
      manufacturingUnits: prev.manufacturingUnits.filter((_: any, i: number) => i !== index),
    }));
  };

  // Section C: Approvals Handlers
  const addApproval = () => {
    setFormData((prev: any) => ({
      ...prev,
      approvals: [...prev.approvals, { agencyType: 'Central / State Govt', agencyName: '', certPdf: '', certDate: '' }],
    }));
  };

  const removeApproval = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      approvals: prev.approvals.filter((_: any, i: number) => i !== index),
    }));
  };

  // Validation before submission
  const validateSubmit = (): boolean => {
    setError('');

    if (!formData.materialId) {
      setError('Please select a Material/Item/Product from the Civil list.');
      return false;
    }

    if (!formData.productTradeName) {
      setError('Product Trade / Brand Name is required.');
      return false;
    }

    // Section C Rule: Min 3 approvals, 1 Metro/Railway
    if (formData.approvals.length < 3) {
      setError('Section C: Minimum 3 client approvals are required.');
      return false;
    }
    const hasMetroRailway = formData.approvals.some(
      (a: any) =>
        (a.agencyType && a.agencyType.toUpperCase().includes('METRO')) ||
        (a.agencyType && a.agencyType.toUpperCase().includes('RAILWAY')) ||
        (a.agencyName && a.agencyName.toUpperCase().includes('METRO')) ||
        (a.agencyName && a.agencyName.toUpperCase().includes('RAILWAY'))
    );
    if (!hasMetroRailway) {
      setError('Section C: At least 1 approval must be from a Metro Rail or Railway organization.');
      return false;
    }

    // Section G Rule: OCS Date <= 12 months old
    if (formData.ocsIssuanceDate) {
      const issueDate = new Date(formData.ocsIssuanceDate);
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
      if (issueDate < twelveMonthsAgo) {
        setError('Section G: DMRC OCS Test Certificate issuance date cannot be older than 12 months from today.');
        return false;
      }
    } else {
      setError('Section G: DMRC Outline Construction Specifications (OCS) Test Certificate issuance date is required.');
      return false;
    }

    return true;
  };

  const handleSave = async (status: 'DRAFT' | 'SUBMITTED') => {
    setLoading(true);
    setError('');

    try {
      const payload = {
        id: isEdit ? Number(id) : undefined,
        category: 'CIVIL',
        applyingAs: formData.applyingAs,
        materialId: Number(formData.materialId),
        materialName: formData.materialName,
        status,
        formData,
      };

      const res = await api.post('/applications/save', payload);
      setShowModal(false);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save application.');
      setShowModal(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Title Bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-dmrc-red transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1.5">
          <HardHat className="w-4 h-4 text-amber-700" />
          <span>Civil Material Empanelment Form</span>
        </span>
      </div>

      <ReadOnlyCompanyHeader company={company} />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
        {/* SECTION A: General Information */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 font-outfit uppercase border-b border-slate-100 pb-3 mb-6 flex items-center space-x-2">
            <span className="w-6 h-6 rounded bg-dmrc-red text-white text-xs flex items-center justify-center font-mono">A</span>
            <span>General Information</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs mb-6">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Applying As <span className="text-dmrc-red">*</span>
              </label>
              <select
                value={formData.applyingAs}
                onChange={(e) => updateField('applyingAs', e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none font-bold text-slate-800"
              >
                <option value="MANUFACTURER">MANUFACTURER</option>
                <option value="AUTHORISED RESELLER">AUTHORISED RESELLER</option>
                <option value="FABRICATOR">FABRICATOR</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Civil Material / Item / Product <span className="text-dmrc-red">*</span>
              </label>
              <select
                value={formData.materialId}
                onChange={(e) => handleMaterialChange(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none font-bold text-slate-800"
              >
                {materials.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Name of Item / Brand / Trade Name <span className="text-dmrc-red">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.productTradeName}
                onChange={(e) => updateField('productTradeName', e.target.value)}
                placeholder="e.g. Ultratech OPC 53 Grade / StructoGrout 100"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Other Specific Technical Details
              </label>
              <input
                type="text"
                value={formData.otherDetails}
                onChange={(e) => updateField('otherDetails', e.target.value)}
                placeholder="Specification references or model series"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none"
              />
            </div>
          </div>

          {/* Repeatable Manufacturing Units */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Manufacturing Unit(s) / Factory Locations</h3>
              <button
                type="button"
                onClick={addMfgUnit}
                className="flex items-center space-x-1 text-xs font-bold text-dmrc-red hover:underline"
              >
                <Plus className="w-4 h-4" />
                <span>Add Manufacturing Unit</span>
              </button>
            </div>

            {formData.manufacturingUnits.map((unit: any, idx: number) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-700 border-b pb-2">
                  <span>Factory Location #{idx + 1}</span>
                  {formData.manufacturingUnits.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMfgUnit(idx)}
                      className="text-slate-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block font-medium text-slate-600 mb-1">Factory Address</label>
                    <input
                      type="text"
                      value={unit.address}
                      onChange={(e) => {
                        const units = [...formData.manufacturingUnits];
                        units[idx].address = e.target.value;
                        updateField('manufacturingUnits', units);
                      }}
                      placeholder="Plot No., Industrial Area, City, State"
                      className="w-full px-3 py-2 bg-white border rounded-lg outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-600 mb-1">ISO / Factory Cert Name</label>
                    <input
                      type="text"
                      value={unit.certName}
                      onChange={(e) => {
                        const units = [...formData.manufacturingUnits];
                        units[idx].certName = e.target.value;
                        updateField('manufacturingUnits', units);
                      }}
                      placeholder="e.g. ISO 9001:2015"
                      className="w-full px-3 py-2 bg-white border rounded-lg outline-none"
                    />
                  </div>

                  <div>
                    <FileUploadInput
                      label="Factory License / Cert PDF"
                      value={unit.certPdf}
                      onChange={(path) => {
                        const units = [...formData.manufacturingUnits];
                        units[idx].certPdf = path;
                        updateField('manufacturingUnits', units);
                      }}
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-600 mb-1">Certificate Valid Till</label>
                    <input
                      type="date"
                      value={unit.certValidTill}
                      onChange={(e) => {
                        const units = [...formData.manufacturingUnits];
                        units[idx].certValidTill = e.target.value;
                        updateField('manufacturingUnits', units);
                      }}
                      className="w-full px-3 py-2 bg-white border rounded-lg outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-600 mb-1">Licensed Production Capacity</label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={unit.licensedCapacity}
                        onChange={(e) => {
                          const units = [...formData.manufacturingUnits];
                          units[idx].licensedCapacity = e.target.value;
                          updateField('manufacturingUnits', units);
                        }}
                        placeholder="Capacity"
                        className="w-full px-3 py-2 bg-white border rounded-lg outline-none"
                      />
                      <select
                        value={unit.licensedCapacityRate}
                        onChange={(e) => {
                          const units = [...formData.manufacturingUnits];
                          units[idx].licensedCapacityRate = e.target.value;
                          updateField('manufacturingUnits', units);
                        }}
                        className="px-2 py-2 bg-slate-100 border rounded-lg"
                      >
                        <option value="per month">/ month</option>
                        <option value="per year">/ year</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION B: Company Profile & Experience */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 font-outfit uppercase border-b border-slate-100 pb-3 mb-6 flex items-center space-x-2">
            <span className="w-6 h-6 rounded bg-dmrc-red text-white text-xs flex items-center justify-center font-mono">B</span>
            <span>Company Profile & Technical Experience</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <FileUploadInput
              label="Details of Share Holding Pattern PDF"
              value={formData.shareholdingPdf}
              onChange={(path) => updateField('shareholdingPdf', path)}
              required
            />

            <FileUploadInput
              label="Details of Board of Directors PDF"
              value={formData.boardOfDirectorsPdf}
              onChange={(path) => updateField('boardOfDirectorsPdf', path)}
              required
            />

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Is the product manufactured in India? <span className="text-dmrc-red">*</span>
              </label>
              <select
                value={formData.manufacturedInIndia}
                onChange={(e) => updateField('manufacturedInIndia', e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg font-bold"
              >
                <option value="Yes">Yes — Manufactured in India</option>
                <option value="No">No — Imported Item</option>
              </select>

              {formData.manufacturedInIndia === 'No' && (
                <input
                  type="text"
                  value={formData.countryOfOrigin}
                  onChange={(e) => updateField('countryOfOrigin', e.target.value)}
                  placeholder="Specify Country of Origin"
                  className="w-full mt-2 px-4 py-2.5 bg-white border border-slate-300 rounded-lg outline-none"
                />
              )}
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Manufacturing Experience Duration (Years)
              </label>
              <input
                type="number"
                min="0"
                value={formData.mfgDurationYears}
                onChange={(e) => updateField('mfgDurationYears', e.target.value)}
                placeholder="e.g. 10"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg font-bold outline-none"
              />
            </div>

            <FileUploadInput
              label="Technical Catalogue / Product Brochure PDF (Max 5MB)"
              value={formData.techCataloguePdf}
              onChange={(path) => updateField('techCataloguePdf', path)}
              required
            />

            <FileUploadInput
              label="Organisation Chart PDF"
              value={formData.orgChartPdf}
              onChange={(path) => updateField('orgChartPdf', path)}
            />

            <FileUploadInput
              label="Manpower Details PDF"
              value={formData.manpowerPdf}
              onChange={(path) => updateField('manpowerPdf', path)}
            />

            <FileUploadInput
              label="Key Manpower Qualification & Experience PDF"
              value={formData.keyManpowerPdf}
              onChange={(path) => updateField('keyManpowerPdf', path)}
            />
          </div>
        </div>

        {/* SECTION C: Approvals in Other Organisations */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-6">
            <h2 className="text-base font-bold text-slate-900 font-outfit uppercase flex items-center space-x-2">
              <span className="w-6 h-6 rounded bg-dmrc-red text-white text-xs flex items-center justify-center font-mono">C</span>
              <span>Approvals in Other Organisations</span>
            </h2>

            <button
              type="button"
              onClick={addApproval}
              className="flex items-center space-x-1 text-xs font-bold text-dmrc-red hover:underline"
            >
              <Plus className="w-4 h-4" />
              <span>Add Approval Row</span>
            </button>
          </div>

          <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs p-3.5 rounded-xl mb-4 font-medium">
            ⚠️ <strong>Validation Rule:</strong> Minimum 3 approvals required, at least 1 must be from a Metro Rail or Railways organization (issued within last 3 years).
          </div>

          <div className="space-y-4">
            {formData.approvals.map((app: any, idx: number) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-4 text-xs items-center">
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Agency Type</label>
                  <select
                    value={app.agencyType}
                    onChange={(e) => {
                      const apps = [...formData.approvals];
                      apps[idx].agencyType = e.target.value;
                      updateField('approvals', apps);
                    }}
                    className="w-full px-3 py-2 bg-white border rounded-lg font-bold"
                  >
                    <option value="Metro Rail">Metro Rail (DMRC / NCRTC / BMRCL etc.)</option>
                    <option value="Railways / PSU">Indian Railways / RITES / IRCON</option>
                    <option value="State / Central Govt">Central / State Govt. Infrastructure</option>
                    <option value="Private Infrastructure">Private Major Infrastructure</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-600 mb-1">Agency Name</label>
                  <input
                    type="text"
                    value={app.agencyName}
                    onChange={(e) => {
                      const apps = [...formData.approvals];
                      apps[idx].agencyName = e.target.value;
                      updateField('approvals', apps);
                    }}
                    placeholder="e.g. NHAI / CPWD / DMRC"
                    className="w-full px-3 py-2 bg-white border rounded-lg outline-none font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-600 mb-1">Certificate Date</label>
                  <input
                    type="date"
                    value={app.certDate}
                    onChange={(e) => {
                      const apps = [...formData.approvals];
                      apps[idx].certDate = e.target.value;
                      updateField('approvals', apps);
                    }}
                    className="w-full px-3 py-2 bg-white border rounded-lg outline-none"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex-grow">
                    <FileUploadInput
                      label="Approval Cert PDF"
                      value={app.certPdf}
                      onChange={(path) => {
                        const apps = [...formData.approvals];
                        apps[idx].certPdf = path;
                        updateField('approvals', apps);
                      }}
                    />
                  </div>
                  {formData.approvals.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeApproval(idx)}
                      className="text-slate-400 hover:text-red-600 p-1 mt-4"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION D: Experience Providing the Material */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 font-outfit uppercase border-b border-slate-100 pb-3 flex items-center space-x-2">
            <span className="w-6 h-6 rounded bg-dmrc-red text-white text-xs flex items-center justify-center font-mono">D</span>
            <span>Experience Providing the Material (Last 5 Years)</span>
          </h2>

          {/* PO Rows */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Purchase Orders / Work Orders (Up to 5)</h3>
            {formData.purchaseOrders.map((po: any, idx: number) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3 text-xs">
                <div className="font-bold text-slate-700 border-b pb-1">Order #{idx + 1}</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={po.clientName}
                    onChange={(e) => {
                      const pos = [...formData.purchaseOrders];
                      pos[idx].clientName = e.target.value;
                      updateField('purchaseOrders', pos);
                    }}
                    placeholder="Client Name (e.g. L&T Construction)"
                    className="px-3 py-2 bg-white border rounded-lg outline-none"
                  />
                  <input
                    type="text"
                    value={po.contractNumber}
                    onChange={(e) => {
                      const pos = [...formData.purchaseOrders];
                      pos[idx].contractNumber = e.target.value;
                      updateField('purchaseOrders', pos);
                    }}
                    placeholder="Contract / PO Number"
                    className="px-3 py-2 bg-white border rounded-lg outline-none font-mono"
                  />
                  <input
                    type="text"
                    value={po.valueLakhs}
                    onChange={(e) => {
                      const pos = [...formData.purchaseOrders];
                      pos[idx].valueLakhs = e.target.value;
                      updateField('purchaseOrders', pos);
                    }}
                    placeholder="Total Value (₹ Lakhs)"
                    className="px-3 py-2 bg-white border rounded-lg outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FileUploadInput
                    label="Work Order PDF"
                    value={po.workOrderPdf}
                    onChange={(path) => {
                      const pos = [...formData.purchaseOrders];
                      pos[idx].workOrderPdf = path;
                      updateField('purchaseOrders', pos);
                    }}
                  />
                  <FileUploadInput
                    label="Completion Cert PDF"
                    value={po.completionCertPdf}
                    onChange={(path) => {
                      const pos = [...formData.purchaseOrders];
                      pos[idx].completionCertPdf = path;
                      updateField('purchaseOrders', pos);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION E: Quality Plan & Certification */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 font-outfit uppercase border-b border-slate-100 pb-3 flex items-center space-x-2">
            <span className="w-6 h-6 rounded bg-dmrc-red text-white text-xs flex items-center justify-center font-mono">E</span>
            <span>Quality Assurance & Lab Testing Certification</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">Quality Plan Details</label>
              <textarea
                rows={3}
                value={formData.qualityPlanDetails}
                onChange={(e) => updateField('qualityPlanDetails', e.target.value)}
                placeholder="Brief write-up of QA/QC procedures, inspection standard..."
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg outline-none"
              />
            </div>

            <FileUploadInput
              label="Quality Assurance Plan (QAP) Document PDF"
              value={formData.qualityPlanPdf}
              onChange={(path) => updateField('qualityPlanPdf', path)}
              required
            />

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                BIS / IGBC / NABL Accreditation Name
              </label>
              <input
                type="text"
                value={formData.accreditationCertName}
                onChange={(e) => updateField('accreditationCertName', e.target.value)}
                placeholder="e.g. IS 12269:2013 / NABL ISO/IEC 17025"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none font-semibold"
              />
            </div>

            <FileUploadInput
              label="Accreditation / Lab Test Report PDF"
              value={formData.accreditationCertPdf}
              onChange={(path) => updateField('accreditationCertPdf', path)}
            />
          </div>
        </div>

        {/* SECTION F: Financial Data */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 font-outfit uppercase border-b border-slate-100 pb-3 mb-6 flex items-center space-x-2">
            <span className="w-6 h-6 rounded bg-dmrc-red text-white text-xs flex items-center justify-center font-mono">F</span>
            <span>Financial Statements (Last 3 Financial Years)</span>
          </h2>

          <div className="space-y-4">
            {formData.financials.map((fin: any, idx: number) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4 text-xs items-center">
                <div className="font-bold text-slate-900 text-sm">
                  Financial Year: <span className="text-dmrc-red font-mono">{fin.financialYear}</span>
                </div>

                <FileUploadInput
                  label="Audited Profit & Loss Statement PDF"
                  value={fin.pnlStatementPdf}
                  onChange={(path) => {
                    const fins = [...formData.financials];
                    fins[idx].pnlStatementPdf = path;
                    updateField('financials', fins);
                  }}
                  required
                />

                <FileUploadInput
                  label="Audited Balance Sheet PDF"
                  value={fin.balanceSheetPdf}
                  onChange={(path) => {
                    const fins = [...formData.financials];
                    fins[idx].balanceSheetPdf = path;
                    updateField('financials', fins);
                  }}
                  required
                />
              </div>
            ))}
          </div>
        </div>

        {/* SECTION G: Compliance with DMRC Outline Construction Specifications (OCS) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 font-outfit uppercase border-b border-slate-100 pb-3 flex items-center space-x-2">
            <span className="w-6 h-6 rounded bg-dmrc-red text-white text-xs flex items-center justify-center font-mono">G</span>
            <span>DMRC Outline Construction Specifications (OCS) Compliance</span>
          </h2>

          <div className="bg-red-50 border border-red-200 text-red-800 text-xs p-3.5 rounded-xl font-medium">
            ⚠️ <strong>Date Constraint Rule:</strong> Test certificate issuance date <strong>must not be older than 12 months</strong> from today.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Standard / Code Name <span className="text-dmrc-red">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.ocsStandardName}
                onChange={(e) => updateField('ocsStandardName', e.target.value)}
                placeholder="e.g. DMRC OCS Civil Clause 4.2"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Testing Laboratory Name <span className="text-dmrc-red">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.ocsLaboratoryName}
                onChange={(e) => updateField('ocsLaboratoryName', e.target.value)}
                placeholder="NABL Accredited Test Lab Name"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Test Certificate Issuance Date <span className="text-dmrc-red">*</span>
              </label>
              <input
                type="date"
                required
                max={todayStr}
                value={formData.ocsIssuanceDate}
                onChange={(e) => updateField('ocsIssuanceDate', e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none font-bold text-slate-900"
              />
            </div>

            <FileUploadInput
              label="OCS Test Report / Certificate PDF"
              value={formData.ocsTestReportPdf}
              onChange={(path) => updateField('ocsTestReportPdf', path)}
              required
            />
          </div>
        </div>

        {/* SECTION H: Undertakings */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 text-xs">
          <h2 className="text-base font-bold text-slate-900 font-outfit uppercase border-b border-slate-100 pb-3 flex items-center space-x-2">
            <span className="w-6 h-6 rounded bg-dmrc-red text-white text-xs flex items-center justify-center font-mono">H</span>
            <span>Undertakings & Statutory Compliance</span>
          </h2>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border">
              <span>a. Application manufactured per relevant BIS / International standards</span>
              <select
                value={formData.undertakingA}
                onChange={(e) => updateField('undertakingA', e.target.value)}
                className="font-bold border rounded px-2 py-1"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border">
              <span>b. Product proven in service for minimum duration (years)</span>
              <input
                type="number"
                value={formData.undertakingBYears}
                onChange={(e) => updateField('undertakingBYears', e.target.value)}
                className="w-20 font-bold border rounded px-2 py-1"
              />
            </div>

            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border">
              <span>c. Commitment to provide lifetime technical support for DMRC projects</span>
              <select
                value={formData.undertakingC}
                onChange={(e) => updateField('undertakingC', e.target.value)}
                className="font-bold border rounded px-2 py-1"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border space-y-2">
              <div className="flex items-center justify-between">
                <span>d. Will comply with DMRC Vendor Policy incl. Annexures A/B/C/D/E</span>
                <select
                  value={formData.undertakingD}
                  onChange={(e) => updateField('undertakingD', e.target.value)}
                  className="font-bold border rounded px-2 py-1"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {formData.undertakingD === 'Yes' && (
                <FileUploadInput
                  label="Signed DMRC Annexures Undertaking PDF"
                  value={formData.signedAnnexurePdf}
                  onChange={(path) => updateField('signedAnnexurePdf', path)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => handleSave('DRAFT')}
              disabled={loading}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center space-x-2 uppercase tracking-wider"
            >
              <Save className="w-4 h-4" />
              <span>Save as Draft</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (validateSubmit()) {
                  setShowModal(true);
                }
              }}
              disabled={loading}
              className="px-8 py-3 bg-dmrc-red hover:bg-dmrc-darkRed text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center space-x-2 uppercase tracking-wider"
            >
              <Send className="w-4 h-4" />
              <span>Submit Application</span>
            </button>
          </div>
        </div>
      </form>

      <ConfirmationModal
        isOpen={showModal}
        title="Confirm Civil Empanelment Submission"
        confirmText="Confirm & Submit Application"
        onConfirm={() => handleSave('SUBMITTED')}
        onCancel={() => setShowModal(false)}
        loading={loading}
      />
    </div>
  );
};
