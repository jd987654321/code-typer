import { create } from "zustand";
import { persist } from "zustand/middleware";

const languages: string[] = [
  "Java",
  "Python",
  "Rust",
  "C++",
  "Go",
  "Typescript",
  "Javascript",
  "Any",
] as const;

const styles: string[] = ["App Code", "Leetcode", "Any"];

const frameworks: Record<Languages, string[]> = {
  Java: ["Spring Boot", "Hibernate", "Jakarta EE", "None"],
  Python: ["Django", "Flask", "FastAPI", "None"],
  Rust: ["Actix Web", "Rocket", "Bevy", "Tauri", "None"],
  "C++": ["Qt", "Boost", "Unreal Engine", "None"],
  Go: ["Gin", "Fiber", "Echo", "Beego", "None"],
  Typescript: ["Next.js", "Angular", "NestJS", "Remix", "None"],
  Javascript: ["React", "Vue.js", "Next.js", "Express.js", "None"],
  Any: ["Any"],
} as const;

const paradigms: string[] = ["Object-Oriented", "Functional", "Both"] as const;
const yesOrNo: string[] = ["Yes", "No"] as const;
const problemTypes: string[] = [
  "Any",
  "Two Pointers",
  "Sliding Window",
  "Hash Table",
  "Stack",
  "Queue",
  "Linked List",
  "Tree",
  "Graph",
  "Heap",
  "Math",
  "Greedy",
  "Sorting",
  "Bit Manipulation",
  "Dynamic Programming",
  "Backtracking",
  "Prefix Sum",
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

type SideBarInfo = {
  language: Languages;
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
    { name: "sidebar-settings" }
  )
);
