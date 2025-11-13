import { useState } from 'react'
import TenderCard from './TenderCard'

export default function TendersList({ tenders, onTenderSelect }) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTenders = tenders.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.company.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Recent Tenders</h2>
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Search tenders by name or company..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTenders.map(tender => (
          <TenderCard key={tender.id} tender={tender} onViewDetails={onTenderSelect} />
        ))}
      </div>

      {filteredTenders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No tenders found matching your search.</p>
        </div>
      )}
    </div>
  )
}

