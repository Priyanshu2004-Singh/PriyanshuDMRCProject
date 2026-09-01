import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, Save, Send, ArrowLeft, Compass, ShieldCheck, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import { ReadOnlyCompanyHeader } from '../components/ReadOnlyCompanyHeader';
import { FileUploadInput } from '../components/FileUploadInput';
import { ConfirmationModal } from '../components/ConfirmationModal';

export const ArchitectureFormPage: React.FC<{ company: any }> = ({ company }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id && id !== 'new');

  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Architecture Form State (4 Sections)
  const [formData, setFormData] = useState<any>({
    // Sec A: General Info
    applyingAs: 'MANUFACTURER',
    materialId: '',
    materialName: '',
    mfgPeriodYears: '',
    producedInIndia: 'Yes',
    countryOfOrigin: '',
    productionCapacityValue: '',
    productionCapacityUnit: 'Sq. Meters / Month',
    expectedLifespanYears: '25',

    // Sec B: Qualifying Criteria
    isCodes: [{ codeName: 'IS 15622:2017', pdfPath: '', validTill: '' }],
    internationalCodes: [{ codeName: 'BS EN 14411', pdfPath: '', validTill: '' }],
    nablAccredited: 'Yes',
    nablLabName: '',
    nablTestName: '',
    nablCertPdf: '',
    nablTestPdf: '',
    otherIntlCert: 'No',
    otherIntlLabName: '',
    otherIntlPdf: '',
    isoCertified: 'Yes',
    isoCertPdf: '',
    isoValidTill: '',

    // Sec C: Additional Information & Projects
    greenCertified: 'Yes',
    greenOrgName: 'IGBC Green Building Council',
    greenCertPdf: '',
    greenValidTill: '',
    govtPsuRegistered: 'Yes',
    govtPsuOrgName: 'CPWD / NBCC',
    govtPsuCertPdf: '',
    govtPsuValidTill: '',
    projects: [
      {
        contractNumber: 'DMRC/ARCH/2024/01',
        contractorName: 'Shapoorji Pallonji',
        amountInclGst: '150',
        currency: 'INR (Lakhs)',
        workOrderPdf: '',
        completionCertPdf: '',
      },
    ],
    usedInDmrc: 'Yes',
    dmrcDetails: 'Installed in DMRC Phase-IV Stations',
    appInterior: true,
    appExterior: true,
    producedFromWaste: 'No',
    sriApplicable: 'Applicable',
    sriValue: '82',
  });

  useEffect(() => {
    api.get('/materials/architecture').then((res) => {
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
        .catch((err) => setError('Failed to load Architecture application record.'))
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

  // IS Codes array handler
  const addIsCode = () => {
    setFormData((prev: any) => ({
      ...prev,
      isCodes: [...prev.isCodes, { codeName: '', pdfPath: '', validTill: '' }],
    }));
  };

  const removeIsCode = (idx: number) => {
    if (formData.isCodes.length === 1) return;
    setFormData((prev: any) => ({
      ...prev,
      isCodes: prev.isCodes.filter((_: any, i: number) => i !== idx),
    }));
  };

  const handleSave = async (status: 'DRAFT' | 'SUBMITTED') => {
    setLoading(true);
    setError('');

    try {
      const payload = {
        id: isEdit ? Number(id) : undefined,
        category: 'ARCHITECTURE',
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
      setError(err.response?.data?.error || 'Failed to save Architecture application.');
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

        <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1.5">
          <Compass className="w-4 h-4 text-emerald-700" />
          <span>Architectural Items Empanelment Form</span>
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
            <span>Architectural Item General Info</span>
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
                <option value="FABRICATOR">FABRICATOR</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Architectural Item (SNo – Category – Product) <span className="text-dmrc-red">*</span>
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
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">Manufacturing Period (Years)</label>
              <input
                type="number"
                value={formData.mfgPeriodYears}
                onChange={(e) => updateField('mfgPeriodYears', e.target.value)}
                placeholder="e.g. 15"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">Expected Lifespan (Years)</label>
              <input
                type="number"
                value={formData.expectedLifespanYears}
                onChange={(e) => updateField('expectedLifespanYears', e.target.value)}
                placeholder="e.g. 30"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none font-bold"
              />
            </div>
          </div>
        </div>

        {/* SEC B: Qualifying Criteria */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 font-outfit uppercase flex items-center space-x-2">
              <span className="w-6 h-6 rounded bg-dmrc-red text-white text-xs flex items-center justify-center font-mono">B</span>
              <span>Qualifying Criteria & Standards Compliance</span>
            </h2>

            <button
              type="button"
              onClick={addIsCode}
              className="flex items-center space-x-1 text-xs font-bold text-dmrc-red hover:underline"
            >
              <Plus className="w-4 h-4" />
              <span>Add IS Code</span>
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider">Indian Standards (IS Codes) Compliance</h3>
            {formData.isCodes.map((code: any, idx: number) => (
              <div key={idx} className="bg-slate-50 border p-3 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                <input
                  type="text"
                  value={code.codeName}
                  onChange={(e) => {
                    const codes = [...formData.isCodes];
                    codes[idx].codeName = e.target.value;
                    updateField('isCodes', codes);
                  }}
                  placeholder="e.g. IS 15622:2017"
                  className="px-3 py-2 bg-white border rounded outline-none font-bold"
                />
                <input
                  type="date"
                  value={code.validTill}
                  onChange={(e) => {
                    const codes = [...formData.isCodes];
                    codes[idx].validTill = e.target.value;
                    updateField('isCodes', codes);
                  }}
                  className="px-3 py-2 bg-white border rounded outline-none"
                />
                <FileUploadInput
                  label="IS Standard Certificate PDF"
                  value={code.pdfPath}
                  onChange={(path) => {
                    const codes = [...formData.isCodes];
                    codes[idx].pdfPath = path;
                    updateField('isCodes', codes);
                  }}
                />
                {formData.isCodes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIsCode(idx)}
                    className="text-slate-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* NABL & ISO Checkboxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">NABL Accredited Lab Test Available?</span>
                <select
                  value={formData.nablAccredited}
                  onChange={(e) => updateField('nablAccredited', e.target.value)}
                  className="font-bold border rounded px-2 py-1 bg-white"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {formData.nablAccredited === 'Yes' && (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={formData.nablLabName}
                    onChange={(e) => updateField('nablLabName', e.target.value)}
                    placeholder="NABL Accredited Lab Name"
                    className="w-full px-3 py-2 bg-white border rounded outline-none font-semibold"
                  />
                  <FileUploadInput
                    label="Upload NABL Certificate PDF"
                    value={formData.nablCertPdf}
                    onChange={(path) => updateField('nablCertPdf', path)}
                    required
                  />
                </div>
              )}
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">ISO Certified Quality System?</span>
                <select
                  value={formData.isoCertified}
                  onChange={(e) => updateField('isoCertified', e.target.value)}
                  className="font-bold border rounded px-2 py-1 bg-white"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {formData.isoCertified === 'Yes' && (
                <FileUploadInput
                  label="ISO Certificate PDF"
                  value={formData.isoCertPdf}
                  onChange={(path) => updateField('isoCertPdf', path)}
                  required
                />
              )}
            </div>
          </div>
        </div>

        {/* SEC C: Additional Information & Green Ratings */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 text-xs">
          <h2 className="text-base font-bold text-slate-900 font-outfit uppercase border-b border-slate-100 pb-3 flex items-center space-x-2">
            <span className="w-6 h-6 rounded bg-dmrc-red text-white text-xs flex items-center justify-center font-mono">C</span>
            <span>Additional Information & Green Building Certification</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-4 rounded-xl border space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Green Material Certified (GRIHA / LEED / IGBC)?</span>
                <select
                  value={formData.greenCertified}
                  onChange={(e) => updateField('greenCertified', e.target.value)}
                  className="font-bold border rounded px-2 py-1 bg-white"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {formData.greenCertified === 'Yes' && (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={formData.greenOrgName}
                    onChange={(e) => updateField('greenOrgName', e.target.value)}
                    placeholder="Organisation (GRIHA / LEED / IGBC)"
                    className="w-full px-3 py-2 bg-white border rounded outline-none"
                  />
                  <FileUploadInput
                    label="Green Certificate PDF"
                    value={formData.greenCertPdf}
                    onChange={(path) => updateField('greenCertPdf', path)}
                  />
                </div>
              )}
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Solar Reflectance Index (SRI) Value</span>
                <select
                  value={formData.sriApplicable}
                  onChange={(e) => updateField('sriApplicable', e.target.value)}
                  className="font-bold border rounded px-2 py-1 bg-white"
                >
                  <option value="Applicable">Applicable</option>
                  <option value="Not Applicable">Not Applicable</option>
                </select>
              </div>

              {formData.sriApplicable === 'Applicable' && (
                <input
                  type="number"
                  value={formData.sriValue}
                  onChange={(e) => updateField('sriValue', e.target.value)}
                  placeholder="e.g. 78"
                  className="w-full px-3 py-2 bg-white border rounded outline-none font-bold"
                />
              )}
            </div>
          </div>

          <div className="flex items-center space-x-6 pt-2">
            <label className="flex items-center space-x-2 font-bold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.appInterior}
                onChange={(e) => updateField('appInterior', e.target.checked)}
                className="w-4 h-4 text-dmrc-red rounded"
              />
              <span>Interior Application</span>
            </label>

            <label className="flex items-center space-x-2 font-bold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.appExterior}
                onChange={(e) => updateField('appExterior', e.target.checked)}
                className="w-4 h-4 text-dmrc-red rounded"
              />
              <span>Exterior Application</span>
            </label>
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
              <span>Submit Architectural Application</span>
            </button>
          </div>
        </div>
      </form>

      <ConfirmationModal
        isOpen={showModal}
        title="Confirm Architectural Empanelment Submission"
        confirmText="Confirm & Submit Architectural Form"
        onConfirm={() => handleSave('SUBMITTED')}
        onCancel={() => setShowModal(false)}
        loading={loading}
      />
    </div>
  );
};
