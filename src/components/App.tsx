import { useEffect, useState } from 'react';

import './App.css';
import datasetUrl from '../data/dataset.json?url';
import { BubbleChart } from './BubbleChart';
import { Continent, Dataset, fetchDataset } from '../dataset';
import { ContinentSelector } from './ContinentSelector';
import { YearSelector } from './YearSelector';

const CHART_SIZE = { height: 400, width: 600 };
const CHART_MARGINS = { top: 20, right: 40, bottom: 45, left: 50 };
const DEFAULT_YEAR = 2000;

/**
 * Root component of the bubble chart application.
 */
export function App() {
  const [dataset, setDataset] = useState<Dataset>();
  const isLoading = !dataset;
  const [continent, setContinent] = useState<Continent>();
  const [year, setYear] = useState(DEFAULT_YEAR);
  // The time series start at 1950 for most countries.
  const yearRange = [1950, 2018] as const;

  // Fetch data on first render.
  useEffect(() => {
    fetchDataset(datasetUrl).then(setDataset);
  }, []);

  const filterCriteria = { continent, year };

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
      {dataset && (
        <>
          <YearSelector
            max={yearRange[1]}
            min={yearRange[0]}
            onChange={setYear}
            value={year}
          />
          <BubbleChart
            criteria={filterCriteria}
            data={dataset}
            height={CHART_SIZE.height}
            margin={CHART_MARGINS}
            width={CHART_SIZE.width}
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
