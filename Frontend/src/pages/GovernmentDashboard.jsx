import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import apiClient from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

function AnalyticsCard({ label, value, accent }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className={`mt-3 text-3xl font-bold ${accent}`}>{value}</p>
    </div>
  );
}

function CompanyRow({ company, onSelect }) {
  return (
    <tr className="border-b last:border-none">
      <td className="px-4 py-3 font-semibold">{company.companyName}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{company.registrationNumber}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{new Date(company.createdAt).toLocaleDateString()}</td>
      <td className="px-4 py-3 text-right">
        <button
          onClick={() => onSelect(company)}
          className="px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
        >
          Review
        </button>
      </td>
    </tr>
  );
}

export default function GovernmentDashboard() {
  const { govToken, logoutGovernment } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [activity, setActivity] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [decisionLoading, setDecisionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [govToken]);

  const fetchAllData = async () => {
    if (!govToken) {
      return;
    }
    setLoading(true);
    try {
      const authConfig = {
        headers: { Authorization: `Bearer ${govToken}` }
      };
      const [analyticsRes, pendingRes, approvedRes, rejectedRes] = await Promise.all([
        apiClient.get('/government/analytics', authConfig),
        apiClient.get('/government/pending-companies', authConfig),
        apiClient.get('/government/status/approved', authConfig),
        apiClient.get('/government/status/rejected', authConfig)
      ]);
      setAnalytics(analyticsRes.data);
      setPending(pendingRes.data.companies || []);
      setApproved(approvedRes.data.companies || []);
      setRejected(rejectedRes.data.companies || []);
      setActivity(analyticsRes.data.activity || []);
    } catch (error) {
      console.error('Government dashboard error:', error);
      const errorMessage = error.response?.data?.message
        || error.response?.data?.error
        || error.message
        || 'Unable to load government data';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedCompany) return;
    setDecisionLoading(true);
    try {
      const authConfig = {
        headers: { Authorization: `Bearer ${govToken}` }
      };
      await apiClient.put(`/government/approve/${selectedCompany.id}`, {}, authConfig);
      toast.success('Company approved');
      await fetchAllData();
      setSelectedCompany(null);
      setRejectionReason('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to approve company');
    } finally {
      setDecisionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedCompany) return;
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    setDecisionLoading(true);
    try {
      const authConfig = {
        headers: { Authorization: `Bearer ${govToken}` }
      };
      await apiClient.put(
        `/government/reject/${selectedCompany.id}`,
        { rejectionReason },
        authConfig
      );
      toast.success('Company rejected');
      await fetchAllData();
      setSelectedCompany(null);
      setRejectionReason('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to reject company');
    } finally {
      setDecisionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-sm">Loading government dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-purple-600">Government Console</p>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">Compliance Oversight</h1>
            <p className="text-gray-500 text-sm mt-2">
              Review pending companies, approve compliant profiles, and maintain a full audit trail.
            </p>
          </div>
          <button
            onClick={() => {
              logoutGovernment();
              toast.success('Government session closed');
            }}
            className="px-5 py-2.5 text-sm font-semibold rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition"
          >
            Sign out
          </button>
        </div>

        {analytics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <AnalyticsCard label="Total companies" value={analytics.totals.totalCompanies} accent="text-gray-900" />
            <AnalyticsCard label="Pending approvals" value={analytics.totals.pending} accent="text-amber-500" />
            <AnalyticsCard label="Approved" value={analytics.totals.approved} accent="text-emerald-600" />
            <AnalyticsCard label="Rejected" value={analytics.totals.rejected} accent="text-rose-600" />
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Pending approvals</h2>
                <p className="text-sm text-gray-500">{pending.length} awaiting review</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-gray-600">Company</th>
                    <th className="px-4 py-3 font-semibold text-gray-600">Registration #</th>
                    <th className="px-4 py-3 font-semibold text-gray-600">Submitted</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {pending.length ? (
                    pending.map((company) => (
                      <CompanyRow key={company.id} company={company} onSelect={setSelectedCompany} />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-4 py-6 text-center text-sm text-gray-500">
                        No companies awaiting approval.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold mb-4">Company details</h3>
            {selectedCompany ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="font-semibold">{selectedCompany.companyName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Registration number</p>
                  <p className="font-semibold">{selectedCompany.registrationNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-semibold">{selectedCompany.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Documents</p>
                  <ul className="list-disc list-inside space-y-1">
                    {(selectedCompany.documents || []).map((doc) => (
                      <li key={doc.publicId}>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:text-blue-700 underline text-sm"
                        >
                          {doc.fileName || doc.publicId}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Rejection reason</label>
                  <textarea
                    value={rejectionReason}
                    onChange={(event) => setRejectionReason(event.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Explain why this application is being rejected"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleReject}
                    disabled={decisionLoading}
                    className="flex-1 py-2.5 rounded-lg border border-rose-200 text-rose-700 font-semibold hover:bg-rose-50 disabled:opacity-60"
                  >
                    Reject
                  </button>
                  <button
                    onClick={handleApprove}
                    disabled={decisionLoading}
                    className="flex-1 py-2.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-60"
                  >
                    Approve
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Select a company from the table to review documents.</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold mb-4">Approved companies</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {approved.length ? approved.map((company) => (
                <div key={company.id} className="p-4 border border-emerald-100 rounded-xl">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{company.companyName}</p>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                      Approved
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{company.registrationNumber}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Approved on {company.approvedAt ? new Date(company.approvedAt).toLocaleDateString() : '—'}
                  </p>
                </div>
              )) : (
                <p className="text-sm text-gray-500">No approved companies yet.</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold mb-4">Rejected companies</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {rejected.length ? rejected.map((company) => (
                <div key={company.id} className="p-4 border border-rose-100 rounded-xl">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{company.companyName}</p>
                    <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-3 py-1 rounded-full">
                      Rejected
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{company.registrationNumber}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Reason: {company.rejectionReason || 'Not provided'}
                  </p>
                </div>
              )) : (
                <p className="text-sm text-gray-500">No rejected companies yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold mb-1">Activity log</h3>
          <p className="text-sm text-gray-500 mb-4">Most recent approval and rejection events.</p>
          <div className="space-y-4">
            {activity.length ? activity.map((item) => (
              <div key={item.id} className="flex items-start gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-purple-500" />
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{item.action}</p>
                  <p className="text-sm text-gray-500">
                    {item.details?.companyName || 'N/A'} · {item.performedBy}
                  </p>
                  <p className="text-xs text-gray-400">{new Date(item.timestamp).toLocaleString()}</p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-gray-500">No activity recorded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

