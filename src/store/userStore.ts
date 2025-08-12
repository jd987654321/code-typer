import { create } from "zustand";

/**
 * list of things that should be accessable globally
 *
 * ? Potentially auth info
 *
 * ? Last WPM result
 *
 * ? timer starting time
 * we could store this in cookies but for now we will store it here
 */

/**
 * when it comes to typing info we should store the sentence here,
 * or should we?
 */

//we pretty much need to move the user typing progress to the layer above, so if we put it into this store then we can access
//this info in the parent element, we could also calculate wpm every second too to get a graph of our typing

type SiteInfo = {
  latestWPM: number;
  setLatestWPM: (newWPM: number) => void;
  startingTime: number;
  setStartingTime: (newTime: number) => void;
  userTyped: string;
  setUserTyped: (newString: string) => void;
  text: string;
  textArray: string[][] | null;
  spacesArray: number[] | null;
  setText: (newText: string) => void;
  lineNum: number;
  setLineNum: (newLineNum: number) => void;
  wordIndex: number;
  incrementWordIndex: () => void;
  incrementLineNum: () => void;
  setWordIndex: (newWordIndex: number) => void;
  correctPrefixLen: (typed: string, target: string) => number;
  calculateWPM: (timeInSeconds: number) => number;
};

export default create<SiteInfo>((set, get) => ({
  latestWPM: 0,
  setLatestWPM: (newWPM) => set({ latestWPM: newWPM }),
  startingTime: 30,
  setStartingTime: (newTime) => set({ startingTime: newTime }),
  userTyped: "",
  setUserTyped: (newString) => set({ userTyped: newString }),
  text: "",
  //temporary solution
  textArray: null,
  spacesArray: null,
  setText: (newText) => {
    set({
      text: newText,
      textArray: newText
        .split(/[\n]+/)
        .map((value) => value.trim().split(/[\s]+/)),
      spacesArray: newText.split(/[\n]+/).map((value) => {
        const t = value.match(/[\s]+/);
        if (!t) {
          return 0;
        } else {
          if (t.index! > 0) return 0;
          else return t[0].length;
        }
      }),
    });
  },
  correctPrefixLen: (typed, target): number => {
    const n = Math.min(typed.length, target.length);
    let i = 0;
    while (i < n && typed[i] === target[i]) i++;
    return i;
  },
  calculateWPM: (timeInSeconds) => {
    const line = get().lineNum;
    const wordIndex = get().wordIndex;
    const wordArr = get().textArray;
    const extraWord = get().userTyped;

    if (!wordArr)
      throw new Error(
        "Tried calculating WPM when userStore textArray was empty"
      );

    let count = 0;

    for (let i = 0; i < line; i++) {
      count += wordArr[i].join(" ").length;
      // count += wordArr.length;
    }

    count += wordArr[line].slice(0, wordIndex).join(" ").length;
    count += get().correctPrefixLen(extraWord.trim(), wordArr[line][wordIndex]);
    console.log(count);
    console.log(timeInSeconds);

    return ((count / 5) * 60) / timeInSeconds;
  },
  lineNum: 0,
  setLineNum: (newLineNum) => set({ lineNum: newLineNum }),
  wordIndex: 0,
  setWordIndex: (newWordIndex) => set({ wordIndex: newWordIndex }),
  incrementLineNum: () => set({ lineNum: get().lineNum + 1 }),
  incrementWordIndex: () => set({ wordIndex: get().wordIndex + 1 }),
}));
