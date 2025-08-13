import cppLogo from "@/assets/languageIcons/cpp.svg";
import javaLogo from "@/assets/languageIcons/java.svg";
import javascriptLogo from "@/assets/languageIcons/javascript.svg";
import goLogo from "@/assets/languageIcons/go.svg";
import pythonLogo from "@/assets/languageIcons/python.svg";
import reactLogo from "@/assets/languageIcons/react.svg";
import rustLogo from "@/assets/languageIcons/rust.svg";
import typescriptLogo from "@/assets/languageIcons/typescript.svg";
import vueLogo from "@/assets/languageIcons/vue.svg";
import React from "react";

type LanguageNames =
  | "cpp"
  | "java"
  | "javascript"
  | "typescript"
  | "go"
  | "python"
  | "react"
  | "rust"
  | "vue";

type LogoProps = {
  name: LanguageNames;
  size: number;
};

export default function LogoElement({
  name,
  size,
}: LogoProps): React.ReactElement {
  const IconMap = {
    cpp: cppLogo,
    java: javaLogo,
    javascript: javascriptLogo,
    typescript: typescriptLogo,
    go: goLogo,
    python: pythonLogo,
    react: reactLogo,
    rust: rustLogo,
    vue: vueLogo,
  };

  return (
    <img
      src={IconMap[name]}
      alt={`${name} logo`}
      className={`h-[${size}px] w-[${size}px]`}
    />
  );
}
