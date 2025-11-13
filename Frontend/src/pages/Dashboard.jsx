import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { demoTenders, demoComplaints, demoAnalytics, demoUserComplaints } from '../data/demoData'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import DashboardTabs from '../components/dashboard/DashboardTabs'
import TendersList from '../components/dashboard/TendersList'
import TenderDetails from '../components/dashboard/TenderDetails'
import ComplaintsList from '../components/dashboard/ComplaintsList'
import Analytics from '../components/dashboard/Analytics'
import MyComplaints from '../components/dashboard/MyComplaints'

export default function Dashboard() {
  const location = useLocation()
  const navigate = useNavigate()
  const userType = location.state?.userType || localStorage.getItem('userType') || 'public'
  
  // Redirect companies to company dashboard
  useEffect(() => {
    if (userType === 'company') {
      navigate('/company-dashboard', { replace: true })
    }
  }, [userType, navigate])
  
  if (userType === 'company') {
    return null
  }
  
  // Public users can access dashboard without login (login is optional)
  // They can view tenders and file complaints
  
  const [activeTab, setActiveTab] = useState('tenders')
  const [selectedTender, setSelectedTender] = useState(null)
  const [showComplaintForm, setShowComplaintForm] = useState(false)
  const [complaintText, setComplaintText] = useState('')

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    setSelectedTender(null)
  }

  const handleTenderSelect = (tender) => {
    setSelectedTender(tender)
  }

  const handleComplaintSubmit = () => {
    if (complaintText.trim()) {
      alert(`Complaint submitted for: ${selectedTender.title}`)
      setComplaintText('')
      setShowComplaintForm(false)
    }
  }

  const handleToggleComplaintForm = () => {
    setShowComplaintForm(!showComplaintForm)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader userType={userType} />

        <DashboardTabs activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Tenders Tab */}
        {activeTab === 'tenders' && !selectedTender && (
          <TendersList tenders={demoTenders} onTenderSelect={handleTenderSelect} />
        )}

        {/* Tender Details View */}
        {activeTab === 'tenders' && selectedTender && (
          <TenderDetails
            tender={selectedTender}
            complaints={demoComplaints}
            onBack={() => setSelectedTender(null)}
            showComplaintForm={showComplaintForm}
            complaintText={complaintText}
            onComplaintTextChange={setComplaintText}
            onComplaintSubmit={handleComplaintSubmit}
            onToggleComplaintForm={handleToggleComplaintForm}
          />
        )}

        {/* Complaints Tab */}
        {activeTab === 'complaints' && (
          <ComplaintsList complaints={demoComplaints} />
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <Analytics analytics={demoAnalytics} />
        )}

        {/* My Complaints Tab */}
        {activeTab === 'myComplaints' && (
          <MyComplaints userComplaints={demoUserComplaints} />
        )}
      </div>
    </div>
  )
}
