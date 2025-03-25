import { useState, ReactElement } from "react";
import { Button } from "./components/ui/button";
import "./index.css";

function App(): ReactElement {
  type textStatus = "grey" | "green" | "red";

  const [textColor, setTextColor] = useState<textStatus>("grey");
  const [userText, setUserText] = useState("");

  const typeText =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

  const textArr = typeText.split(" ");

  let validateText = (userText: string) => {
    console.clear();
    let len: number = userText.length;
    let piece: string = typeText.slice(0, len);
    console.log("userText " + userText);
    console.log("slice" + piece.length + JSON.stringify(piece));
    if (piece === userText) setTextColor("grey");
    else {
      console.log("type");
      setTextColor("red");
    }
  };

  return (
    <div className="bg-white h-screen flex flex-col items-center justify-center">
      <p
        className={`${textColor === "red" ? "bg-red-500" : "bg-gray-700"} block`}
      >
        {typeText}
      </p>

      <textarea
        className="text-black block w-full h-52 border-black border-2"
        value={userText}
        onChange={(e) => {
          console.log(e.target.value.length);
          validateText(e.target.value);

          setUserText(e.target.value);
        }}
      />
    </div>
  );
}

export default App;
