/**
 * CUSTOM RENDERING NOTES
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

/**
 * WPM NOTES
 *
 * how tf does our text rendering work here, so textArr holds a true or false for each word
 * i think the word in the input box gets matched to the letters here
 *
 * so in order to calculate the numbers of letters typed correctly, we can grab the words that are true, and
 * then add (num of words -1) spaces, we also include the number of letters correctly typed out in the input text
 *
 * we also need to account for raw wpm as well, since that might be a cool amount
 */

/**
 * INTEGRATING SHIKI WITH OUR CUSTOM RENDERING NOTES
 *
 * so shiki creates the html blocks that we then insert, we can also try custom rendering where we render it ourselves
 * I think we grab what we need from shiki, but manually render the last word, maybe split the text string into two
 * the one with highlighting, and the stuff without highlighting, we are pretty much rerendering a majority of the text each time someone types anything
 *if this is too slow then we can optimize by choosing what part of the text we render
 */

import { useState, useRef, useEffect, ReactElement } from "react";
import refreshButton from "../../assets/refresh.png";
import highlighter from "@/lib/highlighter";
import parse, { domToReact, Element, DOMNode, Text } from "html-react-parser";
import { create } from "domain";

type Props = {
  ResetTimer: () => void;
  StartTimer: () => void;
  isActive: boolean;
  canType: boolean;
  setCanType: React.Dispatch<React.SetStateAction<boolean>>;
  textStates: boolean[];
  setTextStates: React.Dispatch<React.SetStateAction<boolean[]>>;
};

export default function TypingSection({
  isActive,
  ResetTimer,
  StartTimer,
  canType,
  setCanType,
  textStates,
  setTextStates,
}: Props): ReactElement {
  const inputRef = useRef<HTMLInputElement>(null);
  const highlightDiv = useRef<TrustedHTML>(null);

  let keyPressed: string = "";
  const typeText2: string =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
  const typeText: string = "int x = 7;\nfor(int i = 0 ; i < x ; i++){";

  const typeText3: string =
    'import { ReactElement } from "react";\n\ntype Props = {\n  recordedSpeed: boolean[];\n};\n\nexport default function FinishedSection({\n  recordedSpeed,\n}: Props): ReactElement {\n  console.log(recordedSpeed);\n  return (\n    <div>\n      <p>Nice job ur done now :D</p>\n      <p>Result: {recordedSpeed.filter(Boolean).length} WPM</p>\n    </div>\n  );\n}\n';

  //const textArr: string[] = typeText.split(" ");
  const textArr: string[] = typeText.split(/[\n\s]+/);
  //console.log(textArr);

  const [word, setWord] = useState<number>(0);
  const [userText, setUserText] = useState("");

  const [testShiki, setTextShiki] = useState<string>("");
  //const [textStates, setTextStates] = useState(textArr.map((text) => false));

  useEffect(() => {
    //we are going to make a string, then assign it to a variable or hook
    // let lightedText = highlighter.codeToHtml(typeText3, {
    //   theme: "dark-plus",
    //   lang: "jsx",
    // });
    // setTextShiki(lightedText);
    // setTextStates(textArr.map((text) => false));
  }, []);

  // console.log("user text is: " + userText);
  // console.log("text states is: " + textStates);

  useEffect(() => {
    const focusText = () => {
      inputRef.current?.focus();
      //console.log("focusing");
    };

    const startTimer = () => {
      if (!isActive) {
        StartTimer();
      }
    };

    document.addEventListener("keydown", focusText);
    document.addEventListener("keydown", startTimer);
    return () => document.removeEventListener("keydown", focusText);
  });

  //typing page needs to be restructured or we can just pass in a bunch of diff props, either one works

  const calculateWPM = (
    boolArr: boolean[],
    wordArr: string[],
    extraWord: string,
    timeInSeconds: number
  ): number => {
    //we going by the fact that for each word, there should be a space next to it
    const spaces: number = boolArr.filter(Boolean).length;
    let count: number = spaces + extraWord.length;

    for (let i = 0; i < spaces; i++) {
      count += wordArr[i].length;
    }

    return count / 5 / timeInSeconds;
  };

  const somehtml = `
    <div class="thing">Div 1</div><div>Div 2</div><div>Div 3</div>
  `;

  // let bitty = 0;

  // const rep = parse(somehtml, {
  //   replace: (node: DOMNode, index) => {
  //     if (node instanceof Element && node.attribs) {
  //       console.log(textArr[bitty] + " " + index);
  //       bitty++;
  //       //console.log(node + "  " + index);
  //       //console.log(node.attribs.class);
  //       const t = node as Element;
  //       //console.log("children " + t.children);
  //       return <div>{domToReact(t.children as DOMNode[])}</div>;
  //     }
  //   },
  // });
  let hlText = highlighter.codeToHtml(typeText3, {
    theme: "dark-plus",
    lang: "jsx",
  });

  function getTextFromNode(node: DOMNode): string {
    if (node.type === "text") {
      return (node as Text).data;
    }

    if (node.type === "tag" && (node as Element).children) {
      return (node as Element).children
        .map((item) => getTextFromNode(item as DOMNode))
        .join("");
    }

    return "";
  }

  const rep = parse(hlText, {
    replace: (node, index) => {
      if (node instanceof Element && node.attribs) {
        //console.log(getTextFromNode(node) + node.children?.length);
        if (node.children?.length === 1 && node.name === "span") {
          console.log(getTextFromNode(node));
        }
        return node;
      }
    },
  });

  //console.log(rep);

  //console.log(state);

  return (
    <>
      <div className="w-[90%]  bg-none">
        {/* <div
          className="text-sm font-vscodeTitle"
          dangerouslySetInnerHTML={{ __html: testShiki }}
        ></div> */}
        <div className="text-green-700">{rep}</div>
        <div className="bg-none">{parse(testShiki)}</div>
        <p className={`bg-none block text-[32px] select-none font-arial`}>
          {/* textArr is the string[] holding all the actual words, textState is the boolean[] telling us if 
          each of the words have been correctly typed out */}
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
            if (canType) {
              //console.log(e.target.value);
              setUserText(e.target.value);

              //everytime space is clicked, we check if the current word in this input element is the same
              //as the word we are at in the textArr as index word (the index variable is literally "word")
              if (
                keyPressed === " " &&
                textArr[word] === e.target.value.trim()
              ) {
                //console.log("same");
                setTextStates((textStates) =>
                  textStates.map((item, index) =>
                    index === word ? true : textStates[index]
                  )
                );
                setWord((word) => word + 1);
                setUserText("");
              }
            }
          }}
          onKeyDown={(e) => {
            keyPressed = e.key;
          }}
        />
      </div>
      <button
        onClick={() => {
          ResetTimer();

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
