import { useState, createContext, useContext } from "react";

type TimerSettings = {
  persistentTimerVal: number;
  setPersistentTimerVal: React.Dispatch<React.SetStateAction<number>>;
};

const TimerContext = createContext<TimerSettings | undefined>(undefined);

//so the problem is that

const useTimerContext = () => {
  const timerContext = useContext(TimerContext);
  if (!timerContext) {
    throw new Error("TimerContext must be defined");
  }
  return timerContext;
};

export { useTimerContext, TimerContext };
