import { ArrowUpRight, Copy, HandCoins, Users, Loader2, ShieldAlert, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../services/api';

const COLORS = ['#33FFEB', '#0A0E14', '#64748b'];

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminApi.getRevenueStats,
    refetchInterval: 10000, 
  });

  const { data: flaggedArts, isLoading: flaggedLoading } = useQuery({
    queryKey: ['flagged-arts'],
    queryFn: adminApi.getFlaggedArtworks,
    refetchInterval: 10000,
  });

  const resolveMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'active' | 'rejected' }) => 
      adminApi.resolveFlag(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flagged-arts'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
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
            <h2 className="text-3xl font-extrabold text-secondary tracking-tight">
              {totalRevenue.toLocaleString()} <span className="text-sm font-black text-slate-400">XLM</span>
            </h2>
            <div className="flex items-center text-sm font-semibold text-green-600">
              <ArrowUpRight strokeWidth={2.5} size={16} className="mr-1" />
              Live
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">Real-time revenue stats from ZEB engine</p>
        </div>
        
        {/* Flagged Count Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Similarity Flags</p>
            <div className={`p-2 rounded-lg ${flaggedArts?.length > 0 ? 'bg-red-50 text-red-500' : 'bg-primary/10 text-secondary'}`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline">
            <h2 className="text-3xl font-extrabold text-secondary">
              {flaggedArts?.length || 0}
            </h2>
          </div>
          <p className="mt-1 text-xs text-gray-500">Artworks pending authorship review</p>
        </div>
      </div>

      {/* Flagged Section & Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Review Center (Left 8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* FLAG REVIEW SECTION */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="bg-slate-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-sm font-black text-secondary uppercase tracking-widest flex items-center gap-2">
                   <ShieldAlert size={16} className="text-red-500" />
                   Review Center: Similarity Flags
                </h3>
                <span className="text-[10px] font-black bg-red-50 text-red-500 px-2 py-0.5 rounded-full border border-red-100">
                   {flaggedArts?.length || 0} Pending
                </span>
             </div>
             
             <div className="p-0">
                <table className="min-w-full divide-y divide-gray-100 text-sm">
                   <thead>
                      <tr className="bg-slate-50/50">
                         <th className="px-6 py-3 text-left text-[10px] uppercase font-black text-slate-400 tracking-widest">Artwork</th>
                         <th className="px-6 py-3 text-left text-[10px] uppercase font-black text-slate-400 tracking-widest">Creator Hash</th>
                         <th className="px-6 py-3 text-right text-[10px] uppercase font-black text-slate-400 tracking-widest">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50">
                      {flaggedArts?.map((art: any) => (
                         <tr key={art._id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4">
                               <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-lg bg-surface border border-slate-100 overflow-hidden relative">
                                     <img 
                                      src={`http://localhost:5000/${art.filePath}`} 
                                      alt="Flagged" 
                                      className="w-full h-full object-cover"
                                     />
                                  </div>
                                  <div>
                                     <p className="font-black text-secondary text-sm">{art.title}</p>
                                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{art.category}</p>
                                  </div>
                               </div>
                            </td>
                            <td className="px-6 py-4 font-mono text-[10px] text-slate-400 truncate max-w-[120px]">
                               {art.creatorBy}
                            </td>
                            <td className="px-6 py-4 text-right">
                               <div className="flex items-center justify-end gap-2">
                                  <button 
                                    onClick={() => resolveMutation.mutate({ id: art._id, status: 'active' })}
                                    disabled={resolveMutation.isPending}
                                    className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-all border border-transparent hover:border-green-100"
                                    title="Approve"
                                  >
                                     <CheckCircle size={18} />
                                  </button>
                                  <button 
                                    onClick={() => resolveMutation.mutate({ id: art._id, status: 'rejected' })}
                                    disabled={resolveMutation.isPending}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100"
                                    title="Reject"
                                  >
                                     <XCircle size={18} />
                                  </button>
                               </div>
                            </td>
                         </tr>
                      ))}
                      {(!flaggedArts || flaggedArts.length === 0) && (
                         <tr>
                            <td colSpan={3} className="px-6 py-12 text-center">
                               <div className="flex flex-col items-center gap-2 opacity-30">
                                  <ShieldAlert size={32} />
                                  <p className="text-xs font-black uppercase tracking-widest">No authorship flags to review</p>
                               </div>
                            </td>
                         </tr>
                      )}
                   </tbody>
                </table>
             </div>
          </div>

          {/* RECENT TRANSACTIONS */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="bg-slate-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-sm font-black text-secondary uppercase tracking-widest">Recent Revenue Transactions</h3>
             </div>
             <div className="px-6 py-4">
               <table className="min-w-full divide-y divide-gray-100 text-sm">
                 <thead>
                   <tr>
                     <th className="py-2 text-left font-black text-[10px] uppercase text-gray-400 tracking-widest">Type</th>
                     <th className="py-2 text-left font-black text-[10px] uppercase text-gray-400 tracking-widest">Art / Ref</th>
                     <th className="py-2 text-left font-black text-[10px] uppercase text-gray-400 tracking-widest">Amount</th>
                     <th className="py-2 text-left font-black text-[10px] uppercase text-gray-400 tracking-widest">Payer</th>
                     <th className="py-2 text-left font-black text-[10px] uppercase text-gray-400 tracking-widest">Date</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50 align-middle">
                   {recentTransactions.map((tx: any) => (
                     <tr key={tx._id} className="hover:bg-slate-50/50 transition-colors">
                       <td className="py-4">
                         <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[9px] font-black uppercase text-secondary border border-primary/20">
                          {tx.type}
                         </span>
                       </td>
                       <td className="py-4 text-slate-900 font-bold text-xs truncate max-w-[150px]">
                         {tx.artId?.title || 'System / Fee'}
                       </td>
                       <td className="py-4 text-secondary font-black">{tx.amount} <span className="text-[10px] text-slate-400">XLM</span></td>
                       <td className="py-4 text-gray-400 font-mono text-[10px] truncate max-w-[80px]">{tx.sourceAddress}</td>
                       <td className="py-4 text-gray-400 text-[10px] font-bold uppercase tracking-tight">{new Date(tx.timestamp).toLocaleDateString()}</td>
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
        </div>

        {/* PIE CHART SIDE (Right 4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col h-full min-h-[400px]">
            <h3 className="text-sm font-black text-secondary uppercase tracking-widest mb-8 text-center">Revenue Distribution</h3>
            <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueDistribution.filter(d => d.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {revenueDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-center">Primary Source</p>
               <p className="text-md font-black text-secondary text-center uppercase">
                  {revenueDistribution.sort((a,b) => b.value - a.value)[0].name}
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

    </div>
  );
}

