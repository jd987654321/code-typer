import { useState, ReactElement } from "react";
import { Button } from "./components/ui/button";
import "./index.css";

function App(): ReactElement {
  type textStatus = "grey" | "green" | "red";

  let keyPressed: string = "";
  const typeText: string =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

  const textArr: string[] = typeText.split(" ");

  const [word, setWord] = useState<number>(0);
  const [textColor, setTextColor] = useState<textStatus>("grey");
  const [userText, setUserText] = useState("");
  const [textStates, setTextStates] = useState(textArr.map((text) => false));

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

  let validateText = (userText: string) => {
    //console.clear();
    let len: number = userText.length;
    let piece: string = typeText.slice(0, len);
    //console.log("userText " + userText);
    //console.log("slice" + piece.length + JSON.stringify(piece));
    if (piece === userText) setTextColor("grey");
    else {
      //console.log("type");
      setTextColor("red");
    }
  };

  return (
    <div className="bg-gray-400 h-screen flex flex-col items-center justify-center">
      <div className="w-[90%]">
        <p className={`bg-none block `}>
          {textArr.map((text, index) => (
            <span
              className={`${textStates[index] ? "text-white" : "text-black"}`}
              key={index}
            >
              {text + " "}
            </span>
          ))}
        </p>

        <textarea
          className="text-black block w-full h-52 border-black border-2"
          rows={1}
          value={userText}
          onChange={(e) => {
            //console.log(e.target.value.length);

            //console.log(textStates);
            //console.log("textArr[word]: " + textArr[word]);
            //console.log("e.target.value: " + e.target.value);

            setUserText(e.target.value);
            //console.log(keyPressed);
            //console.log(JSON.stringify(e.target.value));
            //console.log(JSON.stringify(e.target.value.trim()));
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
            console.log(word);
          }}
          onKeyDown={(e) => {
            keyPressed = e.key;
            if (e.key === "Enter") {
              console.log("entered");
            }
            if (e.key === "Space") {
            }
          }}
        />
      </div>
    </div>
  );
}

export default App;
