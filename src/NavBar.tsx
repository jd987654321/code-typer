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
import { ReactElement } from "react";

export default function NavBar(): ReactElement {
  const location = useLocation();
  const navigate = useNavigate();

  const selectStyling = (path: string) => {
    return location.pathname === path
      ? "bg-vscode-background text-vscode-text-bright border-t-blue-500 border-t-2"
      : "bg-vscode-primary text-vscode-text-dull border-b-vscode-outline1 border-b-2";
  };

  return (
    <div className="w-full bg-vscode-primary h-12 flex">
      {/**design is pretty simple
       * the container will have a bottom border,
       * boxes: border left and bottom
       * filler box: border left right and bottom
       *
       * selected: x icon, bg gray, text white
       * unselected: no x icon, bg black, text, gray
       *
       */}
      <div
        className={`${selectStyling("/")} select-none h-full w-40 inline-flex justify-center items-center border-r-2 border-r-vscode-outline1 hover:cursor-pointer`}
        onClick={() => navigate("/")}
      >
        <div>Type.py</div>
      </div>

      <div
        className={`${selectStyling("/stats")} select-none h-full w-40 inline-flex justify-center items-center border-r-2 border-r-vscode-outline1 hover:cursor-pointer`}
        onClick={() => navigate("/stats")}
      >
        <div>stats.csv</div>
      </div>

      <div
        className={`${selectStyling("/account")} select-none h-full w-40 inline-flex justify-center items-center border-r-2 border-r-vscode-outline1 hover:cursor-pointer`}
        onClick={() => navigate("/account")}
      >
        <div>Account</div>
      </div>
      <div className="inline-block h-full flex-1 border-b-2 border-vscode-outline1"></div>
    </div>
  );
}
