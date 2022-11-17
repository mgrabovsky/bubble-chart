import * as d3 from 'd3';
import { useEffect, useMemo, useRef } from 'react';

import './BubbleChart.css';
import { DatasetRow } from '../dataset';

interface BubbleSpec {
  country: string;
  cx: number;
  cy: number;
  fill: string;
  r: number;
  title: string;
}

export interface BubbleChartProps {
  data: DatasetRow[];
  height: number;
  margin: {
    bottom: number;
    left: number;
    right: number;
    top: number;
  };
  width: number;
}

export function BubbleChart(props: BubbleChartProps) {
  const { data, height, margin, width } = props;
  const xAxisEl = useRef<SVGGElement>(null);
  const yAxisEl = useRef<SVGGElement>(null);

  const [xScale, xAxis] = useMemo(() => {
    const scale = d3.scaleLog().range([margin.left, width - margin.right]);
    const axis = d3.axisBottom(scale); // .tickFormat((d) => `$ ${d}`);
    return [scale, axis];
  }, [margin, width]);
  const [yScale, yAxis] = useMemo(() => {
    const scale = d3.scaleLinear().range([height - margin.bottom, margin.top]);
    const axis = d3.axisLeft(scale);
    return [scale, axis];
  }, [height, margin]);
  const radiusScale = d3.scaleSqrt().range([2, 40]).domain([100_000, 1.5e9]);

  // TODO: Either adjust axes dynamically or according to a prop.
  xScale.domain([100, 200_000]);
  yScale.domain([15, 90]);

  const bubbles = useMemo<BubbleSpec[] | undefined>(() => {
    if (!data.length) return;
    return data.map((d) => {
      const cx = xScale(d.gdp);
      const cy = yScale(d.expectancy);
      const fill = '#278b8ca0';
      const r = radiusScale(d.population);
      const title = `${d.country}`;
      return {
        country: d.code,
        cx,
        cy,
        fill,
        r,
        title,
      };
    });
  }, [data, xScale, yScale]);

  useEffect(() => {
    if (xAxisEl.current) d3.select(xAxisEl.current).call(xAxis);
    if (yAxisEl.current) d3.select(yAxisEl.current).call(yAxis);
    // TODO: Are we going to need to update this when we adjust scales dynamically?
  }, [xAxis, yAxis]);

  if (!bubbles) return <p>No data available.</p>;

  return (
    <svg className="BubbleChart" viewBox={`0 0 ${width} ${height}`}>
      <rect
        className="bg"
        height={height - margin.top - margin.bottom}
        width={width - margin.left - margin.right}
        x={margin.left}
        y={margin.top}
      />
      <g className="axes">
        <text
          className="label x"
          transform={`translate(${width - margin.right}, ${height - 8})`}
        >
          GDP per capita (constant 2011 international dollars)
        </text>
        <g ref={xAxisEl} transform={`translate(0, ${height - margin.bottom})`} />
        <text className="label y" transform={`translate(16, ${margin.top}) rotate(-90)`}>
          Life expectancy (years)
        </text>
        <g ref={yAxisEl} transform={`translate(${margin.left}, 0)`} />
      </g>
      <g>
        {bubbles?.map(({ country, title, ...bubble }) => (
          <circle {...bubble} key={country}>
            <title>{title}</title>
          </circle>
        ))}
      </g>
    </svg>
  );
}
