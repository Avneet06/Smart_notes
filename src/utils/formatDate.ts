export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  
  // Format: "Jan 1, 2023 at 12:00 PM"
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date);
};