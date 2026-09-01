import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HardHat, Zap, Compass, Plus, FileText, CheckCircle2, Clock, AlertCircle, ArrowRight, Building } from 'lucide-react';
import api from '../services/api';

export const DashboardPage: React.FC<{ company: any }> = ({ company }) => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/applications');
      setApplications(res.data);
    } catch (err) {
      console.error('Failed to fetch applications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return (
          <span className="inline-flex items-center space-x-1 bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase">
            <Clock className="w-3 h-3" />
            <span>Submitted / Pending Review</span>
          </span>
        );
      case 'EMPANELLED':
        return (
          <span className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Empanelled / Approved</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center space-x-1 bg-red-50 text-red-700 border border-red-200 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase">
            <AlertCircle className="w-3 h-3" />
            <span>Rejected</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase">
            <FileText className="w-3 h-3" />
            <span>Draft</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-dmrc-navy to-dmrc-red rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Empanelment Dashboard
            </span>
            <h1 className="text-3xl font-extrabold font-outfit mt-3">
              Welcome, {company?.company_name || 'Vendor Partner'}
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl font-medium">
              Submit and manage your product empanelment applications across DMRC Civil, Electrical, and Architectural categories.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/20">
            <Building className="w-6 h-6 text-dmrc-gold" />
            <div className="text-xs">
              <div className="font-bold text-white">GSTIN: {company?.gst_number || 'N/A'}</div>
              <div className="text-slate-300 font-mono">CIN: {company?.cin_number || 'N/A'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Application Category Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900 font-outfit">Empanelment Categories</h2>
          <p className="text-xs text-slate-500 font-semibold">Select a domain to submit a new product application</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Civil Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-dmrc-red/40 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <HardHat className="w-7 h-7" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-slate-900 font-outfit">Civil Materials</h3>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">45 Items (C1–C45)</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium mb-6">
                Cement, TMT Steel, Concrete Admixtures, Bearings, Expansion Joints, Waterproofing Membranes, TBM Chemicals, Noise Barriers.
              </p>
            </div>

            <Link
              to="/applications/civil/new"
              className="w-full py-3 bg-slate-900 group-hover:bg-dmrc-red text-white text-xs font-bold rounded-xl shadow transition-all flex items-center justify-center space-x-2 uppercase tracking-wider"
            >
              <Plus className="w-4 h-4" />
              <span>New Civil Application</span>
            </Link>
          </div>

          {/* Electrical Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-dmrc-red/40 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-slate-900 font-outfit">Electrical Systems</h3>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">10 Items (E1–E10)</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium mb-6">
                25kV Transformers, HT Switchgear, OHE Wires & Insulators, Cable Jointing Kits, Battery Banks, LT Panels, FRLSH Cables.
              </p>
            </div>

            <Link
              to="/applications/electrical/new"
              className="w-full py-3 bg-slate-900 group-hover:bg-dmrc-red text-white text-xs font-bold rounded-xl shadow transition-all flex items-center justify-center space-x-2 uppercase tracking-wider"
            >
              <Plus className="w-4 h-4" />
              <span>New Electrical Application</span>
            </Link>
          </div>

          {/* Architecture Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-dmrc-red/40 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Compass className="w-7 h-7" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-slate-900 font-outfit">Architectural Items</h3>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">61 Items (A1–A12)</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium mb-6">
                Heavy Duty Vitrified Tiles, ACP Cladding, False Ceilings, Fire Doors, Plumbing Fixtures, Hardware, Standing Seam Roofing.
              </p>
            </div>

            <Link
              to="/applications/architecture/new"
              className="w-full py-3 bg-slate-900 group-hover:bg-dmrc-red text-white text-xs font-bold rounded-xl shadow transition-all flex items-center justify-center space-x-2 uppercase tracking-wider"
            >
              <Plus className="w-4 h-4" />
              <span>New Architecture Application</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Submitted & Draft Applications Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 font-outfit">Submitted & Saved Applications</h3>
            <p className="text-xs text-slate-500 font-medium">Track your application statuses or resume saved drafts</p>
          </div>
          <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full">
            Total Records: {applications.length}
          </span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400 text-xs font-medium">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-700">No Empanelment Applications Found</h4>
            <p className="text-xs text-slate-500 mt-1">Select one of the category cards above to start a new application.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4">App ID</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Applying As</th>
                  <th className="py-3 px-4">Material / Item / Product</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Updated</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-dmrc-blue">
                      #APP-{app.id.toString().padStart(4, '0')}
                    </td>
                    <td className="py-3.5 px-4 uppercase font-bold text-slate-700">{app.category}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-600">{app.applyingAs}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs truncate">{app.materialName}</td>
                    <td className="py-3.5 px-4">{getStatusBadge(app.status)}</td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {new Date(app.updatedAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => navigate(`/applications/${app.category.toLowerCase()}/${app.id}`)}
                        className="inline-flex items-center space-x-1 text-xs font-bold text-dmrc-red hover:underline"
                      >
                        <span>{app.status === 'DRAFT' ? 'Edit Draft' : 'View Application'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
