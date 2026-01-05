
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  ClipboardList, 
  Tag, 
  ChevronRight,
  TrendingUp,
  History,
  // Added missing Leaf import
  Leaf
} from 'lucide-react';
import { ReferenceImage, KPIStats } from '../types';

const KPICard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; trend?: string }> = ({ title, value, icon, trend }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-slate-50 rounded-lg text-schneider">
        {icon}
      </div>
      {trend && (
        <span className="text-xs font-bold text-schneider bg-schneider/10 px-2 py-1 rounded-full flex items-center gap-1">
          <TrendingUp size={12} />
          {trend}
        </span>
      )}
    </div>
    <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-slate-900">{value}</p>
  </div>
);

const Dashboard: React.FC<{ references: ReferenceImage[] }> = ({ references }) => {
  const stats = useMemo<KPIStats>(() => {
    const customers = new Set(references.map(r => r.customer));
    const orders = new Set(references.map(r => r.orderNumber));
    const tagged = references.filter(r => r.tags.length > 0).length;
    
    return {
      totalReferences: references.length,
      uniqueCustomers: customers.size,
      uniqueOrders: orders.size,
      taggedStandards: tagged
    };
  }, [references]);

  const recent = useMemo(() => {
    return [...references]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8);
  }, [references]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Panel Wiring Reference Library</h2>
        <p className="text-slate-500 mt-2 max-w-2xl text-lg leading-snug">
          Create <span className="text-schneider font-semibold">Impact</span> by empowering all to make the most of our energy and resources, bridging progress and sustainability for all.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Total References" 
          value={stats.totalReferences} 
          icon={<BarChart3 />} 
          trend="+12%"
        />
        <KPICard 
          title="Customers" 
          value={stats.uniqueCustomers} 
          icon={<Users />} 
        />
        <KPICard 
          title="Orders" 
          value={stats.uniqueOrders} 
          icon={<ClipboardList />} 
        />
        <KPICard 
          title="Tagged Standards" 
          value={stats.taggedStandards} 
          icon={<Tag />} 
          trend="+5.4%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <History className="text-schneider" size={20} />
              Recent Additions
            </h3>
            <Link to="/library" className="text-schneider hover:underline text-sm font-medium flex items-center">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Reference</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Section</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recent.map((ref) => (
                  <tr key={ref.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
                          <img src={ref.image.value} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{ref.title}</p>
                          <p className="text-xs text-slate-400">{ref.orderNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{ref.customer}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 text-[10px] font-bold uppercase">
                        {ref.section}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/reference/${ref.id}`} className="text-slate-400 group-hover:text-schneider transition-colors">
                        <ChevronRight size={20} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-schneider/10 border border-schneider/20 p-6 rounded-2xl">
            <div className="flex items-center gap-2 text-schneider mb-4">
              <Leaf size={24} />
              <h3 className="font-bold text-xl">Energy Focus</h3>
            </div>
            <p className="text-slate-700 leading-relaxed text-sm mb-4">
              Every panel wired correctly is a step toward greater energy efficiency. Precision in routing and terminal torque ensures minimal power dissipation and maximum longevity.
            </p>
            <div className="p-4 bg-white/50 rounded-xl border border-schneider/30">
              <p className="text-xs font-bold text-schneider uppercase mb-1">Our Commitment</p>
              <p className="text-sm font-semibold text-slate-900 italic">"Net-Zero by 2050 starts with operational excellence today."</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <h3 className="font-bold mb-4">Top Customers</h3>
            <div className="space-y-4">
              {/* Added explicit type string for cust to resolve property access error */}
              {Array.from(new Set(references.map(r => r.customer))).slice(0, 5).map((cust: string) => (
                <div key={cust} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                      {cust.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-slate-600">{cust}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400">
                    {references.filter(r => r.customer === cust).length} refs
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
