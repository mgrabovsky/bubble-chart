import { useEffect, useState } from 'react';

import './App.css';
import { Dataset, fetchDataset } from './dataset';

export function App() {
  const [dataset, setDataset] = useState<Dataset>();
  const isLoading = !dataset;

  // Fetch data on first render.
  useEffect(() => {
    fetchDataset().then(setDataset);
  }, []);

  return (
    <div className="App">
      <h1>An Etude on Human Progress</h1>
      <p>Hello, world! There’s going to be a bubble chart here soon.</p>
      {isLoading && <p>Loading data…</p>}
      {dataset && JSON.stringify(dataset.population[0])}
    </div>
  );
}
