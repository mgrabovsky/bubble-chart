import './Bubble.scss';

export interface BubbleProps {
  continent: string;
  country: string;
  radius: number;
  title: string;
  x: number;
  y: number;
}

export function Bubble(props: BubbleProps) {
  return (
    <circle
      className="bubble"
      data-continent={props.continent}
      cx={props.x}
      cy={props.y}
      r={props.radius}
    >
      <title>{props.title}</title>
    </circle>
  );
}

