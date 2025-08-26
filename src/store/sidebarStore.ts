import { create } from "zustand";
import { persist } from "zustand/middleware";

export const languages: string[] = [
  "Java",
  "Python",
  "Rust",
  "C++",
  "Go",
  "Typescript",
  "Javascript",
  "Any",
] as const;

export const styles: string[] = ["App Code", "Leetcode", "Any"];

//depracated, just not sure if removing it would break my code
const frameworks: Record<Languages, string[]> = {
  Java: ["Spring Boot", "Hibernate", "Jakarta EE", "None"],
  Python: ["Django", "Flask", "FastAPI", "None"],
  Rust: ["Actix Web", "Rocket", "Bevy", "Tauri", "None"],
  "C++": ["Qt", "Boost", "Unreal Engine", "None"],
  Go: ["Gin", "Fiber", "Echo", "Beego", "None"],
  Typescript: ["React", "Vue", "Angular", "None"],
  Javascript: ["React", "Vue", "Express.js", "None"],
  Any: ["Any"],
} as const;

export const languageOptions: Record<Languages, Record<string, Paradigms[]>> = {
  Java: {
    Any: ["Any", "Object-Oriented", "Functional"],
    None: ["Any", "Object-Oriented", "Functional"],
    "Spring Boot": ["Any", "Object-Oriented", "Functional"],
    Hibernate: ["Object-Oriented"],
    "Jakarta EE": ["Any", "Object-Oriented", "Functional"],
  },
  Python: {
    Any: ["Any", "Object-Oriented", "Functional"],
    None: ["Any", "Object-Oriented", "Functional"],
    Django: ["Any", "Object-Oriented", "Functional"],
    Flask: ["Any", "Object-Oriented", "Functional"],
    FastAPI: ["Any", "Object-Oriented", "Functional"],
  },
  Rust: {
    Any: ["Any", "Object-Oriented", "Functional"],
    None: ["Any", "Object-Oriented", "Functional"],
    "Actix Web": ["Any", "Object-Oriented", "Functional"],
    Rocket: ["Any", "Object-Oriented", "Functional"],
    Bevy: ["Functional"],
    Tauri: ["Any", "Object-Oriented", "Functional"],
  },
  "C++": {
    Qt: ["Object-Oriented"],
    Boost: ["Any", "Object-Oriented", "Functional"],
    "Unreal Engine": ["Any", "Object-Oriented"],
    None: ["Any", "Object-Oriented", "Functional"],
    Any: ["Any", "Object-Oriented", "Functional"],
  },
  Go: {
    Gin: ["Any", "Functional"],
    Fiber: ["Any", "Functional"],
    Echo: ["Any", "Functional"],
    None: ["Any", "Functional"],
    Any: ["Any", "Functional"],
  },
  Typescript: {
    React: ["Any", "Object-Oriented", "Functional"],
    Vue: ["Object-Oriented"],
    Angular: ["Object-Oriented"],
    None: ["Any", "Object-Oriented", "Functional"],
    Any: ["Any", "Object-Oriented", "Functional"],
  },
  Javascript: {
    React: ["Any", "Object-Oriented", "Functional"],
    Vue: ["Object-Oriented"],
    "Express.js": ["Functional"],
    None: ["Any", "Object-Oriented", "Functional"],
    Any: ["Any", "Object-Oriented", "Functional"],
  },
  Any: {
    None: ["Any", "Object-Oriented", "Functional"],
    Any: ["Any", "Object-Oriented", "Functional"],
  },
};

const paradigms: string[] = ["Object-Oriented", "Functional", "Any"] as const;
const yesOrNo: string[] = ["Yes", "No"] as const;
const problemTypes: string[] = [
  "Any",
  "Two Pointers",
  "Stack",
  "Queue",
  "Tree",
  "Graph",
  "Heap",
  "Bits",
  "DP",
] as const;

export const options = {
  languages,
  styles,
  frameworks,
  paradigms,
  yesOrNo,
  problemTypes,
};

export type Languages = (typeof languages)[number];
export type Styles = (typeof styles)[number];
export type YesOrNo = (typeof yesOrNo)[number];
export type ProblemTypes = (typeof problemTypes)[number];
export type Paradigms = (typeof paradigms)[number];
export type LanguageOptions = Record<Languages, Record<string, Paradigms[]>>;

type SideBarInfo = {
  language: Languages;
  languageOptions: Record<Languages, Record<string, Paradigms[]>>;
  style: Styles;
  framework: string;
  paradigm: Paradigms;
  includeImports: YesOrNo;
  includeFunctionDefinition: YesOrNo;
  problemType: ProblemTypes;
  setLanguage: (language: Languages) => void;
  setStyle: (style: Styles) => void;
  setFramework: (framework: string) => void;
  setParadigm: (paradigm: Paradigms) => void;
  setIncludeImports: (includeImports: YesOrNo) => void;
  setIncludeFunctionDefinition: (includeFunctionDefinition: YesOrNo) => void;
  setProblemType: (problemType: ProblemTypes) => void;
};

export default create<SideBarInfo>()(
  persist(
    (set) => ({
      language: "Any",
      languageOptions: languageOptions,
      style: "Any",
      framework: "Any",
      paradigm: "Any",
      includeImports: "No",
      includeFunctionDefinition: "No",
      problemType: "Any",
      setLanguage: (language) => set({ language: language }),
      setStyle: (style) => set({ style: style }),
      setFramework: (framework) => set({ framework: framework }),
      setParadigm: (paradigm) => set({ paradigm: paradigm }),
      setIncludeImports: (includeImports) =>
        set({ includeImports: includeImports }),
      setIncludeFunctionDefinition: (includeFunctionDefinition) =>
        set({ includeFunctionDefinition: includeFunctionDefinition }),
      setProblemType: (problemType) => set({ problemType: problemType }),
    }),
    {
      name: "sidebar-settings",
      partialize: (state) => ({
        language: state.language,
        style: state.style,
        framework: state.framework,
        paradigm: state.paradigm,
        includeImports: state.includeImports,
        includeFunctionDefinition: state.includeFunctionDefinition,
        problemType: state.problemType,
      }),
    }
  )
);
