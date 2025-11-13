// Demo data for WatchOut application

export const demoTenders = [
  {
    id: 1,
    title: 'Highway Construction Project',
    company: 'BuildCorp Industries',
    budget: '₹2,50,00,000',
    deadline: '2025-12-15',
    status: 'Open',
    description: 'Construction of 50km highway with modern infrastructure including bridges, tunnels, and rest areas. This project aims to improve connectivity between major cities and reduce travel time significantly.',
    complaints: 3,
    category: 'Infrastructure',
    location: 'State Highway 101',
    startDate: '2025-01-15'
  },
  {
    id: 2,
    title: 'Water Supply System Upgrade',
    company: 'AquaTech Solutions',
    budget: '₹1,80,00,000',
    deadline: '2025-11-30',
    status: 'Open',
    description: 'Modernization of water distribution network including installation of smart meters, pipeline upgrades, and water treatment facility improvements. Expected to serve 50,000+ households.',
    complaints: 1,
    category: 'Utilities',
    location: 'Metropolitan Area',
    startDate: '2025-02-01'
  },
  {
    id: 3,
    title: 'School Building Construction',
    company: 'EducationBuild Ltd',
    budget: '₹95,00,000',
    deadline: '2025-12-01',
    status: 'Open',
    description: 'Construction of new school building with 50 classrooms, science labs, library, and sports facilities. The project includes modern amenities and eco-friendly design features.',
    complaints: 0,
    category: 'Education',
    location: 'District 5',
    startDate: '2025-03-01'
  },
  {
    id: 4,
    title: 'Bridge Maintenance Project',
    company: 'InfrastructureCare',
    budget: '₹75,00,000',
    deadline: '2025-11-25',
    status: 'Closing Soon',
    description: 'Comprehensive maintenance and repair of City Bridge including structural reinforcement, painting, and installation of safety barriers. Expected completion in 6 months.',
    complaints: 2,
    category: 'Infrastructure',
    location: 'City Center',
    startDate: '2025-01-20'
  },
  {
    id: 5,
    title: 'Street Lighting System',
    company: 'ElectroTech Corp',
    budget: '₹50,00,000',
    deadline: '2025-12-10',
    status: 'Open',
    description: 'Installation of LED street lighting system across 200+ streets. Includes smart lighting controls, energy-efficient fixtures, and automated dimming systems.',
    complaints: 0,
    category: 'Utilities',
    location: 'Citywide',
    startDate: '2025-02-15'
  },
  {
    id: 6,
    title: 'Hospital Equipment Procurement',
    company: 'MedEquip Solutions',
    budget: '₹3,20,00,000',
    deadline: '2025-12-20',
    status: 'Open',
    description: 'Procurement of advanced medical equipment including MRI machines, CT scanners, and surgical instruments for the new hospital wing. Includes training and maintenance contracts.',
    complaints: 1,
    category: 'Healthcare',
    location: 'Central Hospital',
    startDate: '2025-04-01'
  }
]

export const demoComplaints = [
  {
    id: 1,
    tenderId: 1,
    tenderTitle: 'Highway Construction Project',
    complainant: 'John Doe',
    date: '2025-11-10',
    issue: 'Suspicious bidding process - multiple companies submitted identical bids with unusual precision',
    status: 'Under Review',
    priority: 'High',
    response: null
  },
  {
    id: 2,
    tenderId: 2,
    tenderTitle: 'Water Supply System Upgrade',
    complainant: 'Jane Smith',
    date: '2025-11-08',
    issue: 'Non-transparent vendor selection process. Concerns about favoritism towards AquaTech Solutions.',
    status: 'Resolved',
    priority: 'Medium',
    response: 'Investigation completed. All procedures were followed correctly. Response provided to complainant.'
  },
  {
    id: 3,
    tenderId: 1,
    tenderTitle: 'Highway Construction Project',
    complainant: 'Mike Johnson',
    date: '2025-11-05',
    issue: 'Budget discrepancies found in the project proposal. Initial estimates seem inflated compared to similar projects.',
    status: 'Under Review',
    priority: 'High',
    response: null
  },
  {
    id: 4,
    tenderId: 4,
    tenderTitle: 'Bridge Maintenance Project',
    complainant: 'Sarah Williams',
    date: '2025-11-12',
    issue: 'Delayed project start date. Contract was awarded but work has not begun as scheduled.',
    status: 'Under Review',
    priority: 'Medium',
    response: null
  },
  {
    id: 5,
    tenderId: 6,
    tenderTitle: 'Hospital Equipment Procurement',
    complainant: 'Dr. Robert Chen',
    date: '2025-11-15',
    issue: 'Equipment specifications do not match the requirements outlined in the original tender document.',
    status: 'Under Review',
    priority: 'High',
    response: null
  }
]

