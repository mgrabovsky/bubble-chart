import './Bubble.scss';

import { clsx } from 'clsx';

export interface BubbleProps {
  continent: string;
  country: string;
  onClick?(code: string): void;
  radius: number;
  selected?: boolean;
  title: string;
  x: number;
  y: number;
}

export function Bubble(props: BubbleProps) {
  const onClick = () => {
    if (!props.onClick) return;
    props.onClick(props.country);
  };

  return (
    <circle
      className={clsx('bubble', props.selected && 'selected')}
      data-continent={props.continent}
      cx={props.x}
      cy={props.y}
      onClick={onClick}
      r={props.radius}
    >
      <title>{props.title}</title>
    </circle>
  );
}
