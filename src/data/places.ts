export type CurrencyInfo = {
  code: string;
  name: string;
  symbol: string;
  perUsd: number;
};

export type CountryInfo = {
  code: string;
  name: string;
  currency: string;
  locale: string;
  flag: string;
};

const CURRENCY_DEFS: CurrencyInfo[] = [
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED', perUsd: 3.67 },
  { code: 'ARS', name: 'Argentine Peso', symbol: 'ARS', perUsd: 980 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', perUsd: 1.52 },
  { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳', perUsd: 121 },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', perUsd: 5.45 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', perUsd: 1.37 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', perUsd: 0.81 },
  { code: 'CLP', name: 'Chilean Peso', symbol: 'CLP', perUsd: 940 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', perUsd: 7.18 },
  { code: 'COP', name: 'Colombian Peso', symbol: 'COP', perUsd: 4100 },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', perUsd: 23.2 },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', perUsd: 6.85 },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', perUsd: 48.5 },
  { code: 'ETB', name: 'Ethiopian Birr', symbol: 'Br', perUsd: 125 },
  { code: 'EUR', name: 'Euro', symbol: '€', perUsd: 0.86 },
  { code: 'GBP', name: 'British Pound', symbol: '£', perUsd: 0.74 },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵', perUsd: 12.2 },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', perUsd: 7.79 },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', perUsd: 360 },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', perUsd: 15800 },
  { code: 'ILS', name: 'Israeli Shekel', symbol: '₪', perUsd: 3.65 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', perUsd: 84 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', perUsd: 148 },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', perUsd: 129 },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', perUsd: 1380 },
  { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'Rs', perUsd: 300 },
  { code: 'MAD', name: 'Moroccan Dirham', symbol: 'MAD', perUsd: 9.9 },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$', perUsd: 17.2 },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', perUsd: 4.45 },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', perUsd: 1550 },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', perUsd: 10.7 },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', perUsd: 1.64 },
  { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/', perUsd: 3.75 },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', perUsd: 57 },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨', perUsd: 278 },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', perUsd: 3.85 },
  { code: 'QAR', name: 'Qatari Riyal', symbol: 'QR', perUsd: 3.64 },
  { code: 'RON', name: 'Romanian Leu', symbol: 'lei', perUsd: 4.55 },
  { code: 'RWF', name: 'Rwandan Franc', symbol: 'FRw', perUsd: 1350 },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'SAR', perUsd: 3.75 },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', perUsd: 9.6 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', perUsd: 1.31 },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', perUsd: 34 },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', perUsd: 36 },
  { code: 'TTD', name: 'Trinidad Dollar', symbol: 'TT$', perUsd: 6.78 },
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh', perUsd: 2650 },
  { code: 'UAH', name: 'Ukrainian Hryvnia', symbol: '₴', perUsd: 41.5 },
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh', perUsd: 3700 },
  { code: 'USD', name: 'US Dollar', symbol: '$', perUsd: 1 },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', perUsd: 25300 },
  { code: 'XAF', name: 'Central African CFA', symbol: 'FCFA', perUsd: 565 },
  { code: 'XOF', name: 'West African CFA', symbol: 'CFA', perUsd: 565 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', perUsd: 18.1 },
];

type CountryRow = [code: string, name: string, currency: string, locale: string, flag: string];

