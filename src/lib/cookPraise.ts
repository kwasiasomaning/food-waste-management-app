export const COOK_PRAISE_TITLES = [
  'You saved this dinner.',
  'You fed a table, not a bin.',
  'This food made it to a plate.',
  'You cooked it in time.',
  'A small win against waste.',
  'You kept this meal from the landfill.',
  'You turned almost-gone into dinner.',
  'One less meal thrown away.',
  'Dinner won. The bin did not.',
  'You used it while it still counted.',
  'Well done — this food mattered.',
  'You gave this food a purpose.',
] as const;

let lastTitle: string | null = null;

export function pickCookPraise(
  exclude?: string | null,
  random: () => number = Math.random,
): string {
  const pool = COOK_PRAISE_TITLES.filter((title) => title !== exclude);
  const list = pool.length > 0 ? pool : COOK_PRAISE_TITLES;
  return list[Math.floor(random() * list.length)] ?? COOK_PRAISE_TITLES[0];
}

export function nextCookPraise(): string {
  const title = pickCookPraise(lastTitle);
  lastTitle = title;
  return title;
}

export function resetCookPraiseForTests(): void {
  lastTitle = null;
}
