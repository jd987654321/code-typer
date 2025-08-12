import { createContext } from "react";
import { create } from "zustand";

type TypingContext = {
  ResetTimer: () => void;
  StartTimer: () => void;
  isActive: boolean;
  canType: boolean;
  setCanType: React.Dispatch<React.SetStateAction<boolean>>;
  WPM: number;
  setWPM: React.Dispatch<React.SetStateAction<number>>;
};

//i can work with this react timer hook stuff, so we will wrap our typing page in this context
//maybe we should just use zustand instead of all this. Ok will do
/**
 * we will be storing two things, potentially any auth info
 */
