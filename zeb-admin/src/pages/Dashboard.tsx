import { ArrowUpRight, Copy, HandCoins, Users, Loader2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../services/api';

const COLORS = ['#33FFEB', '#0A0E14', '#64748b'];

export function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminApi.getRevenueStats,
    refetchInterval: 10000, // Refresh every 10 seconds for live feel
  });

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Error loading dashboard data. Please ensure the backend is running.
      </div>
    );
  }

  const stats = data?.stats || {};
  const totalRevenue = Object.values(stats).reduce((acc: number, curr: any) => acc + curr.total, 0);
  
  const revenueDistribution = [
    { name: 'Registration', value: stats.registration?.total || 0 },
    { name: 'Transfer', value: stats.transfer?.total || 0 },
    { name: 'Bidding', value: stats.bidding?.total || 0 },
  ];

  const recentTransactions = data?.recentTransactions || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-secondary tracking-tight">Admin Dashboard</h1>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-secondary hover:bg-gray-50 flex items-center gap-2 transition-colors focus:outline-none">
            <Copy size={16} />
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Revenue Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
            <div className="p-2 bg-primary/10 rounded-lg">
              <HandCoins className="w-5 h-5 text-secondary" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <h2 className="text-3xl font-extrabold text-secondary">
              ${totalRevenue.toLocaleString()}
            </h2>
            <div className="flex items-center text-sm font-semibold text-green-600">
              <ArrowUpRight strokeWidth={2.5} size={16} className="mr-1" />
              Live
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">Real-time stats from ZEB engine</p>
        </div>
        
        {/* Placeholder for other stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hidden sm:flex">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">System Transactions</p>
            <div className="p-2 bg-primary/5 rounded-lg border border-primary/20">
              <Users className="w-5 h-5 text-secondary" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline">
            <h2 className="text-3xl font-extrabold text-secondary">
              {recentTransactions.length}
            </h2>
          </div>
          <p className="mt-1 text-xs text-gray-500">Recent revenue events detected</p>
        </div>
      </div>

      {/* Breakdowns and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
           <div className="border-b border-gray-200 px-6 py-4 bg-surface">
              <h3 className="text-base font-semibold leading-6 text-secondary font-mono tracking-tight uppercase">Recent Revenue Transactions</h3>
           </div>
           <div className="px-6 py-4 flex-1">
             <table className="min-w-full divide-y divide-gray-200 text-sm">
               <thead>
                 <tr>
                   <th className="py-2 text-left font-semibold text-gray-500">Type</th>
                   <th className="py-2 text-left font-semibold text-gray-500">Art / Ref</th>
                   <th className="py-2 text-left font-semibold text-gray-500">Amount</th>
                   <th className="py-2 text-left font-semibold text-gray-500">Payer</th>
                   <th className="py-2 text-left font-semibold text-gray-500">Date</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 align-middle">
                 {recentTransactions.map((tx: any) => (
                   <tr key={tx._id} className="hover:bg-surface">
                     <td className="py-3 text-secondary">
                       <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase text-secondary border border-primary/20">
                        {tx.type}
                       </span>
                     </td>
                     <td className="py-3 text-gray-900 font-medium font-mono text-xs">
                       {tx.artId?.title || 'System / Fee'}
                     </td>
                     <td className="py-3 text-secondary font-bold">${tx.amount}</td>
                     <td className="py-3 text-gray-500 text-xs truncate max-w-[100px]">{tx.sourceAddress}</td>
                     <td className="py-3 text-gray-400 text-xs">{new Date(tx.timestamp).toLocaleDateString()}</td>
                   </tr>
                 ))}
                 {recentTransactions.length === 0 && (
                   <tr>
                     <td colSpan={5} className="py-8 text-center text-gray-400">No transactions recorded yet.</td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <h3 className="text-base font-semibold leading-6 text-secondary mb-6 font-mono uppercase">Revenue Distribution</h3>
          <div className="h-64 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueDistribution.filter(d => d.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {revenueDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

