import { useState } from 'react'
import { getStatusColor } from '../../utils/statusUtils'

export default function AvailableTenders({ tenders, onTenderSelect, selectedTender, onBack, showBidForm, onToggleBidForm }) {
  const [bidAmount, setBidAmount] = useState('')
  const [durationValue, setDurationValue] = useState('')
  const [durationUnit, setDurationUnit] = useState('months')
  const [comments, setComments] = useState('')

  const handleBidSubmit = () => {
    if (bidAmount.trim() && durationValue.trim()) {
      const duration = `${durationValue} ${durationUnit}`
      alert(`Bid raised for: ${selectedTender.title}\nBid Amount: ₹${bidAmount}\nDuration: ${duration}\nComments: ${comments || 'N/A'}`)
      setBidAmount('')
      setDurationValue('')
      setDurationUnit('months')
      setComments('')
      onToggleBidForm()
    } else {
      alert('Please fill in all required fields (Bid Amount and Duration)')
    }
  }

  if (selectedTender) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Available Tenders
        </button>

        <div className="border-b-2 border-blue-500 pb-4 mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedTender.title}</h2>
          <p className="text-gray-600">Issued by: <span className="font-semibold">{selectedTender.issuer}</span></p>
          <span className={`inline-block mt-2 px-4 py-1 rounded-full text-sm font-semibold border ${getStatusColor(selectedTender.status)}`}>
            {selectedTender.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Budget</label>
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
            <label className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Location</label>
            <p className="text-lg text-gray-800 mt-1">{selectedTender.location}</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="text-sm font-semibold text-blue-600 uppercase tracking-wide block mb-2">Description</label>
          <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">{selectedTender.description}</p>
        </div>

        <div className="mb-6">
          <label className="text-sm font-semibold text-blue-600 uppercase tracking-wide block mb-2">Requirements</label>
          <p className="text-gray-700 leading-relaxed bg-yellow-50 p-4 rounded-lg border border-yellow-200">{selectedTender.requirements}</p>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={onToggleBidForm}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Raise Your Bid
          </button>
          <button className="px-6 py-3 bg-blue-50 text-blue-600 rounded-lg font-semibold hover:bg-blue-100 transition-colors duration-200 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Tender Documents
          </button>
        </div>

        {showBidForm && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Raise Your Bid</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bid Amount (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your bid amount"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Project Duration <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    placeholder="Enter duration"
                    value={durationValue}
                    onChange={(e) => setDurationValue(e.target.value)}
                    min="1"
                    required
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <select
                    value={durationUnit}
                    onChange={(e) => setDurationUnit(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                  >
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                  </select>
                </div>
                <p className="text-xs text-gray-500 mt-1">Estimated time to complete the project from start date</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Comments</label>
                <textarea
                  placeholder="Add any comments or additional information about your bid..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-vertical"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleBidSubmit}
                  className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
                >
                  Raise Your Bid
                </button>
                <button
                  onClick={onToggleBidForm}
                  className="px-6 py-2.5 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Tenders for Bidding</h2>
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
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-800">Issuer:</span> {tender.issuer}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-800">Budget:</span> 
                <span className="text-blue-600 font-bold ml-1">{tender.budget}</span>
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-800">Deadline:</span> {tender.deadline}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-800">Category:</span> {tender.category}
              </p>
            </div>

            <button
              onClick={() => onTenderSelect(tender)}
              className="w-full py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              View & Bid
            </button>
          </div>
        ))}
      </div>

      {tenders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No tenders available for bidding at the moment.</p>
        </div>
      )}
    </div>
  )
}

