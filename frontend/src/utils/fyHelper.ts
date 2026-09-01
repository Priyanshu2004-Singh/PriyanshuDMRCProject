/**
 * Helper to compute Financial Years dynamically relative to current date.
 * In India, FY runs from April 1 to March 31.
 */
export function getFinancialYears(count: number = 3): string[] {
  const currentDate = new Date();
  let currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // 1 to 12

  // If before April (months Jan-Mar), current FY is (currentYear-1)-(currentYear)
  let latestFyEndYear = currentMonth >= 4 ? currentYear + 1 : currentYear;

  const fyList: string[] = [];
  for (let i = 0; i < count; i++) {
    const endYear = latestFyEndYear - i;
    const startYear = endYear - 1;
    const shortEndYear = endYear.toString().slice(-2);
    fyList.push(`${startYear}–${shortEndYear}`);
  }
  return fyList;
}

export function getCurrentFinancialYear(): string {
  return getFinancialYears(1)[0];
}
