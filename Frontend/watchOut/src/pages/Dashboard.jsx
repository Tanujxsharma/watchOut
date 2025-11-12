import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import './Auth.css'
import './Dashboard.css'

export default function Dashboard () {
  const location = useLocation()
  const userType = location.state?.userType || localStorage.getItem('userType') || 'public'
  
  const [activeTab, setActiveTab] = useState('tenders')
  const [selectedTender, setSelectedTender] = useState(null)
  const [showComplaintForm, setShowComplaintForm] = useState(false)
  const [complaintText, setComplaintText] = useState('')

  // search state for tenders
  const [searchQuery, setSearchQuery] = useState('')

  // Dummy tender data
  const dummyTenders = [
    {
      id: 1,
      title: 'Highway Construction Project',
      company: 'BuildCorp Industries',
      budget: '$2,500,000',
      deadline: '2025-12-15',
      status: 'Open',
      description: 'Construction of 50km highway with modern infrastructure',
      complaints: 3
    },
    {
      id: 2,
      title: 'Water Supply System Upgrade',
      company: 'AquaTech Solutions',
      budget: '$1,800,000',
      deadline: '2025-11-30',
      status: 'Open',
      description: 'Modernization of water distribution network',
      complaints: 1
    },
    {
      id: 3,
      title: 'School Building Construction',
      company: 'EducationBuild Ltd',
      budget: '$950,000',
      deadline: '2025-12-01',
      status: 'Open',
      description: 'Construction of new school building with 50 classrooms',
      complaints: 0
    },
    {
      id: 4,
      title: 'Bridge Maintenance Project',
      company: 'InfrastructureCare',
      budget: '$750,000',
      deadline: '2025-11-25',
      status: 'Closing Soon',
      description: 'Maintenance and repair of City Bridge',
      complaints: 2
    },
    {
      id: 5,
      title: 'Street Lighting System',
      company: 'ElectroTech Corp',
      budget: '$500,000',
      deadline: '2025-12-10',
      status: 'Open',
      description: 'Installation of LED street lighting system',
      complaints: 0
    }
  ]

  const dummyComplaints = [
    {
      id: 1,
      tenderId: 1,
      tenderTitle: 'Highway Construction Project',
      complainant: 'John Doe',
      date: '2025-11-10',
      issue: 'Suspicious bidding process',
      status: 'Under Review'
    },
    {
      id: 2,
      tenderId: 2,
      tenderTitle: 'Water Supply System Upgrade',
      complainant: 'Jane Smith',
      date: '2025-11-08',
      issue: 'Non-transparent vendor selection',
      status: 'Resolved'
    },
    {
      id: 3,
      tenderId: 1,
      tenderTitle: 'Highway Construction Project',
      complainant: 'Mike Johnson',
      date: '2025-11-05',
      issue: 'Budget discrepancies',
      status: 'Under Review'
    }
  ]

  // filtered tenders by name/title (must be after dummyTenders is defined)
  const filteredTenders = dummyTenders.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleComplaintSubmit = () => {
    if (complaintText.trim()) {
      alert(`Complaint submitted for: ${selectedTender.title}`)
      setComplaintText('')
      setShowComplaintForm(false)
    }
  }

  return (
    <div className='auth-container'>
      <div className='dashboard-panel'>
        <h2 className='dashboard-title'>Welcome to watchOut Dashboard</h2>
        <p className='dashboard-subtitle'>Logged in as {userType === 'company' ? 'Company' : 'Public User'}</p>

        {/* Navigation Tabs */}
        <div className='dashboard-tabs'>
          <button 
            className={`tab-button ${activeTab === 'tenders' ? 'active' : ''}`}
            onClick={() => { setActiveTab('tenders'); setSelectedTender(null); }}
          >
            📋 Recent Tenders
          </button>
          <button 
            className={`tab-button ${activeTab === 'complaints' ? 'active' : ''}`}
            onClick={() => setActiveTab('complaints')}
          >
            ⚠️ View Complaints
          </button>
          <button 
            className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📊 Analytics
          </button>
          <button 
            className={`tab-button ${activeTab === 'myComplaints' ? 'active' : ''}`}
            onClick={() => setActiveTab('myComplaints')}
          >
            📝 My Complaints
          </button>
        </div>

        {/* Tenders Tab */}
        {activeTab === 'tenders' && !selectedTender && (
          <div className='tab-content'>
            <h3>Recent Tenders</h3>
            <div style={{ margin: '12px 0 20px' }}>
              <input
                type='text'
                placeholder='Search tenders by name...'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  maxWidth: '420px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '14px'
                }}
              />
            </div>
             <div className='tenders-list'>
              {filteredTenders.map(tender => (
                 <div key={tender.id} className='tender-card'>
                   <div className='tender-header'>
                     <h4>{tender.title}</h4>
                     <span className={`status-badge ${tender.status.toLowerCase().replace(' ', '-')}`}>
                       {tender.status}
                     </span>
                   </div>
                   <p className='tender-company'><strong>Company:</strong> {tender.company}</p>
                   <p className='tender-budget'><strong>Budget:</strong> {tender.budget}</p>
                   <p className='tender-deadline'><strong>Deadline:</strong> {tender.deadline}</p>
                   <p className='tender-complaints'>
                     <strong>Complaints:</strong> <span className='complaint-badge'>{tender.complaints}</span>
                   </p>
                   <button 
                     className='view-button'
                     onClick={() => setSelectedTender(tender)}
                   >
                     View Details
                   </button>
                 </div>
               ))}
             </div>
           </div>
         )}

        {/* Tender Details View */}
        {activeTab === 'tenders' && selectedTender && (
          <div className='tab-content tender-details'>
            <button 
              className='back-button'
              onClick={() => setSelectedTender(null)}
            >
              ← Back to Tenders
            </button>
            <div className='detail-card'>
              <h3>{selectedTender.title}</h3>
              <div className='detail-grid'>
                <div className='detail-item'>
                  <label>Company:</label>
                  <p>{selectedTender.company}</p>
                </div>
                <div className='detail-item'>
                  <label>Budget:</label>
                  <p>{selectedTender.budget}</p>
                </div>
                <div className='detail-item'>
                  <label>Deadline:</label>
                  <p>{selectedTender.deadline}</p>
                </div>
                <div className='detail-item'>
                  <label>Status:</label>
                  <p>{selectedTender.status}</p>
                </div>
              </div>
              <div className='detail-description'>
                <label>Description:</label>
                <p>{selectedTender.description}</p>
              </div>
              <div className='detail-actions'>
                <button className='download-button'>📥 Download Details</button>
                <button 
                  className='complaint-button'
                  onClick={() => setShowComplaintForm(!showComplaintForm)}
                >
                  ⚠️ File a Complaint
                </button>
              </div>

              {/* Complaint Form */}
              {showComplaintForm && (
                <div className='complaint-form'>
                  <h4>File a Complaint</h4>
                  <textarea
                    placeholder='Describe your complaint in detail...'
                    value={complaintText}
                    onChange={(e) => setComplaintText(e.target.value)}
                    rows='5'
                  ></textarea>
                  <div className='form-actions'>
                    <button className='submit-button' onClick={handleComplaintSubmit}>
                      Submit Complaint
                    </button>
                    <button 
                      className='cancel-button' 
                      onClick={() => setShowComplaintForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Related Complaints */}
              <div className='related-complaints'>
                <h4>Related Complaints ({selectedTender.complaints})</h4>
                {dummyComplaints
                  .filter(c => c.tenderId === selectedTender.id)
                  .map(complaint => (
                    <div key={complaint.id} className='complaint-item'>
                      <p><strong>Issue:</strong> {complaint.issue}</p>
                      <p><strong>Status:</strong> <span className={`complaint-status ${complaint.status.toLowerCase().replace(' ', '-')}`}>{complaint.status}</span></p>
                      <p><strong>Date:</strong> {complaint.date}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Complaints Tab */}
        {activeTab === 'complaints' && (
          <div className='tab-content'>
            <h3>All Complaints</h3>
            <div className='complaints-list'>
              {dummyComplaints.map(complaint => (
                <div key={complaint.id} className='complaint-card'>
                  <h4>{complaint.tenderTitle}</h4>
                  <p><strong>Issue:</strong> {complaint.issue}</p>
                  <p><strong>Complainant:</strong> {complaint.complainant}</p>
                  <p><strong>Date:</strong> {complaint.date}</p>
                  <span className={`status-badge ${complaint.status.toLowerCase().replace(' ', '-')}`}>
                    {complaint.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className='tab-content'>
            <h3>Platform Analytics</h3>
            <div className='analytics-grid'>
              <div className='analytics-card'>
                <h4>Active Tenders</h4>
                <p className='big-number'>{dummyTenders.length}</p>
              </div>
              <div className='analytics-card'>
                <h4>Total Complaints</h4>
                <p className='big-number'>{dummyComplaints.length}</p>
              </div>
              <div className='analytics-card'>
                <h4>Resolved Issues</h4>
                <p className='big-number'>{dummyComplaints.filter(c => c.status === 'Resolved').length}</p>
              </div>
              <div className='analytics-card'>
                <h4>Under Review</h4>
                <p className='big-number'>{dummyComplaints.filter(c => c.status === 'Under Review').length}</p>
              </div>
            </div>
          </div>
        )}

        {/* My Complaints Tab */}
        {activeTab === 'myComplaints' && (
          <div className='tab-content'>
            <h3>My Submitted Complaints</h3>
            <p className='empty-message'>You haven't submitted any complaints yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
