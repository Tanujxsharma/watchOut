import { getStatusColor } from '../../utils/statusUtils'

export default function ComplaintCard({ complaint }) {
  return (
    <div className="border border-gray-200 rounded-xl p-6 bg-gradient-to-br from-white to-gray-50 hover:shadow-xl transition-all duration-300">
      <h3 className="text-lg font-bold text-gray-800 mb-3">{complaint.tenderTitle}</h3>
      <p className="text-sm text-gray-600 mb-2"><strong>Issue:</strong> {complaint.issue}</p>
      <p className="text-sm text-gray-600 mb-2"><strong>Complainant:</strong> {complaint.complainant}</p>
      <p className="text-sm text-gray-600 mb-3"><strong>Date:</strong> {complaint.date}</p>
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(complaint.status)}`}>
        {complaint.status}
      </span>
    </div>
  )
}

