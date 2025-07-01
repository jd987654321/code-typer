import { ReactElement } from "react";

type Props = {
  recordedSpeed: boolean[];
};

export default function FinishedSection({
  recordedSpeed,
}: Props): ReactElement {
  console.log(recordedSpeed);
  return (
    <div className="text-white">
      <p>Nice job ur done now :D</p>
      <p>Result: {recordedSpeed.filter(Boolean).length} WPM</p>
    </div>
  );
}
