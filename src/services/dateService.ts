import { DateDifference } from '../types';

export const parseDate = (dateStr: string): Date | null => {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return null;
  const parts = dateStr.split('/');
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // JS months are 0-indexed
  const year = parseInt(parts[2], 10);
  const date = new Date(year, month, day);
  // Check if date is valid (e.g., not 31/02/2023)
  if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
    return date;
  }
  return null;
};

export const yearsDaysDiff = (date1: Date, date2: Date): DateDifference => {
    if (date1 > date2) {
      // swap dates if d1 is after d2
      [date1, date2] = [date2, date1];
    }

    const y1 = date1.getFullYear();
    const m1 = date1.getMonth();
    const d1 = date1.getDate();
    
    const y2 = date2.getFullYear();
    const m2 = date2.getMonth();
    const d2 = date2.getDate();

    let years = y2 - y1;
    
    if (m2 < m1 || (m2 === m1 && d2 < d1)) {
        years--;
    }

    const annivYear = y1 + years;
    const annivDate = new Date(annivYear, m1, d1);

    const timeDiff = date2.getTime() - annivDate.getTime();
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
    return { years, days };
};
