export const CONTINENTS = [
  'Africa',
  'Asia',
  'Europe',
  'North America',
  'Oceania',
  'South America',
] as const;

export type Continent = typeof CONTINENTS[number];

export interface DatasetRow {
  code: string;
  continent: Continent;
  country: string;
  expectancy: number;
  gdp: number;
  population: number;
  year: number;
}

export type Dataset = DatasetRow[];

export async function fetchDataset(url: string): Promise<Dataset> {
  return fetch(url).then((response) => response.json());
}
