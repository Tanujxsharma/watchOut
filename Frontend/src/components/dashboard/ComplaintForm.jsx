export default function ComplaintForm({ 
  complaintText, 
  onComplaintTextChange, 
  onSubmit, 
  onCancel 
}) {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">File a Complaint</h3>
      <textarea
        placeholder="Describe your complaint in detail..."
        value={complaintText}
        onChange={(e) => onComplaintTextChange(e.target.value)}
        rows="5"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-vertical"
      />
      <div className="flex gap-3 mt-4">
        <button
          onClick={onSubmit}
          className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
        >
          Submit Complaint
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-2.5 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

