import { useEffect, useMemo, useState } from 'react';

import './App.css';
import { BubbleChart } from './BubbleChart';
import { Dataset, fetchDataset } from '../dataset';

const chartWidth = 600;
const chartHeight = 400;
const chartMargins = { top: 20, right: 40, bottom: 50, left: 50 };

export function App() {
  const [dataset, setDataset] = useState<Dataset>();
  const isLoading = !dataset;
  const yearSelected = 2016;

  // Fetch data on first render.
  useEffect(() => {
    fetchDataset().then(setDataset);
  }, []);

  const transformedData = useMemo<Dataset | undefined>(() => {
    if (!dataset) return;
    return (
      dataset
        .filter((d) => d.year === yearSelected)
        // Sort by descending population so that the biggest countries are rendered
        // first and that the smaller ones are hoverable.
        .sort((d1, d2) => d2.population - d1.population)
    );
  }, [dataset, yearSelected]);

  return (
    <div className="App">
      <h1>An Etude on Human Progress</h1>
      {isLoading && <p>Loading data…</p>}
      {transformedData && (
        <BubbleChart
          data={transformedData}
          height={chartHeight}
          margin={chartMargins}
          width={chartWidth}
        />
      )}
    </div>
  );
}
