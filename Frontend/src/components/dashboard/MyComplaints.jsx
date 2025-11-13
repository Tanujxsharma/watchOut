export default function MyComplaints({ userComplaints }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Submitted Complaints</h2>
      {userComplaints.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500 text-lg">You haven't submitted any complaints yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {userComplaints.map(complaint => (
            <div key={complaint.id} className="border border-gray-200 rounded-lg p-4">
              {/* Render user complaints here */}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

