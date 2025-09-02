import { ReactElement } from "react";
import useStore from "../../store/userStore";

export default function FinishedSection(): ReactElement {
  const { latestWPM, lineNum, wordIndex, textArray } = useStore();
  return (
    <div className="text-white">
      <p>Nice job ur done now :D</p>
      <p>Result: {latestWPM} WPM</p>
      <p>
        You stopped at line: {lineNum} and wordIndex: {wordIndex} word:{" "}
        {textArray?.[lineNum][wordIndex]}
      </p>
    </div>
  );
}
