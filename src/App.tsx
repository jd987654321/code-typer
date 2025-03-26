import { useState, ReactElement } from "react";
import { Button } from "./components/ui/button";
import TypingSection from "./TypingSection";
import "./index.css";

export default function App(): ReactElement {
  return (
    <div className="bg-gray-400 h-screen flex flex-col items-center justify-center">
      <TypingSection></TypingSection>
    </div>
  );
}
