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

interface GridLinesProps {
  /** Numeric scale for the horizontal axis. */
  xScale: d3.ScaleContinuousNumeric<number, number>;
  /** Numeric scale for the vertical axis. */
  yScale: d3.ScaleContinuousNumeric<number, number>;
}

/**
 * Create grid lines in the plot area for the specified scales.
 */
function GridLines(props: GridLinesProps) {
  const { xScale, yScale } = props;
  const [x1, x2] = xScale.range();
  const [y1, y2] = yScale.range();

  return (
    <g className="grid">
      <g className="x">
        {xScale.ticks().map((tick) => (
          <line key={tick} transform={`translate(${xScale(tick)}, 0)`} y1={y1} y2={y2} />
        ))}
      </g>
      <g className="y">
        {yScale.ticks().map((tick) => (
          <line key={tick} transform={`translate(0, ${yScale(tick)})`} x1={x1} x2={x2} />
        ))}
      </g>
    </g>
  );
}

const arrowMarker = (
  <marker id="arrow" markerHeight="8" markerWidth="8" orient="auto" refX="8" refY="4">
    <path className="arrow" d="M 0 0 8 4 0 8" fill="none" stroke="grey" />
  </marker>
);

export interface BubbleChartProps {
  /** The dataset to render. */
  data: DatasetRow[];
  /** Outer height of the SVG element in px. */
  height: number;
  /** Inner margins of the chart in px. */
  margin: {
    bottom: number;
    left: number;
    right: number;
    top: number;
  };
  /** Outer width of the SVG element in px. */
  width: number;
  /** Domain (extent) of the horizontal axis (GDP per capita). */
  xDomain: [number, number];
  /** Domain (extent) of the vertical axis (life expectancy). */
  yDomain: [number, number];
  /** Domain (extent) of the circle size scale (√population). */
  sizeDomain: [number, number];
}

export function BubbleChart(props: BubbleChartProps) {
  const { data, height, margin, width, xDomain, yDomain } = props;
  const innerHeight = height - margin.top - margin.bottom;
  const xAxisEl = useRef<SVGGElement>(null);
  const yAxisEl = useRef<SVGGElement>(null);

  const [xScale, xAxis] = useMemo(() => {
    const scale = d3
      .scaleLog()
      .range([margin.left, width - margin.right])
      .domain(props.xDomain);
    const axis = d3.axisBottom(scale);
    return [scale, axis];
  }, [margin, width, xDomain]);
  const [yScale, yAxis] = useMemo(() => {
    const scale = d3
      .scaleLinear()
      .range([height - margin.bottom, margin.top])
      .domain(props.yDomain);
    const axis = d3.axisLeft(scale);
    return [scale, axis];
  }, [height, margin, yDomain]);
  const radiusScale = d3.scaleSqrt().range([2, 40]).domain(props.sizeDomain);

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
  }, [xAxis, yAxis]);

  if (!bubbles) return <p>No data available.</p>;

  // Horizontal axis title, annotation and ticks.
  const xAxisFragment = (
    <>
      <text
        className="title x"
        transform={`translate(${width - margin.right}, ${height - 8})`}
      >
        <tspan>GDP per capita</tspan> (2011 international dollars, logarithmic scale)
      </text>
      <g
        className="annotation x"
        transform={`translate(${width - margin.right - 20}, ${
          innerHeight + margin.top - 20
        })`}
      >
        <rect height="25" width="200" x="-190" y="-15" />
        <text>Countries grow economically richer</text>
        <line x1="-190" x2="10" y1="10" y2="10" />
      </g>
      <g ref={xAxisEl} transform={`translate(0, ${height - margin.bottom})`} />
    </>
  );

  // Vertical axis title, annotation and ticks.
  const yAxisFragment = (
    <>
      <text className="title y" transform={`translate(18, ${margin.top}) rotate(-90)`}>
        <tspan>Life expectancy</tspan> (years)
      </text>
      <g
        className="annotation y"
        transform={`translate(${margin.left + 30}, ${margin.top + 20}) rotate(-90)`}
      >
        <rect height="30" width="110" x="-100" y="-20" />
        <text>People live longer</text>
        <line x1="-100" x2="10" y1="-18" y2="-18" />
      </g>
      <g ref={yAxisEl} transform={`translate(${margin.left}, 0)`} />
    </>
  );

  return (
    <svg className="BubbleChart" viewBox={`0 0 ${width} ${height}`}>
      <defs>{arrowMarker}</defs>
      <GridLines xScale={xScale} yScale={yScale} />
      <g className="axes">
        {xAxisFragment}
        {yAxisFragment}
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
