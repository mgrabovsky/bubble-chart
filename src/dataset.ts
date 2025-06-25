export const CONTINENTS = [
  'Africa',
  'Asia',
  'Europe',
  'North America',
  'Oceania',
  'South America',
] as const;

export type Continent = (typeof CONTINENTS)[number];

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

export interface FilterCriteria {
  continent?: Continent;
  year: number;
}

export async function fetchDataset(url: string): Promise<Dataset> {
  return fetch(url).then((response) => response.json());
}

/**
 * Filter the dataset for entries matching the given criteria.
 * Returns a new dataset.
 */
export function filterDataset(dataset: Dataset, criteria: FilterCriteria) {
  const { continent, year } = criteria;
  return (
    dataset
      .filter((d) => d.year === year && (continent ? d.continent === continent : true))
      // Sort by descending population so that the biggest countries are rendered
      // first and that the smaller ones are hoverable.
      .sort((d1, d2) => d2.population - d1.population)
  );
}
