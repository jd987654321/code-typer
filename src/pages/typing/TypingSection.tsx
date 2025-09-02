/**
 * ? CUSTOM RENDERING NOTES
 *  Have an array of words, split by spaces, even for things inside brackets
 *  and a single variable to keep track of the word we are at
 *
 * element renderWords to handle the words
 * element renderCurrentWord to handle the current word
 *
 * currentWordIndex
 *
 * render Words will go thru our array of words, if index !== currentWordIndex, greater -> gray, less -> white
 *
 * renderCurrentWord will break down the word into a bunch of divs, match each letter of the typed word to a
 * letter in the word, if the word is severly mismatched, then we can display a little dropdown with the word they've typed
 *
 *
 */

/**
 * ? Future integrations with shiki
 * keep an array of all the colors of every single letters or space, this way we can just color each span for each
 */

/**
 * ? WPM NOTES
 *
 * how tf does our text rendering work here, so textArr holds a true or false for each word
 * i think the word in the input box gets matched to the letters here
 *
 * so in order to calculate the numbers of letters typed correctly, we can grab the words that are true, and
 * then add (num of words -1) spaces, we also include the number of letters correctly typed out in the input text
 *
 * we also need to account for raw wpm as well, since that might be a cool amount
 */

import { useState, useRef, useEffect, ReactElement, useMemo } from "react";
import refreshButton from "../../assets/refresh.png";
import useSidebarStore, {
  problemTypes,
  languages,
  languageOptions,
} from "@/store/sidebarStore";
import useAuthStore from "@/store/authStore";
import useStore from "@/store/userStore";
import parse, { domToReact, Element, DOMNode, Text } from "html-react-parser";
import { useShallow } from "zustand/shallow";
import { supabase } from "@/supabase/supabase";

type Props = {
  ResetTimer: () => void;
  StartTimer: () => void;
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  canType: boolean;
  setCanType: React.Dispatch<React.SetStateAction<boolean>>;
};

type LineElementProps = {
  arrayOfWords: string[];
  spaces: number;
};

