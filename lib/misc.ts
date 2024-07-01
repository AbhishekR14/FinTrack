export function getMonthNumber(month: string): number {
  const monthMap: { [key: string]: number } = {
    january: 0,
    jan: 0,
    february: 1,
    feb: 1,
    march: 2,
    mar: 2,
    april: 3,
    apr: 3,
    may: 4,
    june: 5,
    jun: 5,
    july: 6,
    jul: 6,
    august: 7,
    aug: 7,
    september: 8,
    sep: 8,
    october: 9,
    oct: 9,
    november: 10,
    nov: 10,
    december: 11,
    dec: 11,
  };
  const lowerCaseMonth = month.toLowerCase();
  return monthMap[lowerCaseMonth];
}

export const monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
