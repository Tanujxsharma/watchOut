
import { useState, useMemo } from 'react';
import { MapPin, Calendar, IndianRupee, ArrowRight, Search, Filter } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

export default function TendersList({ tenders, onTenderSelect }) {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const filteredTenders = useMemo(() => {
    return tenders
      .filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                              t.location.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = filterCategory ? t.category === filterCategory : true;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'budgetHigh') return parseFloat(b.budget.replace(/[^0-9.]/g, '')) - parseFloat(a.budget.replace(/[^0-9.]/g, ''));
        if (sortBy === 'budgetLow') return parseFloat(a.budget.replace(/[^0-9.]/g, '')) - parseFloat(b.budget.replace(/[^0-9.]/g, ''));
        if (sortBy === 'deadline') return new Date(a.deadline) - new Date(b.deadline);
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [tenders, search, filterCategory, sortBy]);

  const categories = [...new Set(tenders.map(t => t.category))];

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tenders by title or location..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <select
              className="px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              className="px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="deadline">Closing Soon</option>
              <option value="budgetHigh">Budget: High to Low</option>
              <option value="budgetLow">Budget: Low to High</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Results Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTenders.length > 0 ? (
          filteredTenders.map((tender) => (
            <Card key={tender.id} className="flex flex-col h-full group">
              <div className="flex justify-between items-start mb-4">
                <Badge variant={tender.status === 'Open' ? 'success' : 'warning'}>
                  {tender.status}
                </Badge>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                  {tender.category}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {tender.title}
              </h3>
              
              <div className="space-y-3 mb-6 flex-grow">
                <div className="flex items-center text-sm text-slate-600">
                  <IndianRupee className="w-4 h-4 mr-2 text-slate-400" />
                  <span className="font-semibold">{tender.budget}</span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                  {tender.location}
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                  Due: {tender.deadline}
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full justify-between group-hover:border-blue-500 group-hover:text-blue-600"
                onClick={() => onTenderSelect(tender)}
              >
                View Details
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-slate-500">
            No tenders found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
