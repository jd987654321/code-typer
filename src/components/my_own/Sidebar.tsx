import { ReactElement, useState } from "react";
import { menu, menuOpener } from "@/assets/menu";
import { useTimerContext } from "@/context/TimerProvider";

import useUserStore from "@/store/userStore";
import useStore, { options } from "@/store/sidebarStore";
import { DropdownButton } from "./DropdownButton";

export default function Sidebar(): ReactElement {
  const {
    languageOptions,
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
  const { setTime } = useTimerContext();
  const problemType = useStore((state) => state.problemType);
  const startingTime = useUserStore((state) => state.startingTime);
  const { setStartingTime } = useUserStore();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [timeOpen, setTimeOpen] = useState<boolean>(false);
  const [langOpen, setLangOpen] = useState<boolean>(false);
  const [styleOpen, setStyleOpen] = useState<boolean>(false);
  const [frameworkOpen, setFrameworkOpen] = useState<boolean>(false);
  const [paradigmOpen, setParadigmOpen] = useState<boolean>(false);

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
      problemTypeOpen
    );
  };

  const closeAllMenus = () => {
    setIsOpen(false);
    setMenuOpen(false);
    setTimeOpen(false);
    setLangOpen(false);
    setStyleOpen(false);
    setFrameworkOpen(false);
    setParadigmOpen(false);
    setProblemTypeOpen(false);
  };

  //right now it is just a div that expands
  //we want a div that stands alone, then an absolute div that pops into view when triggered

  //we currently have the issue of there being no options in the dropdown
  //console.log(languageOptions);

  return (
    <div className="border-x-[1px] z-10 border-vscode-outline1 text-vscode-text-bright font-normal font-vscodeText relative whitespace-nowrap h-full w-24  bg-vscode-primary">
      <div
        className={` ${isOpen ? "border-blue-500 border-l-[1px]" : ""} h-14 w-full box-border flex justify-center items-center hover:cursor-pointer hover:bg-gray-600`}
        onClick={() => setIsOpen((state) => !state)}
      >
        <img
          src={menu}
          className="w-8 select-none"
          alt={"there should be a super cool icon here"}
        />
      </div>
      <div
        className={`border-x-[1px] border-vscode-outline1 px-4 top-0 left-full absolute ${isOpen ? "visible" : "hidden"} w-[500px] bg-vscode-primary h-full`}
      >
        {isOpen ? (
          <div className=" flex flex-col gap-2 mt-4">
            <div className="flex justify-between items-center">
              <div className="text-xl select-none">Time</div>
              <DropdownButton
                widthStyling="w-48"
                options={["15 seconds", "30 seconds", "60 seconds"]}
                currentOption={startingTime.toString()}
                setCurrentOption={(value) => {
                  setStartingTime(parseInt(value));
                  setTime(parseInt(value));
                }}
                menuOpen={timeOpen}
                setMenuOpen={setTimeOpen}
              />
            </div>
            <div className="flex justify-between items-center">
              <div className="text-xl select-none">Style</div>
              <DropdownButton
                widthStyling="w-48"
                options={options.styles}
                currentOption={style}
                setCurrentOption={(option) => {
                  setStyle(option);
                  setFramework("Any");
                  setParadigm("Any");
                  setProblemType("Any");
                }}
                menuOpen={styleOpen}
                setMenuOpen={setStyleOpen}
              />
            </div>
            <div className="flex justify-between items-center">
              <div className="text-xl select-none">Language</div>
              <DropdownButton
                widthStyling="w-48"
                options={options.languages}
                currentOption={language}
                setCurrentOption={(option) => {
                  setFramework("None");
                  setParadigm("Any");
                  setLanguage(option);
                }}
                menuOpen={langOpen}
                setMenuOpen={setLangOpen}
                onSelect={() => setFramework("None")}
              />
            </div>
            {/* just need to conditionally render these based on which option  */}
            {style === "App Code" ? (
              <div className="mt-8 flex flex-col gap-2">
                <div className="flex justify-between items-center gap-4">
                  <div className="text-sm select-none">Framework</div>

                  <DropdownButton
                    widthStyling="w-48"
                    options={Object.keys(languageOptions[language])}
                    currentOption={framework}
                    setCurrentOption={(option) => {
                      setParadigm("Any");
                      setFramework(option);
                    }}
                    menuOpen={frameworkOpen}
                    setMenuOpen={setFrameworkOpen}
                  />
                </div>
                <div className="flex justify-between items-center gap-4">
                  <div className="text-sm select-none">Paradigm</div>
                  <DropdownButton
                    widthStyling="w-48"
                    options={languageOptions[language][framework]}
                    currentOption={paradigm}
                    setCurrentOption={setParadigm}
                    menuOpen={paradigmOpen}
                    setMenuOpen={setParadigmOpen}
                  />
                </div>
              </div>
            ) : style === "Leetcode" ? (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm select-none">Category</div>
                <DropdownButton
                  widthStyling="w-48"
                  options={options.problemTypes}
                  currentOption={problemType}
                  setCurrentOption={setProblemType}
                  menuOpen={problemTypeOpen}
                  setMenuOpen={setProblemTypeOpen}
                />
              </div>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
