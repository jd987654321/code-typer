import { ReactElement, useEffect, useState, useRef, useContext } from "react";
import { useTimer } from "react-timer-hook";
import useStore from "@/store/userStore";
import useAuthStore from "@/store/authStore";
import TypingSection from "@/pages/typing/TypingSection";
import FinishedSection from "@/pages/typing/FinishedSection";

export default function TypingPage(): ReactElement {
  const modalOpen = useAuthStore((state) => state.modalOpen);
  const { setLatestWPM, calculateWPM, setUserTyped, setLineNum, setWordIndex } =
    useStore();
  const startingTime = useStore((state) => state.startingTime);
  const { setStartingTime } = useStore();

  const [canType, setCanType] = useState(true);
  const [startedTyping, setStartedTyping] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [textStates, setTextStates] = useState<boolean[]>([]);
  const timerSeconds = useRef(startingTime);

  const secondsToDate = (seconds: number) => {
    const date = new Date();
    date.setSeconds(date.getSeconds() + seconds);
    console.log(date.getMinutes());
    return date;
  };

  const { totalSeconds, start, pause, resume, restart } = useTimer({
    autoStart: false,
    expiryTimestamp: secondsToDate(startingTime),
    interval: 1,
    onExpire: () => {
      setCanType(false);
      setLatestWPM(calculateWPM(startingTime));
    },
  });

  const changeTime = (timeInSeconds: number) => {
    setStartingTime(timeInSeconds);
    restart(secondsToDate(timeInSeconds), false);
  };

  useEffect(() => {
    timerSeconds.current = startingTime;
  }, [startingTime]);

  //we want the timer to start when typing starts, when the timer hits zero typing has to be disabled and a new pop screen
  //appears, we can add stats after, for now i will settle for when the timer hits zero, we change some text

  //we can have a canType hook, each time the timer goes, if the timerVal is zero, we change the canType hook to false

  //the functionality is that when we start typing, the timer starts
  //it continues until it hits zero in which typing is disabled, then an end screen pops up

  //when typing starts, then start timer

  //use some buttons to change the time, only allow time change before timer is activated

  return (
    <>
      <div className="text-white">
        <h1>Timer</h1>
        <p>{totalSeconds}</p>

        <div className="w-60 h-20 border-black border-2 ">
          {!canType || isActive ? (
            //canType == true and isActive == false -> shows timer
            <p>Type Type Type</p>
          ) : (
            <>
              <p>set the timer to</p>
              <button
                className="border-vscode-outline1 border-2 mx-2"
                onClick={() => changeTime(10)}
              >
                10
              </button>
              <button
                className="border-vscode-outline1 border-2 mx-2"
                onClick={() => changeTime(30)}
              >
                30
              </button>
              <button
                className="border-vscode-outline1 border-2 mx-2"
                onClick={() => changeTime(60)}
              >
                60
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => {
            restart(secondsToDate(startingTime), false);
            setCanType(true);
            setIsActive(false);
            setUserTyped("");
            setLineNum(0);
            setWordIndex(0);
            console.log(startingTime);
          }}
        >
          Reset
        </button>
      </div>
      {canType ? (
        <TypingSection
          isActive={isActive}
          setIsActive={setIsActive}
          ResetTimer={() => {
            restart(secondsToDate(startingTime));
          }}
          StartTimer={() => {
            //this function is attached to an event listener, which remembers this restart(secondsToDate(startingTime))
            //function while startingTime = 30, however if we attach a useRef, we can update the ref everytime startingTime
            //is changed,
            console.log(timerSeconds.current);
            restart(secondsToDate(timerSeconds.current));
          }}
          canType={canType}
          setCanType={setCanType}
        />
      ) : (
        <FinishedSection />
      )}
    </>
  );
}
