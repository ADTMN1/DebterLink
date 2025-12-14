// Ethiopian Calendar Conversion Library

const ETHIOPIAN_MONTHS = [
  'Meskerem', 'Tikimt', 'Hidar', 'Tahsas', 'Tir', 'Yekatit',
  'Megabit', 'Miazia', 'Ginbot', 'Sene', 'Hamle', 'Nehase', 'Pagume'
];

export type EthiopianDate = {
  year: number;
  month: number;
  day: number;
};

// Convert Gregorian to Ethiopian
export function gregorianToEthiopian(date: Date): EthiopianDate {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let jdn = Math.floor((1461 * (year + 4800 + Math.floor((month - 14) / 12))) / 4) +
    Math.floor((367 * (month - 2 - 12 * Math.floor((month - 14) / 12))) / 12) -
    Math.floor((3 * Math.floor((year + 4900 + Math.floor((month - 14) / 12)) / 100)) / 4) +
    day - 32075;

  const r = (jdn - 1723856) % 1461;
  const n = (r % 365) + 365 * Math.floor(r / 1460);

  const ethYear = 4 * Math.floor((jdn - 1723856) / 1461) + Math.floor(r / 365) - Math.floor(r / 1460);
  const ethMonth = Math.floor(n / 30) + 1;
  const ethDay = (n % 30) + 1;

  return { year: ethYear, month: ethMonth, day: ethDay };
}

// Convert Ethiopian to Gregorian
export function ethiopianToGregorian(ethDate: EthiopianDate): Date {
  const { year, month, day } = ethDate;

  const jdn = Math.floor((year - 1) / 4) * 1461 +
    ((year - 1) % 4) * 365 +
    (month - 1) * 30 + day + 1723856;

  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);

  const gregDay = e - Math.floor((153 * m + 2) / 5) + 1;
  const gregMonth = m + 3 - 12 * Math.floor(m / 10);
  const gregYear = 100 * b + d - 4800 + Math.floor(m / 10);

  return new Date(gregYear, gregMonth - 1, gregDay);
}

// Format Ethiopian date as string
export function formatEthiopianDate(ethDate: EthiopianDate): string {
  return `${ethDate.day} ${ETHIOPIAN_MONTHS[ethDate.month - 1]} ${ethDate.year}`;
}

// Get Ethiopian month name
export function getEthiopianMonthName(month: number): string {
  return ETHIOPIAN_MONTHS[month - 1] || '';
}

// Get current Ethiopian date
export function getCurrentEthiopianDate(): EthiopianDate {
  return gregorianToEthiopian(new Date());
}
