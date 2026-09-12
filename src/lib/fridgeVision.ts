import { INGREDIENTS } from '../data/ingredients';

export type ColorShare = {
  green: number;
  red: number;
  orange: number;
  yellow: number;
  white: number;
  brown: number;
};

const COLOR_GUESSES: { bucket: keyof ColorShare; min: number; ids: string[] }[] = [
  { bucket: 'green', min: 0.07, ids: ['spinach', 'cucumber', 'bell-pepper'] },
  { bucket: 'red', min: 0.05, ids: ['tomato'] },
  { bucket: 'orange', min: 0.05, ids: ['carrot', 'cheddar'] },
  { bucket: 'yellow', min: 0.05, ids: ['lemon', 'butter', 'cheese'] },
  { bucket: 'white', min: 0.08, ids: ['milk', 'eggs', 'yogurt', 'leftover-rice'] },
  { bucket: 'brown', min: 0.05, ids: ['bread', 'onion'] },
];

const KNOWN_IDS = new Set(INGREDIENTS.map((item) => item.id));

export function guessFromFilename(uri: string): string[] {
  const hay = decodeURIComponent(uri).toLowerCase();
  const found: string[] = [];
  for (const ingredient of INGREDIENTS) {
    if (ingredient.isStaple) continue;
    const names = [ingredient.id.replace(/-/g, ' '), ingredient.name.toLowerCase(), ...ingredient.aliases];
    if (names.some((name) => name.length > 2 && hay.includes(name))) {
      found.push(ingredient.id);
    }
  }
  return [...new Set(found)];
}

export function guessFromColors(share: ColorShare): string[] {
  const found: string[] = [];
  for (const rule of COLOR_GUESSES) {
    if (share[rule.bucket] >= rule.min) {
      for (const id of rule.ids) {
        if (KNOWN_IDS.has(id)) found.push(id);
      }
    }
  }
  return [...new Set(found)];
}

export function classifyPixel(r: number, g: number, b: number): keyof ColorShare | null {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max < 28) return null;
  if (max > 210 && min > 180) return 'white';
  if (g > r + 18 && g > b + 10) return 'green';
  if (r > 140 && r > g + 25 && r > b + 20 && g < 120) return 'red';
  if (r > 150 && g > 90 && g < 170 && b < 90 && r > g) return 'orange';
  if (r > 160 && g > 140 && b < 110) return 'yellow';
  if (r > 70 && r < 170 && g > 40 && g < 130 && b < 90 && r >= g) return 'brown';
  return null;
}

export async function readColorShare(uri: string): Promise<ColorShare | null> {
  if (typeof document === 'undefined') return null;
  try {
    const image = await loadImage(uri);
    const canvas = document.createElement('canvas');
    const size = 48;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;
    ctx.drawImage(image, 0, 0, size, size);
    const { data } = ctx.getImageData(0, 0, size, size);
    const counts: ColorShare = { green: 0, red: 0, orange: 0, yellow: 0, white: 0, brown: 0 };
    let classified = 0;
    for (let i = 0; i < data.length; i += 16) {
      const bucket = classifyPixel(data[i], data[i + 1], data[i + 2]);
      if (!bucket) continue;
      counts[bucket] += 1;
      classified += 1;
    }
    if (!classified) return null;
    (Object.keys(counts) as (keyof ColorShare)[]).forEach((key) => {
      counts[key] = counts[key] / classified;
    });
    return counts;
  } catch {
    return null;
  }
}

function loadImage(uri: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('image'));
    image.src = uri;
  });
}

export async function identifyFridgeContents(uri: string): Promise<string[]> {
  const fromName = guessFromFilename(uri);
  const share = await readColorShare(uri);
  const fromColor = share ? guessFromColors(share) : [];
  return [...new Set([...fromName, ...fromColor])];
}
