import { useState, useRef, useEffect, ReactElement } from "react";
import refreshButton from "../../assets/refresh.png";

export default function TypingSection(): ReactElement {
  const inputRef = useRef<HTMLInputElement>(null);

  let keyPressed: string = "";
  const typeText: string =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

  const textArr: string[] = typeText.split(" ");

  const [word, setWord] = useState<number>(0);
  const [userText, setUserText] = useState("");
  const [textStates, setTextStates] = useState(textArr.map((text) => false));

  useEffect(() => {
    const focusText = () => {
      inputRef.current?.focus();
      console.log("focusing");
    };

    document.addEventListener("keydown", focusText);
    return () => document.removeEventListener("keydown", focusText);
  });
  //console.log(state);

  /**
   * split the entire div into individual spans and words
   * so we want the input to be line by line so when we hit the enter we should clear the entire thing
   *
   * we ideally want it so that each word gets highlighted, thus we have to make it so that
   * the textarea only includes a single word, if the word matches the next word then we can clear
   * so then i would need an array of states, which each span uses to determine whether a word is correct or not
   *
   *
   * ideally you can see the layout like in monkeytype, so ill replicate
   */

  return (
    <>
      <div className="w-[90%] border-black border-2">
        <p className={`bg-none block text-[32px] select-none font-arial`}>
          {textArr.map((text, wordIndex) => (
            <span
              className={`${textStates[wordIndex] ? "text-white" : "text-black"}`}
              key={wordIndex}
            >
              {text.split("").map((character, index) => (
                <span
                  className={`${wordIndex === word && index < userText.length ? (character === userText[index] ? "text-white" : "text-red-700") : ""}`}
                  key={index}
                >
                  {character}
                </span>
              ))}{" "}
            </span>
          ))}
        </p>

        <input
          type="text"
          ref={inputRef}
          autoFocus={true}
          className="text-black block w-full h-52 border-black border-2 pointer-events-none fixed z-[-1]"
          value={userText}
          onChange={(e) => {
            console.log(e.target.value);
            setUserText(e.target.value);

            if (keyPressed === " " && textArr[word] === e.target.value.trim()) {
              console.log("same");
              setTextStates((textStates) =>
                textStates.map((item, index) =>
                  index === word ? true : textStates[index]
                )
              );
              setWord((word) => word + 1);
              setUserText("");
            }
          }}
          onKeyDown={(e) => {
            keyPressed = e.key;
          }}
        />
      </div>
      <button
        onClick={() => {
          setWord(0);
          setUserText("");
          setTextStates(textStates.map((text) => false));
        }}
      >
        <img src={refreshButton} />
      </button>
    </>
  );
}
