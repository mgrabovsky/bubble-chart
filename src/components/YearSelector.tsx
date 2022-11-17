import './YearSelector.css';

export interface YearSelectorProps {
  max: number;
  min: number;
  onChange(newValue: number): void;
  value: number;
}

/**
 * Slider for choosing a year within a fixed range.
 */
export function YearSelector(props: YearSelectorProps) {
  return (
    <div className="YearSelector">
      <label htmlFor="year-selector">Select year:</label>
      <input
        id="year-selector"
        max={props.max}
        min={props.min}
        onChange={({ target }) => props.onChange(Number(target.value))}
        step={1}
        type="range"
        value={props.value}
      />
      <span>{props.value}</span>
    </div>
  );
}
