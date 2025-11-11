
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react";

export function PopoverComp({children, content}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-full">
        {typeof content === "function" ? content({ setOpen }) : content}
      </PopoverContent>
    </Popover>
  )
}