export const demoAnalytics = {
  totalTenders: 6,
  activeTenders: 5,
  closedTenders: 1,
  totalComplaints: 5,
  resolvedComplaints: 1,
  underReviewComplaints: 4,
  totalBudget: '₹9,70,00,000',
  averageComplaintsPerTender: 1.17,
  categories: {
    'Infrastructure': 2,
    'Utilities': 2,
    'Education': 1,
    'Healthcare': 1
  }
}

export const demoUserComplaints = [
  // Empty for now - user hasn't submitted any complaints
]

// Government tenders (available for companies to bid on)
export const governmentTenders = [
  {
    id: 101,
    title: 'Smart City Infrastructure Development',
    issuer: 'Government of State',
    budget: '₹5,00,00,000',
    deadline: '2025-12-20',
    status: 'Open for Bidding',
    description: 'Development of smart city infrastructure including IoT sensors, data centers, and integrated management systems.',
    category: 'Infrastructure',
    location: 'State Capital',
    startDate: '2026-01-15',
    requirements: 'Minimum 5 years experience, ISO certification required'
  },
  {
    id: 102,
    title: 'Renewable Energy Park Construction',
    issuer: 'Ministry of Energy',
    budget: '₹8,50,00,000',
    deadline: '2025-12-25',
    status: 'Open for Bidding',
    description: 'Construction of a 100MW solar and wind energy park with grid connectivity and storage facilities.',
    category: 'Energy',
    location: 'Northern Region',
    startDate: '2026-02-01',
    requirements: 'Renewable energy expertise, environmental clearance'
  },
  {
    id: 103,
    title: 'Digital Government Services Platform',
    issuer: 'Department of IT',
    budget: '₹2,20,00,000',
    deadline: '2025-12-18',
    status: 'Open for Bidding',
    description: 'Development of a comprehensive digital platform for citizen services including online applications, payments, and document management.',
    category: 'Technology',
    location: 'Nationwide',
    startDate: '2026-01-10',
    requirements: 'Software development experience, security certifications'
  }
]

// Company's own tenders (tenders won by the company)
export const companyTenders = [
  {
    id: 1,
    title: 'Highway Construction Project',
    budget: '₹2,50,00,000',
    raiseAmount: '₹2,35,00,000',
    deadline: '2025-12-15',
    status: 'In Progress',
    description: 'Construction of 50km highway with modern infrastructure including bridges, tunnels, and rest areas.',
    complaints: 3,
    category: 'Infrastructure',
    location: 'State Highway 101',
    startDate: '2025-01-15',
    completion: '45%'
  },
  {
    id: 2,
    title: 'Water Supply System Upgrade',
    budget: '₹1,80,00,000',
    raiseAmount: '₹1,72,00,000',
    deadline: '2025-11-30',
    status: 'In Progress',
    description: 'Modernization of water distribution network including installation of smart meters and pipeline upgrades.',
    complaints: 1,
    category: 'Utilities',
    location: 'Metropolitan Area',
    startDate: '2025-02-01',
    completion: '60%'
  }
]

// Company's bids
export const companyBids = [
  {
    id: 1,
    tenderId: 101,
    tenderTitle: 'Smart City Infrastructure Development',
    bidAmount: '₹4,80,00,000',
    submittedDate: '2025-11-20',
    status: 'Submitted',
    documents: ['Technical Proposal', 'Financial Bid', 'Company Profile']
  },
  {
    id: 2,
    tenderId: 102,
    tenderTitle: 'Renewable Energy Park Construction',
    bidAmount: '₹8,20,00,000',
    submittedDate: '2025-11-18',
    status: 'Under Review',
    documents: ['Technical Proposal', 'Financial Bid', 'Environmental Impact Assessment']
  },
  {
    id: 3,
    tenderId: 103,
    tenderTitle: 'Digital Government Services Platform',
    bidAmount: '₹2,00,00,000',
    submittedDate: '2025-11-15',
    status: 'Rejected',
    documents: ['Technical Proposal', 'Financial Bid']
  }
]

// Complaints on company's tenders
export const companyTenderComplaints = [
  {
    id: 1,
    tenderId: 1,
    tenderTitle: 'Highway Construction Project',
    complainant: 'John Doe',
    date: '2025-11-10',
    issue: 'Suspicious bidding process - multiple companies submitted identical bids with unusual precision',
    status: 'Under Review',
    priority: 'High',
    response: null
  },
  {
    id: 3,
    tenderId: 1,
    tenderTitle: 'Highway Construction Project',
    complainant: 'Mike Johnson',
    date: '2025-11-05',
    issue: 'Budget discrepancies found in the project proposal. Initial estimates seem inflated compared to similar projects.',
    status: 'Under Review',
    priority: 'High',
    response: null
  },
  {
    id: 2,
    tenderId: 2,
    tenderTitle: 'Water Supply System Upgrade',
    complainant: 'Jane Smith',
    date: '2025-11-08',
    issue: 'Non-transparent vendor selection process. Concerns about favoritism.',
    status: 'Resolved',
    priority: 'Medium',
    response: 'Investigation completed. All procedures were followed correctly.'
  }
]

