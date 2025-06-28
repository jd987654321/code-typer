import { ReactElement, useEffect, useState, useRef, useContext } from "react";

import { useTimerContext } from "@/context/TimerContext";

import TypingSection from "./TypingSection";
import FinishedSection from "./FinishedSection";

export default function TypingPage(): ReactElement {
  const [canType, setCanType] = useState(true);
  const [startedTyping, setStartedTyping] = useState(false);
  const { persistentTimerVal, setPersistentTimerVal } = useTimerContext();
  const [timerVal, setTimerVal] = useState(persistentTimerVal);
  const [isActive, setIsActive] = useState(false);
  const [textStates, setTextStates] = useState<boolean[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimerVal((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            setCanType(false);
          }
          if (prev == 0) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  const StartTimer = () => {
    setIsActive(true);
  };

  const ResetTimer = () => {
    setCanType(true);
    setTimerVal(persistentTimerVal);
    setIsActive(false);
  };

  const ChangeTimer = (time: number) => {
    if (!isActive) {
      setTimerVal(time);
      setPersistentTimerVal(time);
    }
  };
  //we want the timer to start when typing starts, when the timer hits zero typing has to be disabled and a new pop screen
  //appears, we can add stats after, for now i will settle for when the timer hits zero, we change some text

  //we can have a canType hook, each time the timer goes, if the timerVal is zero, we change the canType hook to false

  //the functionality is that when we start typing, the timer starts
  //it continues until it hits zero in which typing is disabled, then an end screen pops up

  //when typing starts, then start timer

  //use some buttons to change the time, only allow time change before timer is activated

  return (
    <>
      <div>
        <h1>Timer</h1>
        <p>{timerVal}</p>
        <div className="w-60 h-20 border-black border-2 ">
          {!canType || isActive ? (
            <p>Type Type Type</p>
          ) : (
            <>
              <p>set the timer to</p>
              <button className="bg-white mx-2" onClick={() => ChangeTimer(10)}>
                10
              </button>
              <button className="bg-white mx-2" onClick={() => ChangeTimer(30)}>
                30
              </button>
              <button className="bg-white mx-2" onClick={() => ChangeTimer(60)}>
                60
              </button>
            </>
          )}
        </div>

        <button onClick={() => ResetTimer()}>Reset</button>
      </div>
      {canType ? (
        <TypingSection
          textStates={textStates}
          setTextStates={setTextStates}
          isActive={isActive}
          ResetTimer={ResetTimer}
          StartTimer={StartTimer}
          canType={canType}
          setCanType={setCanType}
        />
      ) : (
        <FinishedSection recordedSpeed={textStates} />
      )}
    </>
  );
}
