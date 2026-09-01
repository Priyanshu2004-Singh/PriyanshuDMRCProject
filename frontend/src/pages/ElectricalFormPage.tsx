import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, Save, Send, ArrowLeft, Zap, ShieldCheck, FileText, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { getFinancialYears, getCurrentFinancialYear } from '../utils/fyHelper';
import { ReadOnlyCompanyHeader } from '../components/ReadOnlyCompanyHeader';
import { FileUploadInput } from '../components/FileUploadInput';
import { ConfirmationModal } from '../components/ConfirmationModal';

export const ElectricalFormPage: React.FC<{ company: any }> = ({ company }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id && id !== 'new');

  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const financialYears = getFinancialYears(3);
  const tenYears = getFinancialYears(10);
  const currentFy = getCurrentFinancialYear();

  // Electrical Form State (13 Sections)
  const [formData, setFormData] = useState<any>({
    // Sec A: General Info
    applyingAs: 'MANUFACTURER', // MANUFACTURER or AUTHORISED RESELLER
    materialId: '',
    materialName: '',
    capacityValue: '',
    capacityUnit: 'MVA',
    ratingValue: '',
    ratingUnit: 'kV',
    productModelSeries: '',

    // Sec B: Manufacturing & In-House Facilities
    neighbouringCountryOrderNotice: true,
    machineryWriteup: '',
    machineryPdf: '',
    designFacility: 'Yes',
    designFacilityDetails: '',
    designFacilityPdf: '',
    testingFacility: 'Yes',
    testingFacilityDetails: '',
    testingFacilityPdf: '',
    rdFacility: 'Yes',
    rdFacilityDetails: '',
    rdFacilityPdf: '',

    // Sec C: Experience (Last 10 Yrs)
    parentCompanyGuaranteeNote: true,
    purchaseOrders: Array(2).fill(null).map(() => ({
      clientType: 'Metro',
      clientName: '',
      scopeOfWork: '',
      quantity: '',
      quantityUnit: 'Nos',
      contractNumber: '',
      workOrderPdf: '',
      performanceCertPdf: '',
    })),
    dmrcSuppliedProjects: [
      { projectLine: 'Delhi Metro Line-1 (Red Line)', suppliedQty: '', workOrderPdf: '' },
    ],
    otherSuppliedProjects: [
      { projectType: 'Metro', projectName: 'RRTS / Regional Rapid Transit', scope: '', workOrderPdf: '' },
    ],
    blacklistingCheck: 'No',
    blacklistedBy: '',
    blacklistingReason: '',
    blacklistingDate: '',
    litigationCheck: 'No',
    litigationAgency: '',
    litigationReason: '',
    litigationDate: '',

    // Sec D: Quality & Green Measures
    ghgMeasuresWriteup: '',
    ghgMeasuresPdf: '',
    recycleMeasuresWriteup: '',
    recycleMeasuresPdf: '',
    inHouseTestingQ1: 'Yes',
    inHouseTestingQ1Pdf: '',
    inHouseTestingQ2: 'Yes',
    inHouseTestingQ2Pdf: '',

    // Sec E: Financial Data
    netWorthValue: '',
    netWorthCurrency: 'INR',
    netWorthPdf: '',
    financials: financialYears.map((fy) => ({
      financialYear: fy,
      profitOrLoss: '',
      revenue: '',
      turnover: '',
      annualReportPdf: '',
      balanceSheetPdf: '',
    })),
    currentYearLiquidity: '',
    currentYearLiquidityFy: currentFy,
    solvencyBankName: '',
    solvencyCertPdf: '',
    solvencyIssuanceDate: '',

    // Sec F: Type Test Certificates
    typeTestGate: 'Yes',
    typeTestLabName: '',
    typeTestCertPdf: '',
    typeTestValidityDate: '',
    typeTestAccreditedLab: 'Yes',
    typeTestProposedModel: 'Yes',
    typeTestRelevantStandard: 'Yes',
    typeTestLessThanFiveYears: 'Yes',

    // Sec G: After Sales Service
    ncrSupportCenters: [{ address: '', contactPerson: '', phone: '', supportPdf: '' }],
    roiSupportCenters: [{ regionState: 'Maharashtra', address: '', phone: '', supportPdf: '' }],

    // Sec H: Undertakings
    undertakingA: 'Yes',
    undertakingB: 'Yes',
    undertakingC: 'Yes',
    undertakingDVendorWarranteePdf: '',
    undertakingDTripartitePdf: '',
    undertakingE: 'Yes',
    undertakingF: 'Yes',
    undertakingG25kVOheEmiEfect: 'Not Applicable', // Yes, No, Not Applicable
    undertakingGReportPdf: '',
    undertakingH: 'Yes',
  });

  useEffect(() => {
    api.get('/materials/electrical').then((res) => {
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
        .then((res) => setFormData(res.data.formData))
        .catch((err) => setError('Failed to load Electrical application record.'))
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

  const handleSave = async (status: 'DRAFT' | 'SUBMITTED') => {
    setLoading(true);
    setError('');

    try {
      const payload = {
        id: isEdit ? Number(id) : undefined,
        category: 'ELECTRICAL',
        applyingAs: formData.applyingAs,
        materialId: Number(formData.materialId),
        materialName: formData.materialName,
        status,
        formData,
      };

      await api.post('/applications/save', payload);
      setShowModal(false);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save Electrical application.');
      setShowModal(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-dmrc-red transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <span className="bg-blue-100 text-blue-900 border border-blue-300 text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1.5">
          <Zap className="w-4 h-4 text-blue-700" />
          <span>Electrical Systems Empanelment Form</span>
        </span>
      </div>

      <ReadOnlyCompanyHeader company={company} />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
        {/* SEC A: General Info */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 font-outfit uppercase border-b border-slate-100 pb-3 mb-6 flex items-center space-x-2">
            <span className="w-6 h-6 rounded bg-dmrc-red text-white text-xs flex items-center justify-center font-mono">A</span>
            <span>General Electrical Product Information</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Applying As <span className="text-dmrc-red">*</span>
              </label>
              <select
                value={formData.applyingAs}
                onChange={(e) => updateField('applyingAs', e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg font-bold"
              >
                <option value="MANUFACTURER">MANUFACTURER</option>
                <option value="AUTHORISED RESELLER">AUTHORISED RESELLER</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Electrical Material / System <span className="text-dmrc-red">*</span>
              </label>
              <select
                value={formData.materialId}
                onChange={(e) => handleMaterialChange(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg font-bold"
              >
                {materials.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">Capacity</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={formData.capacityValue}
                  onChange={(e) => updateField('capacityValue', e.target.value)}
                  placeholder="Capacity Value (e.g. 500)"
                  className="w-full px-3 py-2 bg-slate-50 border rounded-lg outline-none font-semibold"
                />
                <input
                  type="text"
                  value={formData.capacityUnit}
                  onChange={(e) => updateField('capacityUnit', e.target.value)}
                  placeholder="Unit"
                  className="w-24 px-3 py-2 bg-slate-100 border rounded-lg font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">Rating</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={formData.ratingValue}
                  onChange={(e) => updateField('ratingValue', e.target.value)}
                  placeholder="Rating Value (e.g. 25)"
                  className="w-full px-3 py-2 bg-slate-50 border rounded-lg outline-none font-semibold"
                />
                <input
                  type="text"
                  value={formData.ratingUnit}
                  onChange={(e) => updateField('ratingUnit', e.target.value)}
                  placeholder="Unit"
                  className="w-24 px-3 py-2 bg-slate-100 border rounded-lg font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SEC B: Manufacturing & In-House Facilities */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 font-outfit uppercase border-b border-slate-100 pb-3 flex items-center space-x-2">
            <span className="w-6 h-6 rounded bg-dmrc-red text-white text-xs flex items-center justify-center font-mono">B</span>
            <span>Manufacturing Facility & Compliance Notice</span>
          </h2>

          <div className="bg-slate-900 text-white p-4 rounded-xl text-xs space-y-1">
            <div className="font-bold text-dmrc-gold flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Inline Compliance Notice — Order on Public Procurement with Neighbouring Countries</span>
            </div>
            <p className="text-slate-300">
              The manufacturing unit must strictly comply with Govt. of India Public Procurement Orders regarding land border sharing countries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Brief Write-up of Machinery & Facilities
              </label>
              <textarea
                rows={3}
                value={formData.machineryWriteup}
                onChange={(e) => updateField('machineryWriteup', e.target.value)}
                placeholder="Details of CNC, testing rigs, automated assembly..."
                className="w-full p-3 bg-slate-50 border rounded-lg outline-none"
              />
            </div>

            <FileUploadInput
              label="Supporting Machinery & Factory Plant PDF"
              value={formData.machineryPdf}
              onChange={(path) => updateField('machineryPdf', path)}
            />
          </div>

          {/* In-House Design / Testing / R&D Toggles */}
          <div className="space-y-4 pt-4 border-t border-slate-100 text-xs">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider">In-House Design, Testing & R&D Capability Toggles</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">In-House Design Facility?</span>
                  <select
                    value={formData.designFacility}
                    onChange={(e) => updateField('designFacility', e.target.value)}
                    className="font-bold border rounded px-2 py-1"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                {formData.designFacility === 'Yes' && (
                  <FileUploadInput
                    label="Design Cert / Software PDF"
                    value={formData.designFacilityPdf}
                    onChange={(path) => updateField('designFacilityPdf', path)}
                  />
                )}
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">In-House Testing Lab?</span>
                  <select
                    value={formData.testingFacility}
                    onChange={(e) => updateField('testingFacility', e.target.value)}
                    className="font-bold border rounded px-2 py-1"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                {formData.testingFacility === 'Yes' && (
                  <FileUploadInput
                    label="Testing Lab Layout PDF"
                    value={formData.testingFacilityPdf}
                    onChange={(path) => updateField('testingFacilityPdf', path)}
                  />
                )}
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">In-House R&D Facility?</span>
                  <select
                    value={formData.rdFacility}
                    onChange={(e) => updateField('rdFacility', e.target.value)}
                    className="font-bold border rounded px-2 py-1"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                {formData.rdFacility === 'Yes' && (
                  <FileUploadInput
                    label="R&D Recognition PDF"
                    value={formData.rdFacilityPdf}
                    onChange={(path) => updateField('rdFacilityPdf', path)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SEC C: Experience, Blacklisting & Litigation Checks */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 font-outfit uppercase border-b border-slate-100 pb-3 flex items-center space-x-2">
            <span className="w-6 h-6 rounded bg-dmrc-red text-white text-xs flex items-center justify-center font-mono">C</span>
            <span>Electrical Supply Experience, Blacklisting & Litigation Checks (Last 10 Years)</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Blacklisting Check */}
            <div className="bg-slate-50 border p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Has company been blacklisted in last 3 years?</span>
                <select
                  value={formData.blacklistingCheck}
                  onChange={(e) => updateField('blacklistingCheck', e.target.value)}
                  className="font-bold border rounded px-2 py-1"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>

              {formData.blacklistingCheck === 'Yes' && (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={formData.blacklistedBy}
                    onChange={(e) => updateField('blacklistedBy', e.target.value)}
                    placeholder="Blacklisted by Agency Name"
                    className="w-full px-3 py-2 bg-white border rounded outline-none"
                  />
                  <input
                    type="text"
                    value={formData.blacklistingReason}
                    onChange={(e) => updateField('blacklistingReason', e.target.value)}
                    placeholder="Reason for blacklisting"
                    className="w-full px-3 py-2 bg-white border rounded outline-none"
                  />
                </div>
              )}
            </div>

            {/* Litigation Check */}
            <div className="bg-slate-50 border p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Any active litigation/arbitration in last 3 years?</span>
                <select
                  value={formData.litigationCheck}
                  onChange={(e) => updateField('litigationCheck', e.target.value)}
                  className="font-bold border rounded px-2 py-1"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>

              {formData.litigationCheck === 'Yes' && (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={formData.litigationAgency}
                    onChange={(e) => updateField('litigationAgency', e.target.value)}
                    placeholder="Agency / Court Name"
                    className="w-full px-3 py-2 bg-white border rounded outline-none"
                  />
                  <input
                    type="text"
                    value={formData.litigationReason}
                    onChange={(e) => updateField('litigationReason', e.target.value)}
                    placeholder="Nature of Dispute"
                    className="w-full px-3 py-2 bg-white border rounded outline-none"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SEC E: Financial Data */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 font-outfit uppercase border-b border-slate-100 pb-3 flex items-center space-x-2">
            <span className="w-6 h-6 rounded bg-dmrc-red text-white text-xs flex items-center justify-center font-mono">E</span>
            <span>Electrical Financial Qualifications & Solvency</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Company Net Worth</label>
              <input
                type="text"
                value={formData.netWorthValue}
                onChange={(e) => updateField('netWorthValue', e.target.value)}
                placeholder="Net worth in ₹ Lakhs"
                className="w-full px-3 py-2.5 bg-slate-50 border rounded-lg outline-none font-bold"
              />
            </div>

            <FileUploadInput
              label="Net Worth Certificate PDF"
              value={formData.netWorthPdf}
              onChange={(path) => updateField('netWorthPdf', path)}
              required
            />

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Current Year Liquidity</label>
              <input
                type="text"
                value={formData.currentYearLiquidity}
                onChange={(e) => updateField('currentYearLiquidity', e.target.value)}
                placeholder={`Liquidity for FY ${formData.currentYearLiquidityFy}`}
                className="w-full px-3 py-2.5 bg-slate-50 border rounded-lg outline-none font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs border-t pt-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Solvency Bank Name</label>
              <input
                type="text"
                value={formData.solvencyBankName}
                onChange={(e) => updateField('solvencyBankName', e.target.value)}
                placeholder="e.g. State Bank of India"
                className="w-full px-3 py-2.5 bg-slate-50 border rounded-lg outline-none font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Solvency Issuance Date</label>
              <input
                type="date"
                value={formData.solvencyIssuanceDate}
                onChange={(e) => updateField('solvencyIssuanceDate', e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border rounded-lg outline-none"
              />
            </div>

            <FileUploadInput
              label="Bank Solvency Certificate PDF"
              value={formData.solvencyCertPdf}
              onChange={(path) => updateField('solvencyCertPdf', path)}
              required
            />
          </div>
        </div>

        {/* SEC F: Type Test Certificates */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 font-outfit uppercase border-b border-slate-100 pb-3 flex items-center space-x-2">
            <span className="w-6 h-6 rounded bg-dmrc-red text-white text-xs flex items-center justify-center font-mono">F</span>
            <span>Type Test Certificates (Mandatory Gate)</span>
          </h2>

          <div className="bg-slate-50 border p-4 rounded-xl text-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">Do you possess Type Test Certificates for the proposed model?</span>
              <select
                value={formData.typeTestGate}
                onChange={(e) => updateField('typeTestGate', e.target.value)}
                className="font-bold border rounded px-3 py-1 bg-white"
              >
                <option value="Yes">Yes — Type Tested</option>
                <option value="No">No</option>
              </select>
            </div>

            {formData.typeTestGate === 'Yes' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <input
                  type="text"
                  value={formData.typeTestLabName}
                  onChange={(e) => updateField('typeTestLabName', e.target.value)}
                  placeholder="Testing Lab (e.g. CPRI / ERDA)"
                  className="px-3 py-2 bg-white border rounded outline-none font-semibold"
                />
                <input
                  type="date"
                  value={formData.typeTestValidityDate}
                  onChange={(e) => updateField('typeTestValidityDate', e.target.value)}
                  className="px-3 py-2 bg-white border rounded outline-none"
                />
                <FileUploadInput
                  label="Type Test Report PDF"
                  value={formData.typeTestCertPdf}
                  onChange={(path) => updateField('typeTestCertPdf', path)}
                  required
                />
              </div>
            )}
          </div>
        </div>

        {/* SEC H: Electrical Undertakings & 25kV OHE EMI/EMC Check */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 text-xs">
          <h2 className="text-base font-bold text-slate-900 font-outfit uppercase border-b border-slate-100 pb-3 flex items-center space-x-2">
            <span className="w-6 h-6 rounded bg-dmrc-red text-white text-xs flex items-center justify-center font-mono">H</span>
            <span>Undertakings & 25kV OHE EMI/EMC Declaration</span>
          </h2>

          <div className="bg-slate-50 p-4 rounded-xl border space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">
                (g) Effect of 25kV single-phase AC traction OHE on product EMI/EMC performance?
              </span>
              <select
                value={formData.undertakingG25kVOheEmiEfect}
                onChange={(e) => updateField('undertakingG25kVOheEmiEfect', e.target.value)}
                className="font-bold border rounded px-2 py-1 bg-white"
              >
                <option value="Not Applicable">Not Applicable</option>
                <option value="Yes">Yes — Studied & Tested</option>
                <option value="No">No</option>
              </select>
            </div>

            {formData.undertakingG25kVOheEmiEfect === 'Yes' && (
              <FileUploadInput
                label="EMI / EMC Compatibility Test Report PDF"
                value={formData.undertakingGReportPdf}
                onChange={(path) => updateField('undertakingGReportPdf', path)}
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FileUploadInput
              label="Vendor Warrantee Undertaking PDF"
              value={formData.undertakingDVendorWarranteePdf}
              onChange={(path) => updateField('undertakingDVendorWarranteePdf', path)}
              required
            />
            <FileUploadInput
              label="Tripartite Agreement PDF (if foreign OEM)"
              value={formData.undertakingDTripartitePdf}
              onChange={(path) => updateField('undertakingDTripartitePdf', path)}
            />
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
              onClick={() => setShowModal(true)}
              disabled={loading}
              className="px-8 py-3 bg-dmrc-red hover:bg-dmrc-darkRed text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center space-x-2 uppercase tracking-wider"
            >
              <Send className="w-4 h-4" />
              <span>Submit Electrical Application</span>
            </button>
          </div>
        </div>
      </form>

      <ConfirmationModal
        isOpen={showModal}
        title="Confirm Electrical Empanelment Submission"
        confirmText="Confirm & Submit Electrical Form"
        onConfirm={() => handleSave('SUBMITTED')}
        onCancel={() => setShowModal(false)}
        loading={loading}
      />
    </div>
  );
};
