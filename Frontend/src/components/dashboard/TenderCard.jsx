import { getStatusColor } from '../../utils/statusUtils'

export default function TenderCard({ tender, onViewDetails }) {
  return (
    <div className="border border-gray-200 rounded-xl p-6 bg-gradient-to-br from-white to-gray-50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex-1 pr-2">{tender.title}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(tender.status)}`}>
          {tender.status}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-800">Company:</span> {tender.company}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-800">Budget:</span> 
          <span className="text-blue-600 font-bold ml-1">{tender.budget}</span>
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-800">Deadline:</span> {tender.deadline}
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
        onClick={() => onViewDetails(tender)}
        className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
      >
        View Details
      </button>
    </div>
  )
}

