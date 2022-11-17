import { useEffect, useMemo, useState } from 'react';

import './App.css';
import datasetUrl from '../data/dataset.json?url';
import { BubbleChart } from './BubbleChart';
import { Continent, Dataset, fetchDataset } from '../dataset';
import { ContinentSelector } from './ContinentSelector';
import { YearSelector } from './YearSelector';

const chartWidth = 600;
const chartHeight = 400;
const chartMargins = { top: 20, right: 40, bottom: 45, left: 50 };
const defaultYear = 2000;

interface FilterCriteria {
  continent?: Continent;
  year: number;
}

/**
 * Filter the dataset for entries matching the given criteria.
 * Returns a new dataset.
 */
function filterDataset(dataset: Dataset, criteria: FilterCriteria) {
  const { continent, year } = criteria;
  return (
    dataset
      .filter((d) => d.year === year && (continent ? d.continent === continent : true))
      // Sort by descending population so that the biggest countries are rendered
      // first and that the smaller ones are hoverable.
      .sort((d1, d2) => d2.population - d1.population)
  );
}

/**
 * Root component of the bubble chart application.
 */
export function App() {
  const [dataset, setDataset] = useState<Dataset>();
  const isLoading = !dataset;
  const [continent, setContinent] = useState<Continent>();
  const [year, setYear] = useState(defaultYear);
  // The time series start at 1950 for most countries.
  const yearRange = [1950, 2018] as const;

  // Fetch data on first render.
  useEffect(() => {
    fetchDataset(datasetUrl).then(setDataset);
  }, []);

  // Display only data matching the selected criteria.
  const filteredData = useMemo<Dataset | undefined>(() => {
    if (!dataset || !dataset.length) return;
    return filterDataset(dataset, { continent, year });
  }, [continent, dataset, year]);

  return (
    <div className="App">
      <h1>An Etude on Human Progress</h1>
      <div className="intro">
        <p>
          The following chart aims to illustrate the progress of humanity towards richer
          and healthier societies.
        </p>
        <p>
          Each circle corresponds to a country of the world in the year {year}. The area
          of a circle is proportional to the country’s population.
        </p>
        <p>
          Circles are coloured according to the country’s continent.{' '}
          {(continent && 'Only countries') || 'Countries'} from{' '}
          <ContinentSelector onChange={setContinent} value={continent} /> are shown.
        </p>
        <p>
          Hover over a circle to view detailed numbers for each country (per-capita GDP,
          population and life expectancy).
        </p>
      </div>
      {isLoading && <p>Loading data…</p>}
      {filteredData && (
        <>
          <YearSelector
            max={yearRange[1]}
            min={yearRange[0]}
            onChange={setYear}
            value={year}
          />
          <BubbleChart
            data={filteredData}
            height={chartHeight}
            margin={chartMargins}
            width={chartWidth}
            // Domains were picked to contain all data comfortably.
            sizeDomain={[100_000, 1.5e9]}
            xDomain={[200, 200_000]}
            yDomain={[15, 90]}
          />
        </>
      )}
    </div>
  );
}
