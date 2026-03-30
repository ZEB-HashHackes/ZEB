import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../services/api';
import { Loader2 } from 'lucide-react';

export function RevenueView() {
  const { type } = useParams<{ type: string }>();
  
  const titleMap: Record<string, string> = {
    registration: 'Art Registration Revenue',
    transfer: 'Ownership Transfer Revenue',
    bidding: 'Bidding Commission Revenue'
  };

  const { data: transactions, isLoading, error } = useQuery({
    queryKey: ['revenue-transactions', type],
    queryFn: () => adminApi.getTransactionsByType(type!),
    enabled: !!type,
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
        Error loading transaction data.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-secondary tracking-tight font-mono uppercase">
        {type ? titleMap[type] : 'Revenue Details'}
      </h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-surface">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-widest font-mono">Transaction ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-widest font-mono">Reference / Art</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-widest font-mono">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-widest font-mono">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions?.map((row: any) => (
              <tr key={row._id} className="hover:bg-surface transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-gray-400">
                  {row._id.slice(-8).toUpperCase()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary font-medium uppercase font-mono tracking-tight">
                  {row.artId?.title || 'System Fee'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary font-bold font-mono">
                  ${row.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-mono">
                  {new Date(row.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
            {transactions?.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center text-sm text-gray-400 font-mono uppercase tracking-widest">
                  No records stored in ZEB database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

