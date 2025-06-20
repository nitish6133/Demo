
/**
 * Converts backend timestamp format (20250619161801689) to Date object
 * Format: YYYYMMDDHHMMSSMMM (Year-Month-Day-Hour-Minute-Second-Milliseconds)
 */
export function backendTimestampToDate(timestamp: string): Date | null {
  if (!timestamp || timestamp.length < 14) return null;
  
  try {
    const year = parseInt(timestamp.substring(0, 4));
    const month = parseInt(timestamp.substring(4, 6)) - 1; // Month is 0-indexed
    const day = parseInt(timestamp.substring(6, 8));
    const hour = parseInt(timestamp.substring(8, 10)) || 0;
    const minute = parseInt(timestamp.substring(10, 12)) || 0;
    const second = parseInt(timestamp.substring(12, 14)) || 0;
    const millisecond = parseInt(timestamp.substring(14, 17)) || 0;
    
    return new Date(year, month, day, hour, minute, second, millisecond);
  } catch (error) {
    console.error('Error parsing backend timestamp:', timestamp, error);
    return null;
  }
}

// Converts Date object to backend timestamp format (20250619161801689)

export function dateToBackendTimestamp(date: Date): string {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) return '';
  
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const second = date.getSeconds().toString().padStart(2, '0');
  const millisecond = date.getMilliseconds().toString().padStart(3, '0');
  
  return `${year}${month}${day}${hour}${minute}${second}${millisecond}`;
}

// Converts HTML date input value (YYYY-MM-DD) to backend timestamp format
 
export function htmlDateToBackendTimestamp(htmlDate: string): string {
  if (!htmlDate) return '';
  
  const date = new Date(htmlDate + 'T00:00:00');
  return dateToBackendTimestamp(date).substring(0, 8);
}

// Converts backend timestamp to HTML date input format (YYYY-MM-DD)

export function backendTimestampToHtmlDate(timestamp: string): string {
  const date = backendTimestampToDate(timestamp);
  if (!date) return '';
  
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

// Formats backend timestamp for display in UI

export function formatBackendTimestampForDisplay(timestamp: string): string {
  const date = backendTimestampToDate(timestamp);
  if (!date) return '';
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Gets current timestamp in backend format

export function getCurrentBackendTimestamp(): string {
  return dateToBackendTimestamp(new Date()).substring(0, 8);
}
