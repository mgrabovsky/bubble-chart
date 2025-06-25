import './Trajectory.scss';

export interface PointCoordinates {
  x: number;
  y: number;
}

export interface TrajectoryProps {
  data: PointCoordinates[];
}

export function Trajectory(props: TrajectoryProps) {
  const { data } = props;

  const pointsString = data.map((d) => `${d.x},${d.y}`).join(' ');

  return <polyline className="trajectory" points={pointsString}></polyline>;
}
