export type WasteBrief = {
  id: string;
  kind: 'fact' | 'quote' | 'research';
  source: string;
  text: string;
  cite: string;
};

export const WASTE_BRIEFS: WasteBrief[] = [
  {
    id: 'unep-billion-meals',
    kind: 'fact',
    source: 'UNEP · 2024',
    text: 'Households threw away more than one billion meals a day in 2022, while 783 million people went hungry.',
    cite: 'Food Waste Index Report',
  },
  {
    id: 'unep-household-share',
    kind: 'research',
    source: 'UNEP · WRAP',
    text: 'Of the food wasted after it leaves the farm, 60% is wasted at home. That was 631 million tonnes in 2022.',
    cite: 'Food Waste Index Report 2024',
  },
  {
    id: 'unep-79kg',
    kind: 'fact',
    source: 'UNEP · 2024',
    text: 'The average person wastes 79 kg of food at home each year — about 1.3 meals a day for every person facing hunger.',
    cite: 'Food Waste Index Report',
  },
  {
    id: 'unep-fifth',
    kind: 'research',
    source: 'UNEP · 2024',
    text: '1.05 billion tonnes of food were wasted in 2022 at shops, restaurants, and homes — almost one-fifth of food available to consumers.',
    cite: 'Food Waste Index Report',
  },
  {
    id: 'andersen-tragedy',
    kind: 'quote',
    source: 'Inger Andersen, UNEP',
    text: '“Food waste is a global tragedy. Millions will go hungry today as food is wasted across the world.”',
    cite: 'UNEP press release, March 2024',
  },
  {
    id: 'ipcc-emissions',
    kind: 'research',
    source: 'IPCC',
    text: 'Food loss and waste accounted for 8–10% of human-caused greenhouse gases between 2010 and 2016.',
    cite: 'Climate Change and Land, 2019',
  },
  {
    id: 'fao-one-third',
    kind: 'research',
    source: 'FAO',
    text: 'Roughly one-third of food grown for people is lost or wasted — about 1.3 billion tonnes a year.',
    cite: 'Global Food Losses and Food Waste, 2011',
  },
  {
    id: 'fao-third-emitter',
    kind: 'fact',
    source: 'FAO',
    text: 'If food loss and waste were a country, it would be the third-largest greenhouse-gas emitter, after China and the United States.',
    cite: 'Food Wastage Footprint, 2013',
  },
  {
    id: 'fao-farmland',
    kind: 'research',
    source: 'FAO',
    text: 'Food grown and never eaten occupies almost 1.4 billion hectares — close to 30% of the world’s farmland.',
    cite: 'Food Wastage Footprint, 2013',
  },
  {
    id: 'unep-aviation',
    kind: 'fact',
    source: 'UNEP · 2024',
    text: 'Food loss and waste generates 8–10% of yearly global greenhouse gases — almost five times the aviation sector.',
    cite: 'Food Waste Index Report',
  },
  {
    id: 'unep-trillion',
    kind: 'fact',
    source: 'UNEP · 2024',
    text: 'Food loss and waste costs the global economy roughly $1 trillion a year.',
    cite: 'Food Waste Index Report',
  },
  {
    id: 'wrap-landfill',
    kind: 'quote',
    source: 'Harriet Lamb, WRAP',
    text: '“This is critical to ensuring food feeds people, not landfills.”',
    cite: 'UNEP / WRAP, 2024',
  },
  {
    id: 'unep-not-rich',
    kind: 'research',
    source: 'UNEP · 2024',
    text: 'Food waste is not only a rich-country problem. Household waste per person is similar across high- and middle-income countries.',
    cite: 'Food Waste Index Report',
  },
  {
    id: 'sdg-123',
    kind: 'fact',
    source: 'UN · SDG 12.3',
    text: 'The world agreed to halve retail and household food waste by 2030. Most countries still do not measure it well enough to know if they are on track.',
    cite: 'UNEP Food Waste Index Report 2024',
  },
  {
    id: 'refed-spending',
    kind: 'research',
    source: 'ReFED',
    text: 'U.S. households spent $141 billion on food that went uneaten in 2024 — about 13% of grocery spending.',
    cite: 'ReFED Insights Engine',
  },
  {
    id: 'refed-meals',
    kind: 'fact',
    source: 'ReFED',
    text: 'Surplus food in U.S. homes added up to about 39 billion uneaten meals in 2024.',
    cite: 'ReFED Insights Engine',
  },
];
