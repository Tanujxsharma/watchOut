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
    setIsSubmitting(true);
    const formData = new FormData(event.target);
    const payload = {
      companyName: formData.get('companyName'),
      registrationNumber: formData.get('registrationNumber'),
      address: formData.get('address'),
      documents: await encodeDocuments(documents)
    };

    try {
      await apiClient.post('/companies/register', payload);
      toast.success('Profile submitted for approval');
      fetchProfile();
    } catch (error) {
      toast.error('Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTenderSelect = (tender) => {
    setSelectedTender(tender);
    setShowBidForm(false);
  };

  const handleBack = () => {
    setSelectedTender(null);
    setShowBidForm(false);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Company Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your profile, view tenders, and track your bids.</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-gray-200">
          {['profile', 'tenders', 'bids', 'my-tenders'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-2 text-sm font-medium capitalize transition-colors relative ${
                activeTab === tab ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.replace('-', ' ')}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'profile' && (
          <>
            {profile ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Company Profile</h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    profile.status === 'approved' ? 'bg-green-100 text-green-700' :
                    profile.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {profile.status.toUpperCase()}
                  </span>
                </div>
                
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-4 rounded-2xl bg-slate-50">
                    <dt className="text-xs uppercase text-gray-500">Company Name</dt>
                    <dd className="text-lg font-semibold text-gray-900">{profile.companyName}</dd>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50">
                    <dt className="text-xs uppercase text-gray-500">Registration Number</dt>
                    <dd className="text-lg font-semibold text-gray-900">{profile.registrationNumber}</dd>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 sm:col-span-2">
                    <dt className="text-xs uppercase text-gray-500">Registered Address</dt>
                    <dd className="text-base text-gray-900 mt-1">{profile.address}</dd>
                  </div>
                </dl>

                <div className="mt-6">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Uploaded Documents</p>
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
                    <p className="text-sm font-semibold text-rose-700">Rejection Reason</p>
                    <p className="text-sm text-rose-600 mt-1">{profile.rejectionReason}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Submit Your Company Profile</h2>
                <p className="text-gray-500 text-sm mb-6">
                  Provide full details and upload registration documents for government review.
                </p>
                <form className="space-y-4" onSubmit={handleResubmission}>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Company Name</label>
                      <input
                        type="text"
                        name="companyName"
                        required
                        className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="ACME Industries"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Registration Number</label>
                      <input
                        type="text"
                        name="registrationNumber"
                        required
                        className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="REG-123456"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Registered Address</label>
                    <textarea
                      name="address"
                      rows="3"
                      required
                      className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Full registered address"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Upload Compliance Documents</label>
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
                    className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition disabled:opacity-60"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
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
