import { ReactElement, useRef, useState } from "react";
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
import { MdKeyboardArrowDown } from "react-icons/md";

type Props = {
  widthStyling: string;
  options: readonly string[];
  currentOption: string;
  setCurrentOption: (option: string) => void;
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSelect?: () => void;
};

export function DropdownButton({
  widthStyling,
  options,
  currentOption,
  setCurrentOption,
  menuOpen,
  setMenuOpen,
  onSelect,
}: Props): ReactElement {
  const buttonRef = useRef<ReactElement | null>(null);

  return (
    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="default"
          className={`rounded-none ${widthStyling} select-none border-2 text-white border-vscode-outline1 flex justify-between items-center`}
        >
          {currentOption}
          <MdKeyboardArrowDown
            size={30}
            className={`${!menuOpen ? "" : "rotate-180"}`}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={`${widthStyling} border-vscode-outline1 rounded-none font-vscodeText text-white bg-vscode-secondary`}
        align="start"
      >
        <DropdownMenuGroup>
          {options
            .filter((value) => value !== currentOption)
            .map(
              (item, index): ReactElement => (
                <DropdownMenuItem
                  key={item + index}
                  onClick={() => {
                    setCurrentOption(item);
                    onSelect?.();
                  }}
                >
                  {item}
                </DropdownMenuItem>
              )
            )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
