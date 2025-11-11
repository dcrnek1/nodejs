
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react";

export function PopoverComp({children, content, side = "bottom", align = "center"}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-full" side={side} align={align}>
        {typeof content === "function" ? content({ setOpen }) : content}
      </PopoverContent>
    </Popover>
  )
}
