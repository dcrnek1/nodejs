import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

export function PopoverComp({
  children,
  content,
  side = "bottom",
  align = "center",
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen} className="mt-2">
      <PopoverTrigger asChild onClick={() => { setOpen(!open)}}>
        {children}
      </PopoverTrigger>
      <PopoverContent
        className="w-full shadow-white/5"
        side={side}
        align={align}
        onClick={(e) => {e.stopPropagation();}}
      >
        {typeof content === "function" ? content({ setOpen }) : content}
      </PopoverContent>
    </Popover>
  );
}
