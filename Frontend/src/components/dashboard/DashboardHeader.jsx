
import { useAuth } from '../../context/AuthContext';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

export default function DashboardHeader({ userType }) {
  const { user } = useAuth();

  return (
    <Card className="mb-8 border-l-4 border-l-blue-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back, {user?.displayName || 'Citizen'}
          </h1>
          <p className="text-slate-500 mt-1">
            Monitor government tenders and ensure transparency in your community.
          </p>
        </div>
        <Badge variant="info" className="px-4 py-1.5 text-sm">
          {userType === 'public' ? 'Citizen Account' : 'Company Account'}
        </Badge>
      </div>
    </Card>
  );
}
