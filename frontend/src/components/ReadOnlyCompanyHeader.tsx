import React from 'react';
import { Building2, FileCheck2, UserCheck, Lock } from 'lucide-react';

interface ReadOnlyCompanyHeaderProps {
  company: any;
  representative?: any;
}

export const ReadOnlyCompanyHeader: React.FC<ReadOnlyCompanyHeaderProps> = ({ company, representative }) => {
  if (!company) return null;

  return (
    <div className="bg-slate-100/80 border border-slate-200 rounded-2xl p-5 mb-8 shadow-inner relative overflow-hidden">
      <div className="absolute top-0 right-0 bg-slate-200/80 text-slate-600 text-[10px] font-bold px-3 py-1 rounded-bl-xl flex items-center space-x-1 uppercase tracking-wider">
        <Lock className="w-3 h-3 text-slate-500" />
        <span>Auto-filled Registration Profile (Read-Only)</span>
      </div>

      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-dmrc-blue text-white flex items-center justify-center font-bold">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 font-outfit">{company.company_name}</h3>
          <p className="text-xs text-slate-500 font-medium">
            {company.business_structure} • Reg Date: {company.date_of_registration}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-slate-200/60 text-xs">
        <div>
          <span className="text-slate-400 font-medium block">GSTIN Number</span>
          <span className="font-mono font-bold text-slate-800">{company.gst_number || 'N/A'}</span>
        </div>

        <div>
          <span className="text-slate-400 font-medium block">PAN Number</span>
          <span className="font-mono font-bold text-slate-800">{company.pan_number || 'N/A'}</span>
        </div>

        <div>
          <span className="text-slate-400 font-medium block">CIN / Firm Reg No.</span>
          <span className="font-mono font-bold text-slate-800">{company.cin_number || 'N/A'}</span>
        </div>

        <div>
          <span className="text-slate-400 font-medium block">Company Email</span>
          <span className="font-semibold text-slate-800 truncate block">{company.email_id || 'N/A'}</span>
        </div>

        <div className="md:col-span-2">
          <span className="text-slate-400 font-medium block">Registered Address</span>
          <span className="font-medium text-slate-800">
            {company.registered_address_street}, {company.registered_address_city}, {company.registered_address_state}, {company.registered_address_country}
          </span>
        </div>

        <div className="md:col-span-2">
          <span className="text-slate-400 font-medium block">Authorised Representative</span>
          <span className="font-semibold text-slate-800">
            {representative?.name ? `${representative.name} (${representative.designation})` : 'Registered Representative'}
          </span>
        </div>
      </div>
    </div>
  );
};
