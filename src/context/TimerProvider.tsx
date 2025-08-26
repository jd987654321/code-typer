import { createContext, useContext, useState, PropsWithChildren } from "react";
import { useTimer } from "react-timer-hook";

type TimerContext = {
  time: number;
  secondsToDate: (seconds: number) => void;
  setTime: (seconds: number) => void;
  startTimer: () => void;
};

export const TimerContext = createContext<TimerContext | null>(null);

export default function TimerProvider({ children }: PropsWithChildren) {
  const secondsToDate = (seconds: number) => {
    const date = new Date();
    date.setSeconds(date.getSeconds() + seconds);
    //console.log(date.getMinutes());
    return date;
  };

  const { totalSeconds, restart, start } = useTimer({
    autoStart: false,
    expiryTimestamp: secondsToDate(55),
    interval: 1,
    onExpire: () => console.log("timer finished"),
  });

  const setTime = (seconds: number) => {
    restart(secondsToDate(seconds), false);
  };

  return (
    <TimerContext.Provider
      value={{
        startTimer: () => {
          console.log("we are in provider function");
          start();
        },
        time: totalSeconds,
        secondsToDate: secondsToDate,
        setTime: setTime,
      }}
    >
      <button onClick={start}>click here</button>
      {children}
    </TimerContext.Provider>
  );
}

export const useTimerContext = () => {
  const context = useContext(TimerContext);
  if (!context) throw new Error("Timer Context is null");
  return context;
};
