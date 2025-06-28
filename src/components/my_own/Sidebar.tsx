import { ReactElement, useState } from "react";
import { menu, menuOpener } from "@/assets/menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DropdownButton } from "./DropdownButton";

export default function Sidebar(): ReactElement {
  //open the big menu if something is clicked
  //otherwise do a small one
  const languages: string[] = [
    "Java",
    "Python",
    "Rust",
    "C++",
    "Go",
    "Typescript",
    "Javascript",
    "Any",
  ];
  const styles: string[] = ["App Code", "Algorithmic", "Any"];
  const frameworks: Record<Languages, string[]> = {
    Java: ["Spring Boot", "Hibernate", "Jakarta EE", "None"],
    Python: ["Django", "Flask", "FastAPI", "None"],
    Rust: ["Actix Web", "Rocket", "Bevy", "Tauri", "None"],
    "C++": ["Qt", "Boost", "Unreal Engine", "None"],
    Go: ["Gin", "Fiber", "Echo", "Beego", "None"],
    Typescript: ["Next.js", "Angular", "NestJS", "Remix", "None"],
    Javascript: ["React", "Vue.js", "Next.js", "Express.js", "None"],
    Any: ["Any"],
  };
  const paradigms: string[] = ["Object-Oriented", "Functional", "Both"];
  const yesOrNo: string[] = ["Yes", "No"];
  const problemTypes = [
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
  ];

  type Languages = (typeof languages)[number];
  type Styles = (typeof styles)[number];
  type Paradigms = (typeof paradigms)[number];
  type YesOrNo = (typeof yesOrNo)[number];
  type ProblemTypes = (typeof problemTypes)[number];

  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [time, setTime] = useState<number>(15);
  const [language, setLanguage] = useState<Languages>("Any");
  const [style, setStyle] = useState<Styles>("App Code");
  const [framework, setFramework] = useState<string>("Any");
  const [paradigm, setParadigm] = useState<Paradigms>("Both");
  const [includeImports, setIncludeImports] = useState<YesOrNo>("No");
  const [includeFunctionDefinition, setIncludeFunctionDefinition] =
    useState<YesOrNo>("Yes");
  const [problemType, setProblemType] = useState<ProblemTypes>("Any");

  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [timeOpen, setTimeOpen] = useState<boolean>(false);
  const [langOpen, setLangOpen] = useState<boolean>(false);
  const [styleOpen, setStyleOpen] = useState<boolean>(false);
  const [frameworkOpen, setFrameworkOpen] = useState<boolean>(false);
  const [paradigmOpen, setParadigmOpen] = useState<boolean>(false);
  const [importsOpen, setImportsOpen] = useState<boolean>(false);
  const [functionOpen, setFunctionOpen] = useState<boolean>(false);
  const [problemTypeOpen, setProblemTypeOpen] = useState<boolean>(false);
  //so what is happened, the entire thing is getting rerender and so the thing probably gets ticked off
  //the entire component gets rerendered and then set to false by default

  //then state of the sidebar being opened and closed should then be seperated from button clicking
  //can i wrap another element around everything, so that clicking the buttons doesnt reset the thing everytime
  const isAnyMenuOpen = (): boolean => {
    return (
      menuOpen ||
      timeOpen ||
      langOpen ||
      styleOpen ||
      frameworkOpen ||
      paradigmOpen ||
      importsOpen ||
      functionOpen ||
      problemTypeOpen
    );
  };

  return (
    <>
      <div
        onMouseLeave={() => {
          if (!isAnyMenuOpen()) {
            setIsOpen(false);
            console.log("mouse left");
          }
        }}
        onMouseEnter={() => {
          if (!isAnyMenuOpen()) {
            setIsOpen(true);
            console.log("mouse entered");
          }
        }}
        className={`text-vscode-text-bright h-full ${isOpen ? "w-96" : "w-24"} border-x-2 border-vscode-outline1 bg-vscode-primary transition-all duration-500`}
      >
        <div className="flex">
          <img src={menu} alt={"there should be a super cool icon here"} />

          {isOpen ? <p>Settings</p> : <></>}
        </div>

        {isOpen ? (
          <>
            <div>Timer Setting</div>
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="default"
                  className="rounded-none border-2 border-vscode-outline1"
                >
                  {time}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-72 font-vscodeText text-white bg-vscode-secondary"
                align="start"
              >
                {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => {
                      setTime(15);
                    }}
                  >
                    15 Seconds
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setTime(30);
                    }}
                  >
                    30 Seconds
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setTime(60);
                    }}
                  >
                    60 Seconds
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <div>Language</div>
            <DropdownButton
              options={languages}
              currentOption={language}
              setCurrentOption={setLanguage}
              menuOpen={langOpen}
              setMenuOpen={setLangOpen}
              onSelect={() => setFramework("None")}
            />
            <div>App Code vs Algorithmic</div>
            <DropdownButton
              options={styles}
              currentOption={style}
              setCurrentOption={setStyle}
              menuOpen={styleOpen}
              setMenuOpen={setLangOpen}
            />
            {/* just need to conditionally render these based on which option  */}
            {style === "App Code" ? (
              <>
                <div>Framework</div>
                <DropdownButton
                  options={frameworks[language]}
                  currentOption={framework}
                  setCurrentOption={setFramework}
                  menuOpen={frameworkOpen}
                  setMenuOpen={setFrameworkOpen}
                />
                <div>Paradigm</div>
                <DropdownButton
                  options={paradigms}
                  currentOption={paradigm}
                  setCurrentOption={setParadigm}
                  menuOpen={paradigmOpen}
                  setMenuOpen={setParadigmOpen}
                />
                <div>
                  <div>Include Imports?</div>
                  <DropdownButton
                    options={yesOrNo}
                    currentOption={includeImports}
                    setCurrentOption={setIncludeImports}
                    menuOpen={importsOpen}
                    setMenuOpen={setImportsOpen}
                  />
                </div>
                <div>
                  <div>Include Function Definitions?</div>
                  <DropdownButton
                    options={yesOrNo}
                    currentOption={includeFunctionDefinition}
                    setCurrentOption={setIncludeFunctionDefinition}
                    menuOpen={functionOpen}
                    setMenuOpen={setFunctionOpen}
                  />
                </div>
              </>
            ) : style === "Algorithmic" ? (
              <>
                <div>Problem Type</div>
                <DropdownButton
                  options={problemTypes}
                  currentOption={problemType}
                  setCurrentOption={setProblemType}
                  menuOpen={problemTypeOpen}
                  setMenuOpen={setProblemTypeOpen}
                />
              </>
            ) : (
              <></>
            )}
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
