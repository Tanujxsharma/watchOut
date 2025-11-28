// Utility function for getting status badge colors
export const getStatusColor = (status) => {
  const statusLower = status.toLowerCase().replace(' ', '-')
  switch (statusLower) {
    case 'open':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'closing-soon':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'closed':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'under-review':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'resolved':
      return 'bg-green-100 text-green-800 border-green-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

