import * as d3 from 'd3';

import gdpDataPath from './data/gdp-per-capita.csv';
import expectancyDataPath from './data/life-expectancy.csv';
import populationDataPath from './data/population.csv';

type CommonColumns = 'Code' | 'Entity' | 'Year';
type ExpectancyColumns = CommonColumns | 'Life expectancy';
type GdpColumns = CommonColumns | 'GDP per capita';
type PopulationColumns = CommonColumns | 'Population (historical estimates)';

const DATASET_SPEC: Array<[string, (rawRow: d3.DSVRowString<string>) => any]> = [
  [
    expectancyDataPath,
    (rawRow: d3.DSVRowString<ExpectancyColumns>) => ({
      code: rawRow['Code'],
      country: rawRow['Entity'],
      expectancy: Number(rawRow['Life expectancy']),
      year: Number(rawRow['Year']),
    }),
  ],
  [
    gdpDataPath,
    (rawRow: d3.DSVRowString<GdpColumns>) => ({
      code: rawRow['Code'],
      country: rawRow['Entity'],
      gdp: Number(rawRow['GDP per capita']),
      year: Number(rawRow['Year']),
    }),
  ],
  [
    populationDataPath,
    (rawRow: d3.DSVRowString<PopulationColumns>) => ({
      code: rawRow['Code'],
      country: rawRow['Entity'],
      expectancy: Number(rawRow['Population (historical estimates)']),
      year: Number(rawRow['Year']),
    }),
  ],
];

type ExpectancyRow = any;
type GdpRow = any;
type PopulationRow = any;

export interface Dataset {
  expectancy: ExpectancyRow[];
  gdp: GdpRow[];
  population: PopulationRow[];
}

export async function fetchDataset(): Promise<Dataset> {
  return Promise.all(DATASET_SPEC.map((params) => d3.csv(...params))).then(
    ([expectancy, gdp, population]) => ({
      expectancy,
      gdp,
      population,
    })
  );
}