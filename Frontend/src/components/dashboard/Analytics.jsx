export default function Analytics({ analytics }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Platform Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg">
          <h3 className="text-sm font-semibold mb-2 opacity-90">Active Tenders</h3>
          <p className="text-5xl font-bold">{analytics.activeTenders}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-white shadow-lg">
          <h3 className="text-sm font-semibold mb-2 opacity-90">Total Complaints</h3>
          <p className="text-5xl font-bold">{analytics.totalComplaints}</p>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
          <h3 className="text-sm font-semibold mb-2 opacity-90">Resolved Issues</h3>
          <p className="text-5xl font-bold">{analytics.resolvedComplaints}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <h3 className="text-sm font-semibold mb-2 opacity-90">Under Review</h3>
          <p className="text-5xl font-bold">{analytics.underReviewComplaints}</p>
        </div>
      </div>
      <div className="mt-6 bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Total Budget</h3>
        <p className="text-4xl font-bold text-blue-600">{analytics.totalBudget}</p>
      </div>
    </div>
  )
}

