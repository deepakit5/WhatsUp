export const formatDateTime = (date, options = {date: true, time: true}) => {
  const d = new Date(date);
  const formattedDate = d.toLocaleDateString('en-GB'); // Format: dd/mm/yyyy
  const formattedTime = d
    .toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true, // AM/PM format
    })
    .replace('AM', 'am')
    .replace('PM', 'pm'); // Convert to lowercase

  if (options.date && options.time) return `${formattedDate} ${formattedTime}`;
  if (options.date) return formattedDate;
  if (options.time) return formattedTime;

  return '';
};

// console ---------
// console.log(formatDateTime(new Date(), { date: true, time: true })); // "25/12/2024 03:45 PM"
// console.log(formatDateTime(new Date(), { date: true }));            // "25/12/2024"
// console.log(formatDateTime(new Date(), { time: true }));            // "03:45 PM"
