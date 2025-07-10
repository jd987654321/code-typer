/**
 * ? CUSTOM RENDERING NOTES
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

/**
 * ? INTEGRATING SHIKI WITH OUR CUSTOM RENDERING NOTES
 *
 * so shiki creates the html blocks that we then insert, we can also try custom rendering where we render it ourselves
 * I think we grab what we need from shiki, but manually render the last word, maybe split the text string into two
 * the one with highlighting, and the stuff without highlighting, we are pretty much rerendering a majority of the text each time someone types anything
 *  if this is too slow then we can optimize by choosing what part of the text we render
 *
 * so we use the bitty value to keep track of which word we are at, if we are currently larger then the word variable
 * we can stick with space checking if the word is the same value, but we can also just check
 * each time we type if the word is the same, but then, the tricky part is how do we differentiate?
 *We can have a seperate array which dictates whether or not a space is needed to get to the next part, 
 custom function which goes thru the text string and finds the corresponding word, and looks at the
 punctuation afterwards.
 */

import { useState, useRef, useEffect, ReactElement, useMemo } from "react";
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
    'import { ReactElement } from "react";\n\ntype Props = {\n  recordedSpeed: boolean[];\n};\n\nexport default function FinishedSection({\n  recordedSpeed,\n}: Props): ReactElement {\n  console.log(recordedSpeed);\n  const [hok, setHok] = useState<number>(0);\n  return (\n    <div>\n      <p>Nice job ur done now :D</p>\n      <p>Result: {recordedSpeed.filter(Boolean).length} WPM</p>\n    </div>\n  );\n}\n';
  //import goes from index 0 to 5 import.length is 6 so from the current index we would need to go word.length-1
  //if i is the index of the first letter of our word, then we are looking at index i+word.length
  //but first we should do a while loop to match the first letter

  //const textArr: string[] = typeText.split(" ");
  const textArr: string[] = typeText.split(/[\n\s]+/);
  //console.log(textArr);

  const [word, setWord] = useState<number>(10);
  const [userText, setUserText] = useState("");

  const [testShiki, setTextShiki] = useState<string>("");
  //const [textStates, setTextStates] = useState(textArr.map((text) => false));
  let hlText = highlighter.codeToHtml(typeText3, {
    theme: "dark-plus",
    lang: "jsx",
  });

  //console.log(hlText);

  const textArr2: string[] = useMemo(() => {
    let arr: string[] = [];
    /**
     * ? What this parse function is doing
     * an html element such as <div>some text</div> actually counts as two nodes, since the text
     * is actually a text node, and this text node counts as a child node of the <div></div> node
     * So when checking the number of children each non-nested node should have, its's actually one, not zero
     * Non-nested nodes also are spans and have styling, this excludes the first <pre> element which has styling
     * and it also excludes the span containers that dont have any styling
     */
    parse(hlText, {
      replace: (node) => {
        if (
          node instanceof Element &&
          node.attribs &&
          node.children?.length === 1 &&
          node.name === "span" &&
          node.attribs?.style
        ) {
          //console.log(node.name);
          let text: string[] = getTextFromNode(node).trim().split(/\s+/);
          text.forEach((item) => arr.push(item));
          //arr.push(getTextFromNode(node));
          return node;
        }
      },
    });
    return arr;
  }, []);

  let afterResults: string[] = [];

  let p: number = 0;
  for (const word of textArr2) {
    while (word[0] !== typeText3[p]) {
      p++;
    }
    if (typeText3[p + word.length] === " ") {
      afterResults.push("space");
    } else if (typeText3[p + word.length] === "\n") {
      afterResults.push("newline");
    } else {
      afterResults.push("something");
    }
  }

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

  let bitty = 0;

  const replace = (node: DOMNode, index: number) => {
    if (node instanceof Element && node.attribs) {
      //console.log(getTextFromNode(node) + node.children?.length);
      const n = node.attribs?.style;
      if (node.name === "pre") {
        return (
          <pre style={{ backgroundColor: "" }}>
            {domToReact(node.children as DOMNode[], { replace })}
          </pre>
        );
      }

      //? node is an html element, x extracts the exact # rgb hexcode value from the element
      //there is only one hexcode thus, we use x[0] down below in the code

      const x = n ? n.match(/#([0-9a-fA-F]{6})\b/) : null;
      if (node.children?.length === 1 && node.name === "span" && x != null) {
        const splitt = getTextFromNode(node).match(/ *\S+ */g) || [];
        return (
          <>
            {splitt.map((item, index) => {
              bitty++;
              let isGray: boolean = bitty >= word;

              //if bitty is equal to word, then we split up the letters in the word,
              //the way we've split everything up, each thing should be by itself or will have spaces
              //so we can split it into space, word, space
              //then
              return (
                <span
                  key={item + index}
                  style={{ color: isGray ? "#333333" : x[0] }}
                >
                  {/* item is a string */}
                  {bitty === word
                    ? item.match(/(\s+|[^\s]+)/g)?.map((thing, index) => {
                        if (!/^\s*$/.test(thing)) {
                          return (
                            <>
                              {thing.split("").map((thang, index) => {
                                if (userText[index] === thang) {
                                  return (
                                    <span style={{ color: "#FFFFFF" }}>
                                      {thang}
                                    </span>
                                  );
                                }
                                return (
                                  <span style={{ color: "#333333" }}>
                                    {thang}
                                  </span>
                                );
                              })}
                            </>
                          );
                        }
                        return <span>{thing}</span>;
                      })
                    : item}
                </span>
              );
            })}
          </>
        );
      }

      return node;
    }
  };

  //so maybe we make our text array from these elements instead?
  const rep = parse(hlText, {
    replace: replace,
  });

  //console.log(typeText3);
  // console.log(textArr2.length);
  // console.log(afterResults.length);
  //console.log(hlText);

  console.log(textArr2);
  //console.log(word);

  return (
    <>
      <div className="w-[90%] text-white bg-none">
        <button onClick={() => setWord((val) => val + 1)}>+1</button>
        <button onClick={() => setWord((val) => val - 1)}>-1</button>
        <div>{userText}</div>
        {/* <div
          className="text-sm font-vscodeTitle"
          dangerouslySetInnerHTML={{ __html: testShiki }}
        ></div> */}
        <div className="text-green-700">{rep}</div>
        <div className="bg-none">{parse(testShiki)}</div>
        <p className={`bg-none block text-[32px] select-none font-arial`}>
          {/* textArr is the string[] holding all the actual words, textState is the boolean[] telling us if 
          each of the words have been correctly typed out */}
        </p>

        <div>{userText}</div>

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

              //* New Notes with shiki highlighting
              // For now I think everytime we type, shiki should redo everything,
              //so if word index matches the bitty variable (what we use to keep track of the word count in the code snippet)
              //then we will match the number of words to it

              //! Old Notes
              //everytime space is clicked, we check if the current word in this input element is the same
              //as the word we are at in the textArr as index word (the index variable is literally "word")
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

// {
//   textArr.map((text, wordIndex) => (
//     <span
//       className={`${textStates[wordIndex] ? "text-white" : "text-black"}`}
//       key={wordIndex}
//     >
//       {text.split("").map((character, index) => (
//         <span
//           className={`${wordIndex === word && index < userText.length ? (character === userText[index] ? "text-white" : "text-red-700") : ""}`}
//           key={index}
//         >
//           {character}
//         </span>
//       ))}{" "}
//     </span>
//   ));
// }
