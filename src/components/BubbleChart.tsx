import * as d3 from 'd3';
import { useEffect, useMemo, useRef } from 'react';

import './BubbleChart.scss';
import { DatasetRow } from '../dataset';

interface BubbleSpec {
  continent: string;
  country: string;
  cx: number;
  cy: number;
  fill?: string;
  r: number;
  title: string;
}

const expectancyFormat = d3.format('.1f');
const gdpFormat = d3.format('$,d');
const populationFormat = d3.format(',d');

const makeLabel = (d: DatasetRow) =>
  `${d.country} in ${d.year}
GDP per capita: ${gdpFormat(d.gdp)}
Population: ${populationFormat(d.population)}
Life expectancy: ${expectancyFormat(d.expectancy)} years`;

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
  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;
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
      const r = radiusScale(d.population);
      const title = makeLabel(d);
      return {
        continent: d.continent,
        country: d.code,
        cx,
        cy,
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
      <g className="grid">
        <g className="x">
          {xScale.ticks().map((i) => (
            <line transform={`translate(${xScale(i)}, ${margin.top})`} y2={innerHeight} />
          ))}
        </g>
        <g className="y">
          {yScale.ticks().map((i) => (
            <line transform={`translate(${margin.left}, ${yScale(i)})`} x2={innerWidth} />
          ))}
        </g>
      </g>
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
      <g className="plot">
        {bubbles?.map(({ continent, country, title, ...bubble }) => (
          <circle className="bubble" data-continent={continent} {...bubble} key={country}>
            <title>{title}</title>
          </circle>
        ))}
      </g>
    </svg>
  );
}
