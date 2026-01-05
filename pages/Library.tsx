
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Grid2X2, 
  List, 
  ArrowUpDown,
  ExternalLink,
  ChevronDown,
  X,
  // Added missing Users import
  Users
} from 'lucide-react';
import { ReferenceImage, Section } from '../types';
import { SECTIONS, COMMON_TAGS } from '../constants';

const Library: React.FC<{ references: ReferenceImage[] }> = ({ references }) => {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [customerFilter, setCustomerFilter] = useState<string>('all');
  const [sectionFilter, setSectionFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'customer' | 'order'>('newest');

  const customers = useMemo(() => Array.from(new Set(references.map(r => r.customer))), [references]);

  const filtered = useMemo(() => {
    return references
      .filter(r => {
        const matchesSearch = 
          r.title.toLowerCase().includes(search.toLowerCase()) ||
          r.customer.toLowerCase().includes(search.toLowerCase()) ||
          r.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
          r.notes.toLowerCase().includes(search.toLowerCase()) ||
          r.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
        
        const matchesCustomer = customerFilter === 'all' || r.customer === customerFilter;
        const matchesSection = sectionFilter === 'all' || r.section === sectionFilter;

        return matchesSearch && matchesCustomer && matchesSection;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === 'customer') return a.customer.localeCompare(b.customer);
        if (sortBy === 'order') return a.orderNumber.localeCompare(b.orderNumber);
        return 0;
      });
  }, [references, search, customerFilter, sectionFilter, sortBy]);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Reference Library</h2>
          <p className="text-slate-500">Search and filter through historical wiring documentation</p>
        </div>
        <div className="flex items-center bg-white rounded-lg p-1 border border-slate-200">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-schneider text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Grid2X2 size={18} />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-schneider text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search across title, customer, order, notes..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-schneider/20 focus:border-schneider outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1">
              <Users size={16} className="text-slate-400" />
              <select 
                className="bg-transparent text-sm focus:outline-none py-1"
                value={customerFilter}
                onChange={(e) => setCustomerFilter(e.target.value)}
              >
                <option value="all">All Customers</option>
                {customers.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1">
              <Filter size={16} className="text-slate-400" />
              <select 
                className="bg-transparent text-sm focus:outline-none py-1"
                value={sectionFilter}
                onChange={(e) => setSectionFilter(e.target.value)}
              >
                <option value="all">All Sections</option>
                {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1">
              <ArrowUpDown size={16} className="text-slate-400" />
              <select 
                className="bg-transparent text-sm focus:outline-none py-1"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="newest">Sort by Newest</option>
                <option value="customer">Customer A-Z</option>
                <option value="order">Order Number</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-dashed border-slate-300 text-slate-500">
          <Search size={48} className="mb-4 opacity-20" />
          <p className="text-lg font-medium">No matches found</p>
          <p className="text-sm">Try adjusting your filters or search term</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(ref => (
            <Link 
              to={`/reference/${ref.id}`} 
              key={ref.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col"
            >
              <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                <img 
                  src={ref.image.value} 
                  alt={ref.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-2 left-2">
                  <span className="bg-white/90 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold text-slate-700 shadow-sm uppercase">
                    {ref.section}
                  </span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h4 className="font-bold text-slate-900 group-hover:text-schneider transition-colors line-clamp-1 mb-1">
                  {ref.title}
                </h4>
                <p className="text-xs text-slate-500 mb-3">{ref.customer}</p>
                <div className="flex flex-wrap gap-1 mt-auto">
                  {ref.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded border border-slate-200">
                      {tag}
                    </span>
                  ))}
                  {ref.tags.length > 3 && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">
                      +{ref.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Reference</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Order #</th>
                <th className="px-6 py-4">Section</th>
                <th className="px-6 py-4">Tags</th>
                <th className="px-6 py-4 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(ref => (
                <tr key={ref.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900">{ref.title}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{ref.customer}</td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-500">{ref.orderNumber}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 text-[10px] font-bold uppercase">
                      {ref.section}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {ref.tags.slice(0, 2).map(t => (
                        <span key={t} className="text-[10px] bg-slate-100 px-1 rounded text-slate-400">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/reference/${ref.id}`} className="text-slate-400 hover:text-schneider transition-colors inline-block">
                      <ExternalLink size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Library;
