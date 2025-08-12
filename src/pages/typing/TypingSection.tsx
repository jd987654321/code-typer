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
import useStore from "@/store/userStore";
import parse, { domToReact, Element, DOMNode, Text } from "html-react-parser";
import { create } from "domain";
import { useShallow } from "zustand/shallow";

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
    userTyped,
    setUserTyped,
    spacesArray,
    wordIndex,
    setText,
    setWordIndex,
    lineNum,
    setLineNum,
    textArray,
  } = useStore(
    useShallow((state) => ({
      incrementWordIndex: state.incrementWordIndex,
      incrementLineNum: state.incrementLineNum,
      userTyped: state.userTyped,
      setUserTyped: state.setUserTyped,
      spacesArray: state.spacesArray,
      wordIndex: state.wordIndex,
      setText: state.setText,
      setWordIndex: state.setWordIndex,
      lineNum: state.lineNum,
      setLineNum: state.setLineNum,
      textArray: state.textArray,
    }))
  );

  const lineNumRef = useRef(0);
  const wordIndexRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const isActiveRef = useRef<boolean>(isActive);
  const textArrayRef = useRef<string[][] | null>(null);
  const spaceArrayRef = useRef<number[] | null>(null);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    const focusText = () => {
      inputRef.current?.focus();
    };

    const startTimer = () => {
      if (!isActiveRef.current) {
        // console.log("this is running");
        // console.log("isActive: " + isActive);
        setIsActive(true);
        StartTimer();
      }
    };

    const handleKeydown = () => {
      focusText();
      startTimer();
    };

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, []);

  useEffect(() => {
    setText(
      'import { ReactElement } from "react";\ntype Props = {\n  recordedSpeed: boolean[];\n};\nexport default function FinishedSection({\n  recordedSpeed,\n}: Props): ReactElement {\n  console.log(recordedSpeed);\n  const [hok, setHok] = useState<number>(0);\n  return (\n    <div>\n      <p>Nice job ur done now :D</p>\n      <p>Result: {recordedSpeed.filter(Boolean).length} WPM</p>\n    </div>\n  );\n}\n'
    );
  }, []);

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
      .map((value, index) => <span key={value + index}>{`  `}</span>);
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
    return (
      <span>
        {(text + " ").split("").map((value, index) => {
          const key = value.toString() + index;
          if (foundIncorrectLetter || userTyped[index] !== value) {
            foundIncorrectLetter = true;
            return (
              <span key={key} className="text-gray-700">
                {value}
              </span>
            );
          } else {
            return (
              <span key={key} className="text-white">
                {value}
              </span>
            );
          }
        })}
      </span>
    );
  };

  const RenderTypedLine = ({ arrayOfWords, spaces }: LineElementProps) => {
    return (
      <div className="whitespace-pre">
        {createSpaces(spaces)}
        {arrayOfWords.map((value) => (
          <span
            key={value.toString()}
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
        {arrayOfWords.map((value) => (
          <span
            key={value.toString()}
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
          const key = value.toString() + index;
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
      <div>
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
    );
  };

  return (
    <>
      <div className="w-[90%] text-white bg-none">
        {/* <button onClick={() => setWordIndex((val) => val + 1)}>+1</button>
        <button onClick={() => setWordIndex((val) => val - 1)}>-1</button> */}
        {/* <div
          className="text-sm font-vscodeTitle"
          dangerouslySetInnerHTML={{ __html: testShiki }}
        ></div> */}
        <p className={`bg-none block text-[32px] select-none font-arial`}>
          {/* textArr is the string[] holding all the actual words, textState is the boolean[] telling us if 
          each of the words have been correctly typed out */}
        </p>
        <div>{userTyped}</div>

        <RenderText
          formattedTextArray={textArray}
          lineNum={lineNum}
          wordIndex={wordIndex}
          spacesArray={spacesArray}
        />
        <input
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
                textArray?.[lineNumRef.current][wordIndexRef.current]
              ) {
                incrementWordIndex();
                setUserTyped("");
              }
            }
            console.log("");
            console.log(textArrayRef.current?.[lineNumRef.current]);
            console.log(
              textArrayRef.current?.[lineNumRef.current][wordIndexRef.current]
            );
            console.log("line number " + lineNumRef.current);
            console.log("word index" + wordIndexRef.current);
            console.log(textArray?.[lineNumRef.current].length);
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
