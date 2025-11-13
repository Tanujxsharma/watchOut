import { getStatusColor } from '../../utils/statusUtils'

export default function TenderComplaints({ complaints }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Complaints on My Tenders</h2>
      <div className="space-y-4">
        {complaints.map(complaint => (
          <div
            key={complaint.id}
            className="border-l-4 border-red-500 bg-red-50 rounded-lg p-6 hover:shadow-md transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 mb-1">{complaint.tenderTitle}</h3>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Complainant:</span> {complaint.complainant}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(complaint.status)}`}>
                {complaint.status}
              </span>
            </div>

            <div className="mb-3">
              <label className="text-sm font-semibold text-gray-700 block mb-1">Issue:</label>
              <p className="text-gray-800 bg-white p-3 rounded-lg">{complaint.issue}</p>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-600">
                <span className="font-semibold">Date:</span> {complaint.date}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                complaint.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                Priority: {complaint.priority}
              </span>
            </div>

            {complaint.response && (
              <div className="mt-3 pt-3 border-t border-red-200">
                <label className="text-sm font-semibold text-green-700 block mb-1">Response:</label>
                <p className="text-gray-700 bg-green-50 p-3 rounded-lg">{complaint.response}</p>
              </div>
            )}

            {!complaint.response && (
              <div className="mt-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 text-sm">
                  Respond to Complaint
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {complaints.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No complaints on your tenders.</p>
        </div>
      )}
    </div>
  )
}

