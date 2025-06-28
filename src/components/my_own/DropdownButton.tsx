import { ReactElement, useState } from "react";
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

type Props = {
  options: string[];
  currentOption: string;
  setCurrentOption: React.Dispatch<React.SetStateAction<string>>;
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSelect?: () => void;
};

export function DropdownButton({
  options,
  currentOption,
  setCurrentOption,
  menuOpen,
  setMenuOpen,
  onSelect,
}: Props): ReactElement {
  return (
    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="default"
          className="rounded-none border-2 text-white border-vscode-outline1"
        >
          {currentOption}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-72 font-vscodeText text-white bg-vscode-secondary"
        align="start"
      >
        <DropdownMenuGroup>
          {options.map(
            (item, index): ReactElement => (
              <DropdownMenuItem
                key={item}
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
