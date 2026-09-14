export const colors = {
  paper: '#F3EBE0',
  paperDeep: '#E8DCCB',
  cream: '#FFF8EF',
  ink: '#1B1713',
  inkSoft: '#6A6156',
  line: '#D9CCBA',
  terracotta: '#C24722',
  terracottaDeep: '#8F2E14',
  sage: '#3E6A4C',
  sageSoft: '#D5E4D4',
  amber: '#C4841A',
  amberSoft: '#F3E1B5',
  tonight: '#C24722',
  soon: '#C4841A',
  fresh: '#3E6A4C',
  staple: '#6A6156',
  wood: '#231C16',
  woodSoft: '#3A2F26',
};

export const fonts = {
  display: 'Fraunces_600SemiBold',
  displayItalic: 'Fraunces_400Regular_Italic',
  displayBold: 'Fraunces_700Bold',
  sans: 'NunitoSans_400Regular',
  sansSemi: 'NunitoSans_600SemiBold',
  sansBold: 'NunitoSans_700Bold',
};

export const space = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 36,
};

export const radius = {
  sm: 12,
  md: 18,
  lg: 26,
  xl: 34,
  pill: 999,
};

export const urgencyCopy: Record<string, string> = {
  tonight: 'Use tonight',
  soon: 'This week',
  fresh: 'Fresh',
  staple: 'Staple',
};

export const traffic = {
  tonight: {
    ink: '#9E4A3C',
    wash: '#F6E8E2',
    rail: '#C56A5A',
  },
  soon: {
    ink: '#9A7424',
    wash: '#F4EBD4',
    rail: '#D1A24A',
  },
  fresh: {
    ink: '#4F6F56',
    wash: '#E7EFE6',
    rail: '#7A9A7E',
  },
  staple: {
    ink: '#6A6156',
    wash: '#FFF8EF',
    rail: '#C9BDAE',
  },
} as const;
