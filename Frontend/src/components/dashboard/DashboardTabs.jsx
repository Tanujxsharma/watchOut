export default function DashboardTabs({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'tenders', label: '📋 Recent Tenders', icon: '📋' },
    { id: 'complaints', label: '⚠️ View Complaints', icon: '⚠️' },
    { id: 'analytics', label: '📊 Analytics', icon: '📊' },
    { id: 'myComplaints', label: '📝 My Complaints', icon: '📝' }
  ]

  return (
    <div className="bg-white rounded-xl shadow-lg mb-6 p-2 flex flex-wrap gap-2">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
            activeTab === tab.id
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