export default function TypingSection({
  isActive,
  setIsActive,
  ResetTimer,
  StartTimer,
  canType,
  setCanType,
}: Props): ReactElement {
  const {
    incrementWordIndex,
    incrementLineNum,
    setUserTyped,
    setText,
    setWordIndex,
    setLineNum,
  } = useStore();
  const userTyped = useStore((state) => state.userTyped);
  const spacesArray = useStore((state) => state.spacesArray);
  const wordIndex = useStore((state) => state.wordIndex);
  const lineNum = useStore((state) => state.lineNum);
  const textArray = useStore((state) => state.textArray);

  const style = useSidebarStore((state) => state.style);
  const language = useSidebarStore((state) => state.language);
  const framework = useSidebarStore((state) => state.framework);
  const paradigm = useSidebarStore((state) => state.paradigm);
  const problemType = useSidebarStore((state) => state.problemType);

  const modalOpen = useAuthStore((state) => state.modalOpen);
  const modalOpenRef = useRef(modalOpen);

  const keyPressedRef = useRef("");
  const lineNumRef = useRef(0);
  const wordIndexRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const isActiveRef = useRef<boolean>(isActive);
  const textArrayRef = useRef<string[][] | null>(null);
  const spaceArrayRef = useRef<number[] | null>(null);

  const randIntFrom1toN = (n: number): number =>
    Math.floor(Math.random() * n) + 1;
  const randIntFrom0toN = (n: number): number => {
    //when n is zero, this always returns 1
    if (n == 0) return 0;
    return Math.floor(Math.random() * n + 1);
  };

  useEffect(() => {
    const focusText = () => {
      inputRef.current?.focus();
    };

    const startTimer = () => {
      if (!isActiveRef.current) {
        setIsActive(true);
        StartTimer();
      }
    };

    const handleKeydown = () => {
      if (!modalOpenRef.current) {
        focusText();
        startTimer();
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, []);

  useEffect(() => {
    async function fetchLeetcodeCode() {
      let currentLanguage = language;
      let currentProblemType = problemType;

      if (currentLanguage === "Any") {
        let languageArray = languages.filter((value) => value !== "Any");
        currentLanguage =
          languageArray[randIntFrom0toN(languageArray.length - 1)];
      }
      if (currentProblemType === "Any") {
        let problemTypeArray = problemTypes.filter((value) => value !== "Any");
        currentProblemType =
          problemTypeArray[randIntFrom0toN(problemTypeArray.length - 1)];
      }

      let n = randIntFrom1toN(50);

      const { data, error } = await supabase
        .from("code")
        .select("*")
        .eq("style", "Leetcode")
        .eq("language", currentLanguage.toLowerCase())
        .eq("leetcode_category", currentProblemType)
        .eq("numberID", n);

      if (!data || !data[0])
        throw new Error(
          "Could not fetch any code with the following properties, language: " +
            currentLanguage +
            " category: " +
            currentProblemType +
            " " +
            error
        );

      setText(data[0].code_block);
    }

    async function fetchAppCode() {
      let currentLanguage = language;
      let currentFramework = framework;
      let currentParadigm = paradigm;

      if (currentLanguage === "Any") {
        let languageArray = languages.filter((value) => value !== "Any");
        currentLanguage =
          languageArray[randIntFrom0toN(languageArray.length - 1)];
        currentLanguage = "Go";
      }
      if (currentFramework === "Any") {
        let frameworkArray = Object.keys(
          languageOptions[currentLanguage]
        ).filter((value) => value !== "Any");
        currentFramework =
          frameworkArray[randIntFrom0toN(frameworkArray.length - 1)];
      }
      if (currentParadigm === "Any") {
        let paradigmOptions = languageOptions[currentLanguage][
          currentParadigm
        ].filter((value) => value !== "Any");
        let n = randIntFrom0toN(paradigmOptions.length - 1);
        currentParadigm = paradigmOptions[n];
      }

      let n = randIntFrom1toN(50);

      const { data, error } = await supabase
        .from("code")
        .select("*")
        .eq("style", "App Code")
        .eq("language", currentLanguage.toLowerCase())
        .eq("framework", currentFramework.toLowerCase())
        .eq("paradigm", currentParadigm)
        .eq("numberID", n);

      if (!data || !data[0])
        throw new Error(
          "Could not fetch any code with the following properties, language: " +
            currentLanguage +
            " framework: " +
            currentFramework +
            " paradigm: " +
            currentParadigm
        );

      setText(data[0].code_block);
    }

    if (style === "App Code") {
      fetchAppCode();
    } else if (style === "Leetcode") {
      fetchLeetcodeCode();
    } else {
      const randomNum0or1 = Math.floor(Math.random() * 2);
      if (randomNum0or1 === 1) {
        fetchLeetcodeCode();
      } else {
        fetchAppCode();
      }
    }
  }, [language, framework, paradigm, style]);

  useEffect(() => {
    modalOpenRef.current = modalOpen;
  }, [modalOpen]);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    lineNumRef.current = lineNum;
  }, [lineNum]);

  useEffect(() => {
    textArrayRef.current = textArray;
  }, [textArray]);

  useEffect(() => {
    wordIndexRef.current = wordIndex;
    if (
      textArrayRef.current &&
      wordIndexRef.current >= textArrayRef.current?.[lineNumRef.current].length
    ) {
      setWordIndex(0);
      incrementLineNum();
    }
  }, [wordIndex]);

  const createSpaces = (spaces: number) => {
    return " "
      .repeat(spaces)
      .split("")
      .map((value, index) => (
        <span key={value + index + "extraSpaces"}>{`  `}</span>
      ));
  };

  const RenderCurrentWord = ({
    text,
    userTyped,
  }: {
    text: string;
    userTyped: string;
  }) => {
    let foundIncorrectLetter = false;
    //so we have userText, we match each letter of userText to the currentword
    //our current logic is just tracking the number of correct letters in the incorrect word
    //but now we will be following monkeytypes system which I think makes the most sense
    //we track the entire word, if we are >= userTyped.length then we just default to gray as untyped
    //in the case of userTyped.length > text.length, then we instead render the userTyped word, following
    //the same logic
    //thus we dont be needing to track the correct or incorrect word
    if (userTyped.length > text.length) {
      return (userTyped + " ").split("").map((value, index) => {
        let textColor = "";

        if (index >= text.length) {
          textColor = "text-red-950";
        } else if (userTyped[index] !== text[index]) {
          textColor = "text-red-700";
        } else {
          textColor = "text-white";
        }

        if (index >= text.length) {
          return (
            <span
              key={value + index + "currentWord"}
              className={`${textColor}`}
            >
              {value}
            </span>
          );
        } else {
          return (
            <span
              key={value + index + "currentWord"}
              className={`${textColor}`}
            >
              {text[index]}
            </span>
          );
        }
      });
    } else {
      return (text + " ").split("").map((value, index) => {
        let textColor = "";

        if (index >= userTyped.length) {
          textColor = "text-gray-700";
        } else if (userTyped[index] !== text[index]) {
          textColor = "text-red-700";
        } else {
          textColor = "text-white";
        }

        return (
          <span key={value + index} className={`${textColor}`}>
            {value}
          </span>
        );
      });
    }

    // return (
    //   <span>
    //     {(text + " ").split("").map((value, index) => {
    //       const key = value.toString() + index;
    //       if (foundIncorrectLetter || userTyped[index] !== value) {
    //         foundIncorrectLetter = true;
    //         return (
    //           <span key={key} className="text-gray-700">
    //             {value}
    //           </span>
    //         );
    //       } else {
    //         return (
    //           <span key={key} className="text-white">
    //             {value}
    //           </span>
    //         );
    //       }
    //     })}
    //   </span>
    // );
  };

  const RenderTypedLine = ({ arrayOfWords, spaces }: LineElementProps) => {
    return (
      <div className="whitespace-pre">
        {createSpaces(spaces)}
        {arrayOfWords.map((value, index) => (
          <span
            key={value.toString() + index + "typedLine"}
            className="text-white"
          >{`${value} `}</span>
        ))}
      </div>
    );
  };

  const RenderUntypedLine = ({ arrayOfWords, spaces }: LineElementProps) => {
    return (
      <div className="whitespace-pre">
        {createSpaces(spaces)}
        {arrayOfWords.map((value, index) => (
          <span
            key={value.toString() + index + "untypedLine"}
            className="text-gray-700"
          >{`${value} `}</span>
        ))}
      </div>
    );
  };

  const RenderCurrentLine = ({
    userTyped,
    arrayOfWords,
    spaces,
    currentWordIndex,
  }: LineElementProps & { userTyped: string; currentWordIndex: number }) => {
    return (
      <div className="whitespace-pre">
        {createSpaces(spaces)}
        {arrayOfWords.map((value, index) => {
          const key = value.toString() + index + "currentLine";
          if (index < currentWordIndex) {
            return <span key={key} className="text-white">{`${value} `}</span>;
          } else if (index > currentWordIndex) {
            return (
              <span key={key} className="text-gray-700">{`${value} `}</span>
            );
          } else {
            return (
              <RenderCurrentWord
                key={key}
                text={arrayOfWords[currentWordIndex]}
                userTyped={userTyped}
              />
            );
          }
        })}
      </div>
    );
  };

  //we could do two things to show incorrect text, either expand the text with extra words
  //

  const RenderText = ({
    formattedTextArray,
    lineNum,
    wordIndex,
    spacesArray,
  }: {
    formattedTextArray: string[][] | null;
    lineNum: number;
    wordIndex: number;
    spacesArray: number[] | null;
  }) => {
    return (
      <div className="w-[700px overflow-hidden">
        <div
          style={{
            //40 comes from space between and span height, 24 and 16 respectively
            transform: `translateY(-${(24 + 0) * lineNum}px)`,
          }}
          className="transition-transform duration-300"
        >
          {!formattedTextArray || !spacesArray ? (
            <div>Loading...</div>
          ) : (
            formattedTextArray.map((value, index) => {
              const key = value.toString() + index;
              if (index > lineNum) {
                return (
                  <RenderUntypedLine
                    key={key}
                    arrayOfWords={value}
                    spaces={spacesArray[index]}
                  />
                );
              } else if (index < lineNum) {
                return (
                  <RenderTypedLine
                    key={key}
                    arrayOfWords={value}
                    spaces={spacesArray[index]}
                  />
                );
              } else {
                return (
                  <RenderCurrentLine
                    key={key}
                    arrayOfWords={value}
                    spaces={spacesArray[index]}
                    currentWordIndex={wordIndex}
                    userTyped={userTyped}
                  />
                );
              }
            })
          )}
        </div>
      </div>
    );
  };

  /* 
  in order to shift the text upward, we can just offset by a specific amount each time, we can just
  find the constant amount that it shifts up by and update it each time

  */

  return (
    <>
      <div className="w-[90%] text-white bg-none font-vscodeText">
        <RenderText
          formattedTextArray={textArray}
          lineNum={lineNum}
          wordIndex={wordIndex}
          spacesArray={spacesArray}
        />
        <input
          maxLength={100}
          type="text"
          ref={inputRef}
          autoFocus={true}
          className="text-black block w-full h-52 border-black border-2 pointer-events-none fixed z-[-1]"
          value={userTyped}
          onChange={(e) => {
            if (canType) {
              setUserTyped(e.target.value);
              if (
                userTyped.trim() ===
                  textArray?.[lineNumRef.current][wordIndexRef.current] &&
                keyPressedRef.current === " "
              ) {
                incrementWordIndex();
                setUserTyped("");
              }
            }
          }}
          onKeyDown={(e) => {
            keyPressedRef.current = e.key;
          }}
        />
      </div>
      <button
        onClick={() => {
          ResetTimer();
          setCanType(true);
          setWordIndex(0);
          setLineNum(0);
          lineNumRef.current = 0;
          setUserTyped("");
        }}
      >
        <img src={refreshButton} />
      </button>
    </>
  );
}
