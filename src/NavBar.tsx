import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import LogoElement, { LanguageNames } from "./components/my_own/LogoElement";
import { ReactElement } from "react";

export default function NavBar(): ReactElement {
  const location = useLocation();
  const navigate = useNavigate();

  const selectStyling = (path: string) => {
    return location.pathname === path
      ? "bg-vscode-background text-vscode-text-bright border-t-blue-500 border-t-[1px]"
      : "bg-vscode-primary text-vscode-text-dull border-b-vscode-outline1 border-b-[1px] hover:bg-vscode-background";
  };

  const NavbarElement = ({
    path,
    language,
    filename,
  }: {
    path: string;
    language: LanguageNames;
    filename: string;
  }) => {
    return (
      <div
        className={`${selectStyling(path)} transition-bg duration-100 ease-in-out select-none h-full w-36 pl-2 gap-1 inline-flex justify-start items-center border-r-[1px] border-r-vscode-outline1 hover:cursor-pointer`}
        onClick={() => navigate(path)}
      >
        <LogoElement name={language} size={22} />
        <div className="text-sm">{filename}</div>
      </div>
    );
  };

  return (
    <div className="w-full bg-vscode-primary h-10 flex">
      {/**design is pretty simple
       * the container will have a bottom border,
       * boxes: border left and bottom
       * filler box: border left right and bottom
       *
       * selected: x icon, bg gray, text white
       * unselected: no x icon, bg black, text, gray
       *
       */}

      <NavbarElement path="/" language="python" filename="Type.py" />
      <NavbarElement path="/stats" language="csv" filename="stats.csv" />
      <NavbarElement path="/account" language="env" filename="Account.env" />
      <div className="inline-block h-full flex-1 border-b-[1px] border-vscode-outline1"></div>
    </div>
  );
}
