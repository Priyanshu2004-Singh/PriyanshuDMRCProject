import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Plus, Trash2, Building2, UserCheck, Lock, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import { Captcha } from '../components/Captcha';
import { FileUploadInput } from '../components/FileUploadInput';
import { ConfirmationModal } from '../components/ConfirmationModal';

const BUSINESS_STRUCTURES = [
  'Sole Proprietorship',
  'Limited Liability Partnership (LLP)',
  'Public Limited Company',
  'Private Limited Company',
  'Other…',
];

export const RegisterPage: React.FC<{ onLoginSuccess?: (user: any, company: any) => void }> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();

  // Form state — all fields
  const [formData, setFormData] = useState({
    companyName: '',
    businessStructure: 'Private Limited Company',
    businessStructureOther: '',
    registeredAddressStreet: '',
    registeredAddressCity: '',
    registeredAddressState: '',
    registeredAddressCountry: 'India',
    gstNumber: '',
    gstDocument: '',
    panNumber: '',
    panDocument: '',
    cinNumber: '',
    cinDocument: '',
    dateOfRegistration: '',
    contactNumber: '',
    emailId: '',
    repName: '',
    repDesignation: '',
    repAuthorisationDocs: [''],
    repMobileNumber: '',
    repEmailId: '',
    password: '',
    confirmPassword: '',
    declaration: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [captchaId, setCaptchaId] = useState('');
  const [captchaText, setCaptchaText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  const set = (field: string, val: any) =>
    setFormData((p) => ({ ...p, [field]: val }));

  // POA docs helpers
  const setPoaDoc = (idx: number, path: string) => {
    const updated = [...formData.repAuthorisationDocs];
    updated[idx] = path;
    set('repAuthorisationDocs', updated);
  };
  const addPoaRow = () =>
    set('repAuthorisationDocs', [...formData.repAuthorisationDocs, '']);
  const removePoaRow = (idx: number) => {
    if (formData.repAuthorisationDocs.length === 1) return;
    set(
      'repAuthorisationDocs',
      formData.repAuthorisationDocs.filter((_, i) => i !== idx)
    );
  };

  // Validation
  const validate = (): string | null => {
    if (!formData.companyName.trim()) return 'Company Name is required.';
    if (
      formData.businessStructure === 'Other…' &&
      !formData.businessStructureOther.trim()
    )
      return 'Please specify your Business Structure under "Other".';
    if (
      !formData.registeredAddressStreet ||
      !formData.registeredAddressCity ||
      !formData.registeredAddressState ||
      !formData.registeredAddressCountry
    )
      return 'Complete Registered Address (Street, City, State, Country) is required.';
    if (!formData.gstNumber) return 'GSTIN Number is required.';
    const gstRx = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstRx.test(formData.gstNumber.toUpperCase()))
      return 'Invalid GSTIN format. Expected pattern like 07AAAAA0000A1Z5 (15 chars).';
    if (!formData.panNumber) return 'PAN Number is required.';
    const panRx = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRx.test(formData.panNumber.toUpperCase()))
      return 'Invalid PAN format. Expected pattern like ABCDE1234F (10 chars).';
    if (!formData.dateOfRegistration)
      return 'Date of Registration is required.';
    if (formData.dateOfRegistration > todayStr)
      return 'Date of Registration cannot be in the future.';
    if (!formData.contactNumber) return 'Company Contact Number is required.';
    if (!formData.emailId) return 'Company Email ID is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailId))
      return 'Please enter a valid Email ID.';
    if (!formData.repName.trim())
      return 'Authorised Representative Name is required.';
    if (!formData.repDesignation.trim())
      return 'Representative Designation is required.';
    if (!formData.repMobileNumber)
      return 'Representative Mobile Number is required.';
    if (!formData.repEmailId)
      return 'Representative Email ID is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.repEmailId))
      return 'Please enter a valid Representative Email ID.';
    if (!formData.password || formData.password.length < 8)
      return 'Password must be at least 8 characters.';
    if (formData.password !== formData.confirmPassword)
      return 'Password and Confirm Password do not match.';
    if (!captchaText)
      return 'Please type the CAPTCHA characters shown in the image.';
    if (!formData.declaration)
      return 'You must accept the Declaration before submitting.';
    return null;
  };

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setError('');
    setShowConfirmModal(true);
  };

  const executeRegistration = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/register', {
        ...formData,
        captchaId,
        captchaText,
      });

      const { token, userId, company } = response.data;
      localStorage.setItem('dmrc_token', token);
      const userData = { userId, role: 'VENDOR' };
      localStorage.setItem('dmrc_user', JSON.stringify(userData));
      localStorage.setItem('dmrc_company', JSON.stringify(company));

      // Update App-level state so dashboard guard sees the user
      if (onLoginSuccess) {
        onLoginSuccess(userData, company);
      }

      setShowConfirmModal(false);
      navigate('/dashboard');
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          'Registration failed. Please check all inputs and try again.'
      );
      setShowConfirmModal(false);
    } finally {
      setLoading(false);
    }
  };

  /* ─── UI ─────────────────────────────────────────────────── */

  const inputCls =
    'w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-dmrc-red/20 focus:border-dmrc-red outline-none text-slate-800 text-xs font-semibold transition-all';

  const labelCls =
    'block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5';

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-dmrc-red flex items-center justify-center font-extrabold text-white text-2xl shadow-md">
            M
          </div>
          <div>
            <span className="text-xs font-bold text-dmrc-red uppercase tracking-wider">
              Annexure A — DMRC/Plg./Vendor/7000/Vol.2/2025/
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 font-outfit">
              Vendor Company Registration
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Create your DMRC Vendor Account to apply for Civil, Electrical, or Architectural product empanelment
            </p>
          </div>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 text-xs font-semibold px-5 py-3.5 rounded-xl mb-6 flex items-start space-x-2">
          <span className="text-red-600 mt-0.5">⚠</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handlePreSubmit} noValidate className="space-y-8">
        {/* ── SECTION A ── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 mb-6">
            <Building2 className="w-5 h-5 text-dmrc-red" />
            <h2 className="text-sm font-bold text-slate-900 font-outfit uppercase tracking-wide">
              Section A — Details of the Company
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Company Name */}
            <div className="md:col-span-2">
              <label className={labelCls}>
                Name of the Company / Firm <span className="text-dmrc-red">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => set('companyName', e.target.value)}
                placeholder="e.g. Acme Infrastructure Materials Pvt. Ltd."
                className={inputCls}
              />
            </div>

            {/* Business Structure */}
            <div>
              <label className={labelCls}>
                Business Structure <span className="text-dmrc-red">*</span>
              </label>
              <select
                value={formData.businessStructure}
                onChange={(e) => set('businessStructure', e.target.value)}
                className={inputCls}
              >
                {BUSINESS_STRUCTURES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {formData.businessStructure === 'Other…' && (
                <input
                  type="text"
                  value={formData.businessStructureOther}
                  onChange={(e) => set('businessStructureOther', e.target.value)}
                  placeholder="Specify business structure"
                  className={`${inputCls} mt-2`}
                />
              )}
            </div>

            {/* Date of Registration */}
            <div>
              <label className={labelCls}>
                Date of Registration <span className="text-dmrc-red">*</span>
              </label>
              <input
                type="date"
                max={todayStr}
                required
                value={formData.dateOfRegistration}
                onChange={(e) => set('dateOfRegistration', e.target.value)}
                className={inputCls}
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2 space-y-2">
              <label className={labelCls}>
                Registered Address <span className="text-dmrc-red">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.registeredAddressStreet}
                onChange={(e) => set('registeredAddressStreet', e.target.value)}
                placeholder="Street Address / Building / Plot No."
                className={inputCls}
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  required
                  value={formData.registeredAddressCity}
                  onChange={(e) => set('registeredAddressCity', e.target.value)}
                  placeholder="City *"
                  className={inputCls}
                />
                <input
                  type="text"
                  required
                  value={formData.registeredAddressState}
                  onChange={(e) => set('registeredAddressState', e.target.value)}
                  placeholder="State *"
                  className={inputCls}
                />
                <input
                  type="text"
                  required
                  value={formData.registeredAddressCountry}
                  onChange={(e) => set('registeredAddressCountry', e.target.value)}
                  placeholder="Country *"
                  className={inputCls}
                />
              </div>
            </div>

            {/* GST */}
            <div>
              <label className={labelCls}>
                GST Number (GSTIN) <span className="text-dmrc-red">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={15}
                value={formData.gstNumber}
                onChange={(e) => set('gstNumber', e.target.value.toUpperCase())}
                placeholder="e.g. 07AAAAA0000A1Z5"
                className={`${inputCls} font-mono tracking-widest`}
              />
              <div className="mt-2">
                <FileUploadInput
                  label="GST Registration Certificate PDF (optional at this stage)"
                  value={formData.gstDocument}
                  onChange={(path) => set('gstDocument', path)}
                />
              </div>
            </div>

            {/* PAN */}
            <div>
              <label className={labelCls}>
                PAN Number <span className="text-dmrc-red">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={10}
                value={formData.panNumber}
                onChange={(e) => set('panNumber', e.target.value.toUpperCase())}
                placeholder="e.g. ABCDE1234F"
                className={`${inputCls} font-mono tracking-widest`}
              />
              <div className="mt-2">
                <FileUploadInput
                  label="PAN Card PDF (optional at this stage)"
                  value={formData.panDocument}
                  onChange={(path) => set('panDocument', path)}
                />
              </div>
            </div>

            {/* CIN */}
            <div>
              <label className={labelCls}>CIN / Firm Registration Number</label>
              <input
                type="text"
                value={formData.cinNumber}
                onChange={(e) => set('cinNumber', e.target.value)}
                placeholder="e.g. U60100DL1995GOI066597"
                className={`${inputCls} font-mono`}
              />
              <div className="mt-2">
                <FileUploadInput
                  label="CIN / Incorporation Certificate PDF (optional)"
                  value={formData.cinDocument}
                  onChange={(path) => set('cinDocument', path)}
                />
              </div>
            </div>

            {/* Contact */}
            <div>
              <label className={labelCls}>
                Company Contact Number <span className="text-dmrc-red">*</span>
              </label>
              <div className="flex space-x-2">
                <span className="px-3 py-2.5 bg-slate-200 text-slate-700 font-bold text-xs rounded-lg flex items-center shrink-0">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  value={formData.contactNumber}
                  onChange={(e) => set('contactNumber', e.target.value)}
                  placeholder="Landline / Phone Number"
                  className={inputCls}
                />
              </div>
              <div className="mt-2">
                <label className={labelCls}>
                  Company Email ID <span className="text-dmrc-red">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.emailId}
                  onChange={(e) => set('emailId', e.target.value)}
                  placeholder="official@company.com"
                  className={inputCls}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION B ── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 mb-6">
            <UserCheck className="w-5 h-5 text-dmrc-red" />
            <h2 className="text-sm font-bold text-slate-900 font-outfit uppercase tracking-wide">
              Section B — Authorised Representative
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>
                Name of Authorised Representative <span className="text-dmrc-red">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.repName}
                onChange={(e) => set('repName', e.target.value)}
                placeholder="Full Legal Name"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>
                Designation <span className="text-dmrc-red">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.repDesignation}
                onChange={(e) => set('repDesignation', e.target.value)}
                placeholder="e.g. Managing Director / Vice President"
                className={inputCls}
              />
            </div>

            {/* POA docs repeatable */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <label className={labelCls}>
                  Authorisation Document (POA / Board Resolution) — PDF
                </label>
                <button
                  type="button"
                  onClick={addPoaRow}
                  className="flex items-center space-x-1 text-dmrc-red text-xs font-bold hover:underline"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Row</span>
                </button>
              </div>

              {formData.repAuthorisationDocs.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-200"
                >
                  <div className="flex-grow">
                    <FileUploadInput
                      label={`Authorisation Doc #${idx + 1} (optional)`}
                      value={doc}
                      onChange={(path) => setPoaDoc(idx, path)}
                    />
                  </div>
                  {formData.repAuthorisationDocs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePoaRow(idx)}
                      className="text-slate-400 hover:text-red-600 p-1 rounded"
                      title="Remove row"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile */}
            <div>
              <label className={labelCls}>
                Mobile Number <span className="text-dmrc-red">*</span>
              </label>
              <div className="flex space-x-2">
                <span className="px-3 py-2.5 bg-slate-200 text-slate-700 font-bold text-xs rounded-lg flex items-center shrink-0">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  value={formData.repMobileNumber}
                  onChange={(e) => set('repMobileNumber', e.target.value)}
                  placeholder="10-digit Mobile"
                  className={inputCls}
                />
              </div>
            </div>

            {/* Rep Email */}
            <div>
              <label className={labelCls}>
                Representative Email ID <span className="text-dmrc-red">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.repEmailId}
                onChange={(e) => set('repEmailId', e.target.value)}
                placeholder="representative@company.com"
                className={inputCls}
              />
            </div>
          </div>
        </div>

        {/* ── SECTION C ── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
            <Lock className="w-5 h-5 text-dmrc-red" />
            <h2 className="text-sm font-bold text-slate-900 font-outfit uppercase tracking-wide">
              Section C — Credentials & Declaration
            </h2>
          </div>

          {/* Auto-generated User ID preview */}
          <div>
            <label className={labelCls}>User ID (System Generated)</label>
            <input
              type="text"
              disabled
              value="DMRC-VND-XXXX  (assigned automatically after registration)"
              className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 text-slate-400 font-mono text-xs rounded-lg cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Password */}
            <div>
              <label className={labelCls}>
                Password <span className="text-dmrc-red">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => set('password', e.target.value)}
                  placeholder="Min 8 characters"
                  className={`${inputCls} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className={labelCls}>
                Confirm Password <span className="text-dmrc-red">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => set('confirmPassword', e.target.value)}
                  placeholder="Re-enter password"
                  className={`${inputCls} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {/* Password match indicator */}
              {formData.confirmPassword && (
                <p
                  className={`text-xs font-semibold mt-1 ${
                    formData.password === formData.confirmPassword
                      ? 'text-emerald-600'
                      : 'text-red-500'
                  }`}
                >
                  {formData.password === formData.confirmPassword
                    ? '✓ Passwords match'
                    : '✗ Passwords do not match'}
                </p>
              )}
            </div>
          </div>

          {/* CAPTCHA */}
          <Captcha
            onCaptchaChange={(id, text) => {
              setCaptchaId(id);
              setCaptchaText(text);
            }}
          />

          {/* Declaration */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={formData.declaration}
                onChange={(e) => set('declaration', e.target.checked)}
                className="mt-0.5 w-4 h-4 text-dmrc-red border-slate-300 rounded focus:ring-dmrc-red"
              />
              <span className="text-xs text-amber-900 font-semibold leading-relaxed">
                We hereby confirm that all statements, information and answers given above are true, complete,
                and no information has been suppressed. We accept all terms and conditions of DMRC Vendor
                Empanelment Policy including Annexures A–D.
              </span>
            </label>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-slate-100">
            <Link
              to="/login"
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-8 py-3 bg-dmrc-red hover:bg-dmrc-darkRed text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all uppercase tracking-wider flex items-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Registration Form</span>
            </button>
          </div>
        </div>
      </form>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        title="Confirm Company Registration"
        confirmText="Confirm & Create Vendor Account"
        onConfirm={executeRegistration}
        onCancel={() => setShowConfirmModal(false)}
        loading={loading}
      />
    </div>
  );
};
