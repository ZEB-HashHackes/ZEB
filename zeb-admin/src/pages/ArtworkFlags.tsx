import { CheckCircle2, XCircle, AlertTriangle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../services/api';

const API_BASE_URL = 'https://zeb-1.onrender.com'; // For image paths

export function ArtworkFlags() {
  const queryClient = useQueryClient();
  const [expandedFlag, setExpandedFlag] = useState<string | null>(null);

  const { data: flags, isLoading, error } = useQuery({
    queryKey: ['flagged-artworks'],
    queryFn: adminApi.getFlaggedArtworks,
  });

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: 'active' | 'rejected' }) => 
      adminApi.resolveFlag(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flagged-artworks'] });
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
        Error loading moderation flags.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary tracking-tight uppercase font-mono">Artwork Moderation</h1>
          <p className="mt-1 text-sm text-gray-500">Review and resolve similar artwork flags. Compare before approving.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {flags?.map((flag: any) => {
            const isExpanded = expandedFlag === flag._id;
            const flaggedImageUrl = flag.filePath.startsWith('http') ? flag.filePath : `${API_BASE_URL}/${flag.filePath}`;
            
            return (
              <li key={flag._id} className="p-6 sm:px-8 hover:bg-surface transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <AlertTriangle className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-secondary group-hover:text-primary transition-colors">
                        Similarity Detected
                      </h3>
                      <div className="mt-1 flex flex-col gap-1 sm:flex-row sm:gap-4 sm:items-center text-sm text-gray-500">
                        <span><span className="font-medium text-gray-700">Art:</span> {flag.title}</span>
                        <span className="hidden sm:inline text-gray-300">•</span>
                        <span><span className="font-medium text-gray-700">Creator:</span> {flag.creatorBy.slice(0, 8)}...</span>
                      </div>
                      <div className="mt-2 text-xs text-gray-400">
                        Method: {flag.similarityMethod} | Uploaded on {new Date(flag.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setExpandedFlag(isExpanded ? null : flag._id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-xs font-semibold rounded-md shadow-sm text-secondary bg-white hover:bg-gray-50 focus:outline-none"
                    >
                      {isExpanded ? (
                        <><EyeOff size={16} /> Hide Compare</>
                      ) : (
                        <><Eye size={16} /> Compare</>
                      )}
                    </button>
                    
                    <button 
                      onClick={() => mutation.mutate({ id: flag._id, status: 'active' })}
                      disabled={mutation.isPending}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-transparent text-xs font-semibold rounded-md shadow-sm text-secondary bg-primary hover:bg-primary/80 focus:outline-none disabled:opacity-50"
                    >
                      <CheckCircle2 size={16} />
                      Approve
                    </button>
                    <button 
                      onClick={() => mutation.mutate({ id: flag._id, status: 'rejected' })}
                      disabled={mutation.isPending}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-xs font-semibold rounded-md shadow-sm text-white bg-secondary hover:bg-secondary/90 focus:outline-none disabled:opacity-50"
                    >
                      <XCircle size={16} />
                      Reject
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-6 p-4 rounded-xl bg-surface border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3 flex flex-col items-center">
                      <div className="text-sm font-semibold text-gray-700 w-full text-left uppercase">Flagged Artwork</div>
                      <div className="w-full aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-200">
                        <img 
                          src={flaggedImageUrl} 
                          alt={flag.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-sm text-gray-600 font-mono tracking-tighter">{flag.title}</div>
                    </div>
                    
                    <div className="space-y-3 flex flex-col items-center relative">
                      <div className="absolute left-[-16px] md:left-[-1.5rem] top-1/2 -translate-y-1/2 hidden md:block">
                        <div className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-secondary font-bold text-xs font-mono">VS</div>
                      </div>
                      <div className="text-sm font-semibold text-orange-600 w-full text-left uppercase">Original Match</div>
                      <div className="w-full aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center p-8 text-center">
                        <div className="text-xs text-gray-400 italic">
                          Reference artwork not stored locally. Similarity Hash: {flag.similarityHash?.slice(0, 16)}...
                        </div>
                      </div>
                      <div className="text-sm text-gray-400 italic">Reference Point</div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
          {flags?.length === 0 && (
             <li className="p-12 text-center text-gray-500 text-sm font-mono uppercase tracking-widest">
               No pending flags. ZEB engine is clear.
             </li>
          )}
        </ul>
      </div>
    </div>
  );
}

