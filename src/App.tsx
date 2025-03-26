import { useState, ReactElement } from "react";
import { Button } from "./components/ui/button";
import "./index.css";

function App(): ReactElement {
  type textStatus = "grey" | "green" | "red";

  const typeText =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

  const textArr = typeText.split(" ");

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
    <div className="bg-white h-screen flex flex-col items-center justify-center">
      <p
        className={`${textColor === "red" ? "bg-red-500" : "bg-gray-500"} block `}
      >
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
          console.clear();
          console.log(textStates);
          console.log("textArr[word]: " + textArr[word]);
          console.log("e.target.value: " + e.target.value);

          validateText(e.target.value);

          setUserText(e.target.value);

          console.log(word);
          if (textArr[word] === e.target.value) {
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
          if (e.key === "Enter") {
            console.log("entered");
          }
        }}
      />
    </div>
  );
}

export default App;
