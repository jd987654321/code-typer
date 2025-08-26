import { ReactElement, useEffect, useState, useRef, useContext } from "react";
import { useTimerContext } from "@/context/TimerProvider";
import { useTimer } from "react-timer-hook";
import useUserStore from "@/store/userStore";
import useAuthStore from "@/store/authStore";
import TypingSection from "@/pages/typing/TypingSection";
import FinishedSection from "@/pages/typing/FinishedSection";

export default function TypingPage(): ReactElement {
  const { time, setTime, secondsToDate, startTimer } = useTimerContext();

  const modalOpen = useAuthStore((state) => state.modalOpen);
  const { setLatestWPM, calculateWPM, setUserTyped, setLineNum, setWordIndex } =
    useUserStore();
  const startingTime = useUserStore((state) => state.startingTime);

  const [canType, setCanType] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const timerSeconds = useRef(startingTime);

  useEffect(() => {
    timerSeconds.current = startingTime;
  }, [startingTime]);

  //what happens if we finish the
  //isActive hook is just used to see if the timer has been activated
  //canType hook

  return (
    <>
      <div className="text-white">
        <p>{time}</p>

        <button
          onClick={() => {
            setTime(startingTime);
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
            setTime(startingTime);
          }}
          StartTimer={() => {
            //this function is attached to an event listener, which remembers this restart(secondsToDate(startingTime))
            //function while startingTime = 30, however if we attach a useRef, we can update the ref everytime startingTime
            //is changed,
            startTimer();
            //console.log(timerSeconds.current);
            //setTime(timerSeconds.current);
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
