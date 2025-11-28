import { useState } from 'react'
import { getStatusColor } from '../../utils/statusUtils'
import ComplaintCard from '../dashboard/ComplaintCard'
import { companyTenderComplaints } from '../../data/demoData'

export default function MyTenders({ tenders, onTenderSelect, selectedTender, onBack }) {
  const [showProgressForm, setShowProgressForm] = useState(false)
  const [showFundRequestForm, setShowFundRequestForm] = useState(false)
  const [progressInfo, setProgressInfo] = useState({
    completion: '',
    progressNotes: '',
    milestones: ''
  })
  const [fundRequest, setFundRequest] = useState({
    requestedAmount: '',
    reason: '',
    justification: ''
  })

  if (selectedTender) {
    const relatedComplaints = companyTenderComplaints.filter(c => c.tenderId === selectedTender.id)

    // Initialize progress info with current tender data when form opens
    const handleOpenProgressForm = () => {
      if (!showProgressForm) {
        setProgressInfo({
          completion: selectedTender.completion || '',
          progressNotes: '',
          milestones: ''
        })
      }
      setShowProgressForm(!showProgressForm)
    }

    const handleProgressSubmit = () => {
      if (progressInfo.completion || progressInfo.progressNotes.trim()) {
        alert(`Progress update submitted for: ${selectedTender.title}\nCompletion: ${progressInfo.completion}\nNotes: ${progressInfo.progressNotes}`)
        setShowProgressForm(false)
        setProgressInfo({ completion: '', progressNotes: '', milestones: '' })
      } else {
        alert('Please provide at least completion percentage or progress notes')
      }
    }

    const handleFundRequestSubmit = () => {
      if (fundRequest.requestedAmount.trim() && fundRequest.reason.trim()) {
        alert(`Fund request submitted to government:\nTender: ${selectedTender.title}\nRequested Amount: ₹${fundRequest.requestedAmount}\nReason: ${fundRequest.reason}`)
        setShowFundRequestForm(false)
        setFundRequest({ requestedAmount: '', reason: '', justification: '' })
      } else {
        alert('Please fill in all required fields (Requested Amount and Reason)')
      }
    }
    
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to My Tenders
        </button>

        <div className="border-b-2 border-blue-500 pb-4 mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedTender.title}</h2>
          <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold border ${getStatusColor(selectedTender.status)}`}>
            {selectedTender.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Tender Status</label>
            <p className="text-lg text-gray-800 mt-1">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(selectedTender.status)}`}>
                {selectedTender.status}
              </span>
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Raise Amount (Bid Won)</label>
            <p className="text-lg text-gray-800 mt-1 font-bold text-green-600">{selectedTender.raiseAmount || 'N/A'}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Original Budget</label>
            <p className="text-lg text-gray-800 mt-1 font-bold text-blue-600">{selectedTender.budget}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Deadline</label>
            <p className="text-lg text-gray-800 mt-1">{selectedTender.deadline}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Category</label>
            <p className="text-lg text-gray-800 mt-1">{selectedTender.category}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Completion</label>
            <p className="text-lg text-gray-800 mt-1 font-bold text-green-600">{selectedTender.completion}</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="text-sm font-semibold text-blue-600 uppercase tracking-wide block mb-2">Description</label>
          <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">{selectedTender.description}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={handleOpenProgressForm}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Update Progress Information
          </button>
          <button
            onClick={() => setShowFundRequestForm(!showFundRequestForm)}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Request Additional Funds from Government
          </button>
        </div>

        {/* Progress Update Form */}
        {showProgressForm && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Update Progress Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Completion Percentage <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Enter completion percentage"
                    value={progressInfo.completion.replace(/%/g, '')}
                    onChange={(e) => {
                      const value = e.target.value
                      setProgressInfo({ ...progressInfo, completion: value ? value + '%' : '' })
                    }}
                    className="w-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="text-gray-600">%</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Progress Notes</label>
                <textarea
                  placeholder="Describe the current progress, milestones achieved, challenges faced, etc..."
                  value={progressInfo.progressNotes}
                  onChange={(e) => setProgressInfo({ ...progressInfo, progressNotes: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Key Milestones</label>
                <textarea
                  placeholder="List key milestones completed or upcoming..."
                  value={progressInfo.milestones}
                  onChange={(e) => setProgressInfo({ ...progressInfo, milestones: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleProgressSubmit}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                >
                  Submit Progress Update
                </button>
                <button
                  onClick={() => {
                    setShowProgressForm(false)
                    setProgressInfo({ completion: '', progressNotes: '', milestones: '' })
                  }}
                  className="px-6 py-2.5 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Fund Request Form */}
        {showFundRequestForm && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Request Additional Funds from Government</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Raise Amount
                  </label>
                  <p className="px-4 py-3 bg-gray-100 rounded-lg font-bold text-green-600">
                    {selectedTender.raiseAmount || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Original Budget
                  </label>
                  <p className="px-4 py-3 bg-gray-100 rounded-lg font-bold text-blue-600">
                    {selectedTender.budget}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Requested Additional Amount (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter the additional amount you need"
                  value={fundRequest.requestedAmount}
                  onChange={(e) => setFundRequest({ ...fundRequest, requestedAmount: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reason for Additional Funds <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Explain why you need additional funds (e.g., unexpected costs, scope changes, etc.)"
                  value={fundRequest.reason}
                  onChange={(e) => setFundRequest({ ...fundRequest, reason: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-vertical"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Justification & Details</label>
                <textarea
                  placeholder="Provide detailed justification, breakdown of costs, timeline impact, etc..."
                  value={fundRequest.justification}
                  onChange={(e) => setFundRequest({ ...fundRequest, justification: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-vertical"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleFundRequestSubmit}
                  className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
                >
                  Submit Fund Request to Government
                </button>
                <button
                  onClick={() => {
                    setShowFundRequestForm(false)
                    setFundRequest({ requestedAmount: '', reason: '', justification: '' })
                  }}
                  className="px-6 py-2.5 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Complaints on this tender */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Complaints on This Tender ({selectedTender.complaints})
          </h3>
          {relatedComplaints.length > 0 ? (
            <div className="space-y-3">
              {relatedComplaints.map(complaint => (
                <div key={complaint.id} className="bg-white border-l-4 border-red-500 rounded-lg p-4">
                  <p className="text-gray-800 mb-2"><strong>Issue:</strong> {complaint.issue}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span>
                      <strong>Complainant:</strong> {complaint.complainant}
                    </span>
                    <span>
                      <strong>Status:</strong>{' '}
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(complaint.status)}`}>
                        {complaint.status}
                      </span>
                    </span>
                    <span className="text-gray-600"><strong>Date:</strong> {complaint.date}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No complaints for this tender yet.</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Tenders</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tenders.map(tender => (
          <div
            key={tender.id}
            className="border border-gray-200 rounded-xl p-6 bg-gradient-to-br from-white to-gray-50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-gray-800 flex-1 pr-2">{tender.title}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(tender.status)}`}>
                {tender.status}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-800 text-sm">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(tender.status)}`}>
                  {tender.status}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-800">Raise Amount:</span> 
                <span className="text-green-600 font-bold ml-1">{tender.raiseAmount || 'N/A'}</span>
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-800">Original Budget:</span> 
                <span className="text-blue-600 font-bold ml-1">{tender.budget}</span>
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-800">Deadline:</span> {tender.deadline}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-800">Completion:</span> 
                <span className="text-green-600 font-bold ml-1">{tender.completion}</span>
              </p>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800 text-sm">Complaints:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  tender.complaints > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                  {tender.complaints}
                </span>
              </div>
            </div>

            <button
              onClick={() => onTenderSelect(tender)}
              className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {tenders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">You don't have any active tenders yet.</p>
        </div>
      )}
    </div>
  )
}

