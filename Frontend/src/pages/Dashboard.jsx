import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { demoTenders, demoComplaints, demoAnalytics, demoUserComplaints } from '../data/demoData';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardTabs from '../components/dashboard/DashboardTabs';
import TendersList from '../components/dashboard/TendersList';
import TenderDetails from '../components/dashboard/TenderDetails';
import ComplaintsList from '../components/dashboard/ComplaintsList';
import Analytics from '../components/dashboard/Analytics';
import MyComplaints from '../components/dashboard/MyComplaints';
import { useAuth } from '../context/AuthContext.jsx';
import { variants } from '../styles/theme';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === 'company') {
      navigate('/company-dashboard', { replace: true });
    }
  }, [user, navigate]);

  if (user?.role === 'company') {
    return null;
  }

  const [activeTab, setActiveTab] = useState('tenders');
  const [selectedTender, setSelectedTender] = useState(null);
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [complaintText, setComplaintText] = useState('');

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSelectedTender(null);
  };

  const handleTenderSelect = (tender) => {
    setSelectedTender(tender);
  };

  const handleComplaintSubmit = () => {
    if (complaintText.trim()) {
      alert(`Complaint submitted for: ${selectedTender.title}`);
      setComplaintText('');
      setShowComplaintForm(false);
    }
  };

  const handleToggleComplaintForm = () => {
    setShowComplaintForm(!showComplaintForm);
  };

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants.fadeIn}
      className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <DashboardHeader userType="public" />

        <DashboardTabs activeTab={activeTab} onTabChange={handleTabChange} />

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'tenders' && !selectedTender && (
            <TendersList tenders={demoTenders} onTenderSelect={handleTenderSelect} />
          )}

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

          {activeTab === 'complaints' && (
            <ComplaintsList complaints={demoComplaints} />
          )}

          {activeTab === 'analytics' && (
            <Analytics analytics={demoAnalytics} />
          )}

          {activeTab === 'myComplaints' && (
            <MyComplaints userComplaints={demoUserComplaints} />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
