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

import useStore, { options } from "@/store/sidebarStore";
import { DropdownButton } from "./DropdownButton";

export default function Sidebar(): ReactElement {
  const {
    setLanguage,
    setStyle,
    setFramework,
    setParadigm,
    setIncludeImports,
    setIncludeFunctionDefinition,
    setProblemType,
  } = useStore();
  const language = useStore((state) => state.language);
  const style = useStore((state) => state.style);
  const framework = useStore((state) => state.framework);
  const paradigm = useStore((state) => state.paradigm);
  const includeImports = useStore((state) => state.includeImports);
  const includeFunctionDefinition = useStore(
    (state) => state.includeFunctionDefinition
  );
  const problemType = useStore((state) => state.problemType);

  // const [time, setTime] = useState<number>(15);
  // const [language, setLanguage] = useState<Languages>("Any");
  // const [style, setStyle] = useState<Styles>("App Code");
  // const [framework, setFramework] = useState<string>("Any");
  // const [paradigm, setParadigm] = useState<Paradigms>("Both");
  // const [includeImports, setIncludeImports] = useState<YesOrNo>("No");
  // const [includeFunctionDefinition, setIncludeFunctionDefinition] =
  //   useState<YesOrNo>("Yes");
  // const [problemType, setProblemType] = useState<ProblemTypes>("Any");

  const [isOpen, setIsOpen] = useState<boolean>(false);
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
            //console.log("mouse left");
          }
        }}
        onMouseEnter={() => {
          if (!isAnyMenuOpen()) {
            setIsOpen(true);
            //console.log("mouse entered");
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
            <DropdownMenu
              open={menuOpen}
              onOpenChange={setMenuOpen}
            ></DropdownMenu>
            <div>Language</div>
            <DropdownButton
              options={options.languages}
              currentOption={language}
              setCurrentOption={setLanguage}
              menuOpen={langOpen}
              setMenuOpen={setLangOpen}
              onSelect={() => setFramework("None")}
            />
            <div>App Code vs Algorithmic</div>
            <DropdownButton
              options={options.styles}
              currentOption={style}
              setCurrentOption={(option) => setStyle(option)}
              menuOpen={styleOpen}
              setMenuOpen={setStyleOpen}
            />
            {/* just need to conditionally render these based on which option  */}
            {style === "App Code" ? (
              <>
                <div>Framework</div>
                <DropdownButton
                  options={options.frameworks[language]}
                  currentOption={framework}
                  setCurrentOption={setFramework}
                  menuOpen={frameworkOpen}
                  setMenuOpen={setFrameworkOpen}
                />
                <div>Paradigm</div>
                <DropdownButton
                  options={options.paradigms}
                  currentOption={paradigm}
                  setCurrentOption={setParadigm}
                  menuOpen={paradigmOpen}
                  setMenuOpen={setParadigmOpen}
                />
                <div>
                  <div>Include Imports?</div>
                  <DropdownButton
                    options={options.yesOrNo}
                    currentOption={includeImports}
                    setCurrentOption={setIncludeImports}
                    menuOpen={importsOpen}
                    setMenuOpen={setImportsOpen}
                  />
                </div>
                <div>
                  <div>Include Function Definitions?</div>
                  <DropdownButton
                    options={options.yesOrNo}
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
                  options={options.problemTypes}
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
