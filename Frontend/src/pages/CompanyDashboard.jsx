import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { governmentTenders, companyTenders, companyBids, companyTenderComplaints } from '../data/demoData'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import DashboardTabs from '../components/dashboard/DashboardTabs'
import MyTenders from '../components/company/MyTenders'
import AvailableTenders from '../components/company/AvailableTenders'
import MyBids from '../components/company/MyBids'
import TenderComplaints from '../components/company/TenderComplaints'

export default function CompanyDashboard() {
  const location = useLocation()
  const navigate = useNavigate()
  const userType = location.state?.userType || localStorage.getItem('userType')
  
  // Protect route - redirect to login if not logged in as company
  useEffect(() => {
    if (!userType || userType !== 'company') {
      navigate('/login', { replace: true, state: { redirectTo: '/company-dashboard', requireCompany: true } })
    }
  }, [userType, navigate])
  
  // Show nothing while checking authentication
  if (!userType || userType !== 'company') {
    return null
  }
  
  const [activeTab, setActiveTab] = useState('myTenders')
  const [selectedTender, setSelectedTender] = useState(null)
  const [selectedGovTender, setSelectedGovTender] = useState(null)
  const [showBidForm, setShowBidForm] = useState(false)

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    setSelectedTender(null)
    setSelectedGovTender(null)
  }

  const handleTenderSelect = (tender) => {
    setSelectedTender(tender)
  }

  const handleGovTenderSelect = (tender) => {
    setSelectedGovTender(tender)
  }

  const tabs = [
    { id: 'myTenders', label: '🏗️ My Tenders' },
    { id: 'availableTenders', label: '📋 Available Tenders' },
    { id: 'myBids', label: '💼 My Bids' },
    { id: 'complaints', label: '⚠️ Complaints on My Tenders' }
  ]

  // Calculate My Tenders summary stats
  const myTendersStats = {
    total: companyTenders.length,
    inProgress: companyTenders.filter(t => t.status === 'In Progress').length,
    totalRaiseAmount: companyTenders.reduce((sum, t) => {
      // Parse Indian numbering format (₹2,35,00,000 = 23500000)
      const amountStr = t.raiseAmount?.replace(/[₹,]/g, '') || '0'
      const amount = parseFloat(amountStr) || 0
      return sum + amount
    }, 0),
    totalComplaints: companyTenders.reduce((sum, t) => sum + (t.complaints || 0), 0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader userType={userType} />

        {/* My Tenders Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Tenders</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{myTendersStats.total}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">In Progress</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{myTendersStats.inProgress}</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Raise Amount</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">
                  ₹{(myTendersStats.totalRaiseAmount / 10000000).toFixed(2)}Cr
                </p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Complaints</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{myTendersStats.totalComplaints}</p>
              </div>
              <div className="bg-red-100 rounded-full p-3">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg mb-6 p-2 flex flex-wrap gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
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

        {/* My Tenders Tab */}
        {activeTab === 'myTenders' && (
          <MyTenders 
            tenders={companyTenders} 
            onTenderSelect={handleTenderSelect}
            selectedTender={selectedTender}
            onBack={() => setSelectedTender(null)}
          />
        )}

        {/* Available Tenders Tab */}
        {activeTab === 'availableTenders' && (
          <AvailableTenders 
            tenders={governmentTenders}
            onTenderSelect={handleGovTenderSelect}
            selectedTender={selectedGovTender}
            onBack={() => setSelectedGovTender(null)}
            showBidForm={showBidForm}
            onToggleBidForm={() => setShowBidForm(!showBidForm)}
          />
        )}

        {/* My Bids Tab */}
        {activeTab === 'myBids' && (
          <MyBids bids={companyBids} />
        )}

        {/* Complaints Tab */}
        {activeTab === 'complaints' && (
          <TenderComplaints complaints={companyTenderComplaints} />
        )}
      </div>
    </div>
  )
}

