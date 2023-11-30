export const formatTime = (hour: number, minutes?: string): string => {
  if (hour < 0 || hour > 23) {
    throw new Error('Hour must be between 0 and 23');
  }

  let formattedHour = hour % 12;
  if (formattedHour === 0) {
    formattedHour = 12;
  }

  const amPm = hour < 12 ? 'AM' : 'PM';
  const formattedMinutes = minutes ? `:${minutes}` : '';

  return `${formattedHour}${formattedMinutes} ${amPm}`;
}