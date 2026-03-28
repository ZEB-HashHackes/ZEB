import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadArt } from '../lib/api';
import { useDashboardArts } from './useDashboardArts';

export function useUploadArt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadArt,
    onSuccess: () => {
      // Invalidate arts queries
      queryClient.invalidateQueries({ queryKey: ['arts'] });
    },
    onError: (error: any) => {
      if (error.message.includes('Duplicate') || error.message.includes('Similar')) {
        alert(error.message + '\nTip: Use existing art ID to resume.');
      } else {
        alert('Upload failed: ' + error.message);
      }
    },
  });
}

