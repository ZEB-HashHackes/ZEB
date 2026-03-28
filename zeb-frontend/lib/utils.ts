export function formatTimeLeft(endTime: Date): string {
  const now = new Date();
  const diff = endTime.getTime() - now.getTime();
  if (diff <= 0) return '00h 00m';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m`;
}
