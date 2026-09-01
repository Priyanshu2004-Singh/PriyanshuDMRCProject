import React, { useEffect, useState } from 'react';
import { ShieldCheck, Search, Filter, CheckCircle2, XCircle, Clock, FileText, ExternalLink } from 'lucide-react';
import api from '../services/api';

export const AdminDashboardPage: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [remarks, setRemarks] = useState<string>('');

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/applications');
      setApplications(res.data);
    } catch (err) {
      console.error('Failed to fetch admin applications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleUpdateStatus = async (status: string) => {
    if (!selectedApp) return;

    try {
      await api.put(`/admin/applications/${selectedApp.id}/status`, {
        status,
        remarks,
      });

      setSelectedApp(null);
      setRemarks('');
      fetchAll();
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const filteredApps = applications.filter((app) => {
    if (filterCategory !== 'ALL' && app.category !== filterCategory) return false;
    if (filterStatus !== 'ALL' && app.status !== filterStatus) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchComp = app.companyName?.toLowerCase().includes(term);
      const matchMat = app.materialName?.toLowerCase().includes(term);
      const matchGst = app.gstNumber?.toLowerCase().includes(term);
      if (!matchComp && !matchMat && !matchGst) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Title Ribbon */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-dmrc-red text-white flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-dmrc-gold uppercase tracking-wider">Internal DMRC Officer Portal</span>
            <h1 className="text-2xl font-extrabold font-outfit">Vendor Empanelment Application Queue</h1>
          </div>
        </div>

        <div className="bg-white/10 text-xs px-4 py-2 rounded-xl text-slate-300 font-mono">
          Role: DMRC Empanelment Officer
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between text-xs">
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Company, Material, or GST..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border rounded-xl outline-none font-medium"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="py-2.5 px-3 bg-slate-50 border rounded-xl font-bold"
            >
              <option value="ALL">All Categories</option>
              <option value="CIVIL">Civil</option>
              <option value="ELECTRICAL">Electrical</option>
              <option value="ARCHITECTURE">Architecture</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="py-2.5 px-3 bg-slate-50 border rounded-xl font-bold"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUBMITTED">Submitted / Pending</option>
              <option value="EMPANELLED">Empanelled / Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>
        </div>

        <div className="text-slate-500 font-bold">
          Showing {filteredApps.length} of {applications.length} applications
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading queue...</div>
        ) : filteredApps.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500">No applications match your filter criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b">
                  <th className="py-3 px-4">App ID</th>
                  <th className="py-3 px-4">Company Name</th>
                  <th className="py-3 px-4">GSTIN</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Material / Item</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-dmrc-blue">
                      #APP-{app.id.toString().padStart(4, '0')}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{app.companyName}</td>
                    <td className="py-3.5 px-4 font-mono">{app.gstNumber}</td>
                    <td className="py-3.5 px-4 uppercase font-bold text-slate-700">{app.category}</td>
                    <td className="py-3.5 px-4 font-semibold max-w-xs truncate">{app.materialName}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                        app.status === 'EMPANELLED' ? 'bg-emerald-100 text-emerald-800' :
                        app.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        app.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-dmrc-red text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        Inspect & Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <div>
                <span className="text-xs font-bold text-dmrc-red uppercase">Application Inspection</span>
                <h3 className="text-xl font-bold text-slate-900 font-outfit">
                  {selectedApp.companyName} — #{selectedApp.id}
                </h3>
              </div>
              <button onClick={() => setSelectedApp(null)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl font-medium">
                <div>Category: <span className="font-bold">{selectedApp.category}</span></div>
                <div>Applying As: <span className="font-bold">{selectedApp.applyingAs}</span></div>
                <div>Material: <span className="font-bold">{selectedApp.materialName}</span></div>
                <div>Submitted At: <span className="font-bold">{new Date(selectedApp.updatedAt).toLocaleString()}</span></div>
              </div>

              {/* Status Update Controls */}
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl space-y-3">
                <label className="block font-bold text-amber-900 uppercase">Empanelment Officer Decision</label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Official remarks / feedback for vendor..."
                  className="w-full p-2.5 bg-white border rounded-lg outline-none"
                />

                <div className="flex items-center space-x-3 pt-2">
                  <button
                    onClick={() => handleUpdateStatus('EMPANELLED')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center space-x-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Empanel / Approve Product</span>
                  </button>

                  <button
                    onClick={() => handleUpdateStatus('REJECTED')}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg flex items-center space-x-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject Application</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
