import { motion } from 'framer-motion';

export default function DashboardTabs({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'tenders', label: 'Active Tenders' },
    { id: 'complaints', label: 'Public Complaints' },
    { id: 'analytics', label: 'Transparency Analytics' },
    { id: 'myComplaints', label: 'My Complaints' },
  ];

  return (
    <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-slate-200 mb-8 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            relative px-6 py-2.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap
            ${activeTab === tab.id ? 'text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}
          `}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-blue-50 rounded-lg border border-blue-100"
              initial={false}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative z-10">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
