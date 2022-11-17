import './ContinentSelector.css';
import { Continent, CONTINENTS } from '../dataset';

export interface ContinentSelectorProps {
  onChange(newValue: Continent | undefined): void;
  value?: Continent;
}

export function ContinentSelector(props: ContinentSelectorProps) {
  const options = ['All'].concat(CONTINENTS);

  const onChangeInner = (newValue: string) => {
    if (newValue === 'All') props.onChange(undefined);
    else props.onChange(newValue as Continent);
  };

  return (
    <div className="ContinentSelector">
      <label htmlFor="continent-selector">Selected continent:</label>
      <select
        id="continent-selector"
        onChange={({ target }) => onChangeInner(target.value)}
        value={props.value}
      >
        {options.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
    </div>
  );
}
