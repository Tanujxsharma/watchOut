export default function DashboardHeader({ userType }) {
  const getWelcomeMessage = () => {
    if (!userType || userType === 'public') {
      return 'Welcome to WatchOut - Government Financial Transparency Platform'
    }
    if (userType === 'company') {
      return 'Welcome to WatchOut Dashboard'
    }
    return 'Welcome to WatchOut Dashboard'
  }

  const getUserTypeMessage = () => {
    if (!userType) {
      return 'Public Access - You can view tenders and file complaints'
    }
    if (userType === 'company') {
      return 'Logged in as Company'
    }
    return 'Logged in as Public User'
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8 mb-8 text-white">
      <h1 className="text-4xl font-bold mb-2">{getWelcomeMessage()}</h1>
      <p className="text-blue-100 text-lg">
        {getUserTypeMessage()}
      </p>
    </div>
  )
}

