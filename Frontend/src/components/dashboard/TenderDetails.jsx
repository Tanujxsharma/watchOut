import { getStatusColor } from '../../utils/statusUtils'
import ComplaintForm from './ComplaintForm'

export default function TenderDetails({ 
  tender, 
  complaints, 
  onBack, 
  showComplaintForm,
  complaintText,
  onComplaintTextChange,
  onComplaintSubmit,
  onToggleComplaintForm
}) {
  const relatedComplaints = complaints.filter(c => c.tenderId === tender.id)

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200 flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Tenders
      </button>

      <div className="border-b-2 border-blue-500 pb-4 mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{tender.title}</h2>
        <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold border ${getStatusColor(tender.status)}`}>
          {tender.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <label className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Company</label>
          <p className="text-lg text-gray-800 mt-1">{tender.company}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <label className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Budget</label>
          <p className="text-lg text-gray-800 mt-1 font-bold text-blue-600">{tender.budget}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <label className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Deadline</label>
          <p className="text-lg text-gray-800 mt-1">{tender.deadline}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <label className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Category</label>
          <p className="text-lg text-gray-800 mt-1">{tender.category}</p>
        </div>
      </div>

      <div className="mb-6">
        <label className="text-sm font-semibold text-blue-600 uppercase tracking-wide block mb-2">Description</label>
        <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">{tender.description}</p>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <button className="px-6 py-3 bg-blue-50 text-blue-600 rounded-lg font-semibold hover:bg-blue-100 transition-colors duration-200 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Details
        </button>
        <button
          onClick={onToggleComplaintForm}
          className="px-6 py-3 bg-yellow-50 text-yellow-700 rounded-lg font-semibold hover:bg-yellow-100 transition-colors duration-200 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          File a Complaint
        </button>
      </div>

      {showComplaintForm && (
        <ComplaintForm
          complaintText={complaintText}
          onComplaintTextChange={onComplaintTextChange}
          onSubmit={onComplaintSubmit}
          onCancel={onToggleComplaintForm}
        />
      )}

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Related Complaints ({tender.complaints})
        </h3>
        {relatedComplaints.length > 0 ? (
          relatedComplaints.map(complaint => (
            <div key={complaint.id} className="bg-white border-l-4 border-blue-500 rounded-lg p-4 mb-3">
              <p className="text-gray-800 mb-2"><strong>Issue:</strong> {complaint.issue}</p>
              <div className="flex items-center gap-4 text-sm">
                <span>
                  <strong>Status:</strong>{' '}
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(complaint.status)}`}>
                    {complaint.status}
                  </span>
                </span>
                <span className="text-gray-600"><strong>Date:</strong> {complaint.date}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No complaints for this tender yet.</p>
        )}
      </div>
    </div>
  )
}

