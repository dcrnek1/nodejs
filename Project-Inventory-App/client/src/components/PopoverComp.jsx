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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
        {children}
      </PopoverTrigger>
      <PopoverContent
        className="w-full"
        side={side}
        align={align}
        onInteractOutside={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onFocusOutside={(e) => e.preventDefault()}
        onClick={(e) => e.stopPropagation()}
      >
        {typeof content === "function" ? content({ setOpen }) : content}
      </PopoverContent>
    </Popover>
  );
}