const COUNTRY_ROWS: CountryRow[] = [
  ['AE', 'United Arab Emirates', 'AED', 'ar-AE', '🇦🇪'],
  ['AR', 'Argentina', 'ARS', 'es-AR', '🇦🇷'],
  ['AT', 'Austria', 'EUR', 'de-AT', '🇦🇹'],
  ['AU', 'Australia', 'AUD', 'en-AU', '🇦🇺'],
  ['BD', 'Bangladesh', 'BDT', 'bn-BD', '🇧🇩'],
  ['BE', 'Belgium', 'EUR', 'nl-BE', '🇧🇪'],
  ['BR', 'Brazil', 'BRL', 'pt-BR', '🇧🇷'],
  ['CA', 'Canada', 'CAD', 'en-CA', '🇨🇦'],
  ['CH', 'Switzerland', 'CHF', 'de-CH', '🇨🇭'],
  ['CI', 'Côte d’Ivoire', 'XOF', 'fr-CI', '🇨🇮'],
  ['CL', 'Chile', 'CLP', 'es-CL', '🇨🇱'],
  ['CM', 'Cameroon', 'XAF', 'fr-CM', '🇨🇲'],
  ['CN', 'China', 'CNY', 'zh-CN', '🇨🇳'],
  ['CO', 'Colombia', 'COP', 'es-CO', '🇨🇴'],
  ['CR', 'Costa Rica', 'USD', 'es-CR', '🇨🇷'],
  ['CZ', 'Czechia', 'CZK', 'cs-CZ', '🇨🇿'],
  ['DE', 'Germany', 'EUR', 'de-DE', '🇩🇪'],
  ['DK', 'Denmark', 'DKK', 'da-DK', '🇩🇰'],
  ['EG', 'Egypt', 'EGP', 'ar-EG', '🇪🇬'],
  ['ES', 'Spain', 'EUR', 'es-ES', '🇪🇸'],
  ['ET', 'Ethiopia', 'ETB', 'am-ET', '🇪🇹'],
  ['FI', 'Finland', 'EUR', 'fi-FI', '🇫🇮'],
  ['FR', 'France', 'EUR', 'fr-FR', '🇫🇷'],
  ['GB', 'United Kingdom', 'GBP', 'en-GB', '🇬🇧'],
  ['GH', 'Ghana', 'GHS', 'en-GH', '🇬🇭'],
  ['GR', 'Greece', 'EUR', 'el-GR', '🇬🇷'],
  ['HK', 'Hong Kong', 'HKD', 'zh-HK', '🇭🇰'],
  ['HU', 'Hungary', 'HUF', 'hu-HU', '🇭🇺'],
  ['ID', 'Indonesia', 'IDR', 'id-ID', '🇮🇩'],
  ['IE', 'Ireland', 'EUR', 'en-IE', '🇮🇪'],
  ['IL', 'Israel', 'ILS', 'he-IL', '🇮🇱'],
  ['IN', 'India', 'INR', 'en-IN', '🇮🇳'],
  ['IT', 'Italy', 'EUR', 'it-IT', '🇮🇹'],
  ['JM', 'Jamaica', 'USD', 'en-JM', '🇯🇲'],
  ['JP', 'Japan', 'JPY', 'ja-JP', '🇯🇵'],
  ['KE', 'Kenya', 'KES', 'en-KE', '🇰🇪'],
  ['KR', 'South Korea', 'KRW', 'ko-KR', '🇰🇷'],
  ['LK', 'Sri Lanka', 'LKR', 'si-LK', '🇱🇰'],
  ['MA', 'Morocco', 'MAD', 'ar-MA', '🇲🇦'],
  ['MX', 'Mexico', 'MXN', 'es-MX', '🇲🇽'],
  ['MY', 'Malaysia', 'MYR', 'ms-MY', '🇲🇾'],
  ['NG', 'Nigeria', 'NGN', 'en-NG', '🇳🇬'],
  ['NL', 'Netherlands', 'EUR', 'nl-NL', '🇳🇱'],
  ['NO', 'Norway', 'NOK', 'nb-NO', '🇳🇴'],
  ['NZ', 'New Zealand', 'NZD', 'en-NZ', '🇳🇿'],
  ['PA', 'Panama', 'USD', 'es-PA', '🇵🇦'],
  ['PE', 'Peru', 'PEN', 'es-PE', '🇵🇪'],
  ['PH', 'Philippines', 'PHP', 'en-PH', '🇵🇭'],
  ['PK', 'Pakistan', 'PKR', 'ur-PK', '🇵🇰'],
  ['PL', 'Poland', 'PLN', 'pl-PL', '🇵🇱'],
  ['PT', 'Portugal', 'EUR', 'pt-PT', '🇵🇹'],
  ['QA', 'Qatar', 'QAR', 'ar-QA', '🇶🇦'],
  ['RO', 'Romania', 'RON', 'ro-RO', '🇷🇴'],
  ['RW', 'Rwanda', 'RWF', 'rw-RW', '🇷🇼'],
  ['SA', 'Saudi Arabia', 'SAR', 'ar-SA', '🇸🇦'],
  ['SE', 'Sweden', 'SEK', 'sv-SE', '🇸🇪'],
  ['SG', 'Singapore', 'SGD', 'en-SG', '🇸🇬'],
  ['SN', 'Senegal', 'XOF', 'fr-SN', '🇸🇳'],
  ['TH', 'Thailand', 'THB', 'th-TH', '🇹🇭'],
  ['TR', 'Türkiye', 'TRY', 'tr-TR', '🇹🇷'],
  ['TT', 'Trinidad and Tobago', 'TTD', 'en-TT', '🇹🇹'],
  ['TZ', 'Tanzania', 'TZS', 'sw-TZ', '🇹🇿'],
  ['UA', 'Ukraine', 'UAH', 'uk-UA', '🇺🇦'],
  ['UG', 'Uganda', 'UGX', 'en-UG', '🇺🇬'],
  ['US', 'United States', 'USD', 'en-US', '🇺🇸'],
  ['VN', 'Vietnam', 'VND', 'vi-VN', '🇻🇳'],
  ['ZA', 'South Africa', 'ZAR', 'en-ZA', '🇿🇦'],
];

export const CURRENCIES = [...CURRENCY_DEFS].sort((a, b) => a.name.localeCompare(b.name));
export const CURRENCY_MAP: Record<string, CurrencyInfo> = Object.fromEntries(
  CURRENCY_DEFS.map((item) => [item.code, item]),
);

export const COUNTRIES: CountryInfo[] = COUNTRY_ROWS.map(
  ([code, name, currency, locale, flag]) => ({ code, name, currency, locale, flag }),
).sort((a, b) => a.name.localeCompare(b.name));

export const COUNTRY_MAP: Record<string, CountryInfo> = Object.fromEntries(
  COUNTRIES.map((item) => [item.code, item]),
);

export const DEFAULT_COUNTRY = 'US';
export const DEFAULT_CURRENCY = 'USD';

export function currencyForCountry(country: string): string {
  return COUNTRY_MAP[country]?.currency ?? DEFAULT_CURRENCY;
}

export function localeForCountry(country: string): string {
  return COUNTRY_MAP[country]?.locale ?? 'en-US';
}
