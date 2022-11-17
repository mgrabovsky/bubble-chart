import './ContinentSelector.css';
import { Continent, CONTINENTS } from '../dataset';

export interface ContinentSelectorProps {
  onChange(newValue: Continent | undefined): void;
  value?: Continent;
}

/**
 * Dropdown for choosing a continent from a fixed list.
 */
export function ContinentSelector(props: ContinentSelectorProps) {
  const options = ['all continents'].concat(CONTINENTS);

  const onChangeInner = (newValue: string) => {
    if (newValue === 'all continents') props.onChange(undefined);
    else props.onChange(newValue as Continent);
  };

  return (
    <select
      className="ContinentSelector"
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
  );
}
