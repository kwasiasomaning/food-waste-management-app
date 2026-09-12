import { COUNTRY_MAP, CURRENCY_MAP, DEFAULT_CURRENCY } from '../data/places';

export function convertUsd(usd: number, currency = DEFAULT_CURRENCY): number {
  const rate = CURRENCY_MAP[currency]?.perUsd ?? 1;
  return usd * rate;
}

export function formatMoney(valueUsd: number, currency = DEFAULT_CURRENCY): string {
  const code = CURRENCY_MAP[currency]?.code ?? DEFAULT_CURRENCY;
  const amount = convertUsd(valueUsd, code);
  try {
    return new Intl.NumberFormat('en', {
      style: 'currency',
      currency: code,
    }).format(amount);
  } catch {
    const symbol = CURRENCY_MAP[code]?.symbol ?? code;
    return `${symbol}${amount.toFixed(2)}`;
  }
}

export function countryLabel(country: string): string {
  const info = COUNTRY_MAP[country];
  return info ? `${info.flag}  ${info.name}` : country;
}

export function currencyLabel(currency: string): string {
  const info = CURRENCY_MAP[currency];
  return info ? `${info.code} · ${info.name}` : currency;
}
