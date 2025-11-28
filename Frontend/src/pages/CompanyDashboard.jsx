import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import apiClient from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import AvailableTenders from '../components/company/AvailableTenders';
import MyBids from '../components/company/MyBids';
import MyTenders from '../components/company/MyTenders';
import { demoTenders, companyBids, companyTenders } from '../data/demoData';

export default function CompanyDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [selectedTender, setSelectedTender] = useState(null);
  const [showBidForm, setShowBidForm] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const { data } = await apiClient.get('/companies/profile');
      setProfile(data);
    } catch (error) {
      if (error.response?.status === 404) {
        setProfile(null);
      } else {
        toast.error('Unable to load company profile');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const encodeDocuments = async (files) => {
    const readers = Array.from(files).map(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve({
            fileName: file.name,
            base64: reader.result
          });
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    );
    return Promise.all(readers);
  };

  const handleResubmission = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const companyName = formData.get('companyName');
    const registrationNumber = formData.get('registrationNumber');
    const address = formData.get('address');

    if (!companyName || !registrationNumber || !address) {
      toast.error('All company fields are required');
      return;
    }

    setIsSubmitting(true);
    try {
      const encodedDocs = await encodeDocuments(documents);
      await apiClient.post('/companies/register', {
        companyName,
        registrationNumber,
        address,
        documents: encodedDocs
      });
      toast.success('Company profile submitted for review');
      fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to submit company data');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading your company dashboard...</p>
      </div>
    );
  }

  const statusColorMap = {
    approved: 'text-emerald-600 bg-emerald-100',
    pending: 'text-amber-600 bg-amber-100',
    rejected: 'text-rose-600 bg-rose-100'
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedTender(null);
    setShowBidForm(false);
  };

  const handleTenderSelect = (tender) => {
    setSelectedTender(tender);
  };

  const handleBack = () => {
    setSelectedTender(null);
    setShowBidForm(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest">Company workspace</p>
          <h1 className="text-3xl font-bold mt-1 text-gray-900">Welcome back, {user?.displayName}</h1>
          <p className="text-gray-500 mt-2">
            Monitor your approval status, browse available tenders, manage your bids, and track your active projects.
          </p>

          {/* Tab Navigation */}
          <div className="mt-6 flex flex-wrap gap-2 border-b border-gray-200">
            <button
              onClick={() => handleTabChange('profile')}
              className={`px-6 py-3 font-semibold transition-colors ${activeTab === 'profile'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
                }`}
            >
              Company Profile
            </button>
            <button
              onClick={() => handleTabChange('tenders')}
              className={`px-6 py-3 font-semibold transition-colors ${activeTab === 'tenders'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
                }`}
            >
              Available Tenders
            </button>
            <button
              onClick={() => handleTabChange('bids')}
              className={`px-6 py-3 font-semibold transition-colors ${activeTab === 'bids'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
                }`}
            >
              My Bids
            </button>
            <button
              onClick={() => handleTabChange('my-tenders')}
              className={`px-6 py-3 font-semibold transition-colors ${activeTab === 'my-tenders'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
                }`}
            >
              My Tenders
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50">
              <p className="text-xs font-semibold text-gray-500 uppercase">Current status</p>
              <p className={`inline-flex mt-2 px-3 py-1 text-sm font-semibold rounded-full ${statusColorMap[profile?.status || user?.status] || 'text-gray-700 bg-gray-100'}`}>
                {profile?.status || user?.status || 'pending'}
              </p>
            </div>
            <div className="p-4 rounded-2xl border border-slate-100">
              <p className="text-xs font-semibold text-gray-500 uppercase">Documents uploaded</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{profile?.documents?.length || 0}</p>
            </div>
            <div className="p-4 rounded-2xl border border-slate-100">
              <p className="text-xs font-semibold text-gray-500 uppercase">Last updated</p>
              <p className="text-sm text-gray-700 mt-2">
                {profile?.updatedAt ? new Date(profile.updatedAt).toLocaleString() : 'Not submitted yet'}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <>
            {profile ? (
              <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">Company details</h2>
                    <p className="text-gray-500 text-sm">Submitted data awaiting review.</p>
                  </div>
                  <span className="text-sm text-gray-500">UID: {profile.id}</span>
                </div>
                <dl className="grid gap-4 sm:grid-cols-2">
                  <div className="p-4 rounded-2xl bg-slate-50">
                    <dt className="text-xs uppercase text-gray-500">Company name</dt>
                    <dd className="text-lg font-semibold text-gray-900">{profile.companyName}</dd>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50">
                    <dt className="text-xs uppercase text-gray-500">Registration number</dt>
                    <dd className="text-lg font-semibold text-gray-900">{profile.registrationNumber}</dd>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 sm:col-span-2">
                    <dt className="text-xs uppercase text-gray-500">Registered address</dt>
                    <dd className="text-base text-gray-900 mt-1">{profile.address}</dd>
                  </div>
                </dl>

                <div className="mt-6">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Uploaded documents</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {(profile.documents || []).map((doc) => (
                      <a
                        key={doc.publicId}
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition"
                      >
                        <div>
                          <p className="font-semibold text-gray-800">{doc.fileName || doc.publicId}</p>
                          <p className="text-xs text-gray-500">{doc.mimeType}</p>
                        </div>
                        <span className="text-sm font-semibold text-blue-600">View</span>
                      </a>
                    ))}
                    {!profile.documents?.length && (
                      <p className="text-sm text-gray-500">No documents uploaded yet.</p>
                    )}
                  </div>
                </div>

                {profile.rejectionReason && (
                  <div className="mt-6 p-4 rounded-2xl border border-rose-200 bg-rose-50">
                    <p className="text-sm font-semibold text-rose-700">Rejection reason</p>
                    <p className="text-sm text-rose-600 mt-1">{profile.rejectionReason}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Submit your company profile</h2>
                <p className="text-gray-500 text-sm mb-6">
                  Provide full details and upload registration documents for government review.
                </p>
                <form className="space-y-4" onSubmit={handleResubmission}>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Company name</label>
                      <input
                        type="text"
                        name="companyName"
                        className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="ACME Industries"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Registration number</label>
                      <input
                        type="text"
                        name="registrationNumber"
                        className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="REG-123456"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Registered address</label>
                    <textarea
                      name="address"
                      rows="3"
                      className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Full registered address"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Upload compliance documents</label>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(event) => setDocuments(Array.from(event.target.files))}
                      className="mt-1 w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-60"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit for approval'}
                  </button>
                </form>
              </div>
            )}
          </>
        )}

        {activeTab === 'tenders' && (
          <AvailableTenders
            tenders={demoTenders}
            onTenderSelect={handleTenderSelect}
            selectedTender={selectedTender}
            onBack={handleBack}
            showBidForm={showBidForm}
            onToggleBidForm={() => setShowBidForm(!showBidForm)}
          />
        )}

        {activeTab === 'bids' && (
          <MyBids bids={companyBids} />
        )}

        {activeTab === 'my-tenders' && (
          <MyTenders
            tenders={companyTenders}
            onTenderSelect={handleTenderSelect}
            selectedTender={selectedTender}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
}

