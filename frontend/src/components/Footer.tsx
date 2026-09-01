import React from 'react';
import { ShieldCheck, Info, FileText } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs py-10 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center space-x-2 text-white font-bold text-base mb-3 font-outfit">
            <div className="w-6 h-6 rounded bg-dmrc-red flex items-center justify-center text-xs">M</div>
            <span>Delhi Metro Rail Corporation Ltd.</span>
          </div>
          <p className="leading-relaxed text-slate-400">
            DMRC Planning Division Vendor Registration & Material Empanelment Portal. Designed per Annexures A–D, DMRC/Plg./Vendor/7000/Vol.2/2025/.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-3">Material Categories</h4>
          <ul className="space-y-2">
            <li><span className="hover:text-white transition-colors">Civil Materials & Items (C1 – C45)</span></li>
            <li><span className="hover:text-white transition-colors">Architectural Items & Products (A1 – A12)</span></li>
            <li><span className="hover:text-white transition-colors">Electrical Systems & Equipment (E1 – E10)</span></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-3">Support & Guidelines</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-dmrc-red" />
              <span>Strict 100% PDF Upload Compliance</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Outline Construction Specifications (OCS) compliant</span>
            </div>
            <p className="text-[11px] text-slate-500 pt-2">
              © {new Date().getFullYear()} Delhi Metro Rail Corporation Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
