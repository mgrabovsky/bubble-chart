import datasetUrl from './data/dataset.json?url';

export interface DatasetRow {
  code: string;
  country: string;
  expectancy: number;
  gdp: number;
  population: number;
  year: number;
}

export type Dataset = DatasetRow[];

export async function fetchDataset(): Promise<Dataset> {
  return fetch(datasetUrl).then(response => response.json());
}
