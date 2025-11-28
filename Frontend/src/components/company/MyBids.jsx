import { getStatusColor } from '../../utils/statusUtils'

export default function MyBids({ bids }) {
  const getBidStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'under review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Bids</h2>
      <div className="space-y-4">
        {bids.map(bid => (
          <div
            key={bid.id}
            className="border border-gray-200 rounded-xl p-6 bg-gradient-to-br from-white to-gray-50 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{bid.tenderTitle}</h3>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Submitted:</span> {bid.submittedDate}
                </p>
              </div>
              <span className={`px-4 py-1 rounded-full text-sm font-semibold border ${getBidStatusColor(bid.status)}`}>
                {bid.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-semibold text-gray-600">Bid Amount</label>
                <p className="text-lg font-bold text-green-600">{bid.bidAmount}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Documents Submitted</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {bid.documents.map((doc, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                      {doc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-semibold hover:bg-blue-100 transition-colors duration-200 text-sm">
                View Details
              </button>
              <button className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 text-sm">
                Download Bid
              </button>
            </div>
          </div>
        ))}
      </div>

      {bids.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">You haven't submitted any bids yet.</p>
        </div>
      )}
    </div>
  )
}

