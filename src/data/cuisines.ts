import type { Cuisine } from '../types';

export const DEFAULT_CUISINE: Cuisine = 'any';

type CuisineDef = {
  id: Cuisine;
  label: string;
  detail: string;
  areas: string[];
  dummyjson: string[];
};

export const CUISINES: CuisineDef[] = [
  {
    id: 'any',
    label: 'Any cuisine',
    detail: 'Whatever uses the fridge first',
    areas: [],
    dummyjson: [],
  },
  {
    id: 'american',
    label: 'American',
    detail: 'TheMealDB · DummyJSON',
    areas: ['American', 'Canadian'],
    dummyjson: ['American', 'Hawaiian'],
  },
  {
    id: 'british',
    label: 'British',
    detail: 'TheMealDB',
    areas: ['British', 'Irish'],
    dummyjson: [],
  },
  {
    id: 'caribbean',
    label: 'Caribbean',
    detail: 'TheMealDB Jamaican kitchens',
    areas: ['Jamaican'],
    dummyjson: [],
  },
  {
    id: 'chinese',
    label: 'Chinese',
    detail: 'TheMealDB · DummyJSON',
    areas: ['Chinese'],
    dummyjson: ['Asian'],
  },
  {
    id: 'french',
    label: 'French',
    detail: 'TheMealDB',
    areas: ['French'],
    dummyjson: [],
  },
  {
    id: 'greek',
    label: 'Greek',
    detail: 'TheMealDB · DummyJSON',
    areas: ['Greek'],
    dummyjson: ['Greek'],
  },
  {
    id: 'indian',
    label: 'Indian',
    detail: 'TheMealDB · DummyJSON',
    areas: ['Indian'],
    dummyjson: ['Indian', 'Pakistani'],
  },
  {
    id: 'italian',
    label: 'Italian',
    detail: 'TheMealDB · DummyJSON',
    areas: ['Italian'],
    dummyjson: ['Italian'],
  },
  {
    id: 'japanese',
    label: 'Japanese',
    detail: 'TheMealDB · DummyJSON',
    areas: ['Japanese'],
    dummyjson: ['Japanese'],
  },
  {
    id: 'korean',
    label: 'Korean',
    detail: 'TheMealDB · DummyJSON',
    areas: ['Korean'],
    dummyjson: ['Korean'],
  },
  {
    id: 'mediterranean',
    label: 'Mediterranean',
    detail: 'Italian, Greek, Spanish kitchens',
    areas: ['Italian', 'Greek', 'Spanish'],
    dummyjson: ['Mediterranean', 'Italian', 'Greek', 'Spanish'],
  },
  {
    id: 'mexican',
    label: 'Mexican',
    detail: 'TheMealDB · DummyJSON',
    areas: ['Mexican'],
    dummyjson: ['Mexican'],
  },
  {
    id: 'middle-eastern',
    label: 'Middle Eastern',
    detail: 'Egyptian, Turkish, Lebanese kitchens',
    areas: ['Egyptian', 'Turkish'],
    dummyjson: ['Turkish', 'Lebanese', 'Moroccan'],
  },
  {
    id: 'moroccan',
    label: 'Moroccan',
    detail: 'TheMealDB · DummyJSON',
    areas: ['Moroccan'],
    dummyjson: ['Moroccan'],
  },
  {
    id: 'spanish',
    label: 'Spanish',
    detail: 'TheMealDB · DummyJSON',
    areas: ['Spanish'],
    dummyjson: ['Spanish'],
  },
  {
    id: 'thai',
    label: 'Thai',
    detail: 'TheMealDB · DummyJSON',
    areas: ['Thai'],
    dummyjson: ['Thai'],
  },
  {
    id: 'vietnamese',
    label: 'Vietnamese',
    detail: 'TheMealDB · DummyJSON',
    areas: ['Vietnamese'],
    dummyjson: ['Vietnamese'],
  },
];

export const CUISINE_MAP: Record<Cuisine, CuisineDef> = Object.fromEntries(
  CUISINES.map((row) => [row.id, row]),
) as Record<Cuisine, CuisineDef>;

export const CUISINE_OPTIONS = CUISINES.map((row) => ({
  value: row.id,
  label: row.label,
  detail: row.detail,
}));

export function cuisineLabel(id: Cuisine | undefined): string {
  if (!id) return '';
  return CUISINE_MAP[id]?.label ?? id;
}

export function isCuisine(value: string | undefined): value is Cuisine {
  return Boolean(value && value in CUISINE_MAP);
}
