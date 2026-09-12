const FRACTIONS: Record<number, string> = {
  0: '',
  0.125: '⅛',
  0.25: '¼',
  0.375: '⅜',
  0.5: '½',
  0.625: '⅝',
  0.75: '¾',
  0.875: '⅞',
};

const LEADING_QTY = /^(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?)/;

export function parseCookNumber(raw: string): number {
  const mixed = raw.trim().match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixed) return Number(mixed[1]) + Number(mixed[2]) / Number(mixed[3]);
  const frac = raw.trim().match(/^(\d+)\/(\d+)$/);
  if (frac) return Number(frac[1]) / Number(frac[2]);
  return Number(raw);
}

export function formatCookQty(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return '1';
  const eighths = Math.round(value * 8) / 8;
  const whole = Math.floor(eighths + 1e-9);
  const frac = Math.round((eighths - whole) * 8) / 8;
  const glyph = FRACTIONS[frac];
  if (glyph === undefined) {
    return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, '');
  }
  if (!whole) return glyph || '1';
  if (!glyph) return String(whole);
  return `${whole}${glyph}`;
}

export function scaleAmount(amount: string, fromServings: number, toServings: number): string {
  if (fromServings <= 0 || toServings <= 0 || fromServings === toServings) return amount;
  const match = amount.match(LEADING_QTY);
  if (!match) return amount;
  const scaled = parseCookNumber(match[1]) * (toServings / fromServings);
  return `${formatCookQty(scaled)}${amount.slice(match[1].length)}`;
}

export function servingLabel(householdSize: number): string {
  return householdSize === 1 ? 'serves 1' : `serves ${householdSize}`;
}
