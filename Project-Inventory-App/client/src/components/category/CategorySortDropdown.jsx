import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  SortAscendingIcon,
  SortDescendingIcon,
} from "@phosphor-icons/react";
import {
  // eslint-disable-next-line no-unused-vars
  motion,
} from "motion/react";

export default function SortPopover({sort, setSort}) {
  const handleOrderClick = (e, value) => {
    e.preventDefault();
    setSort((prev) => ({ ...prev, value: { ...prev.value, order: value, orderIcon: value === 'asc' ? <SortDescendingIcon size={15} /> : <SortAscendingIcon size={15} /> } }));
    console.log(value);
  };

  const handleColumnClick = (e, value, text) => {
    e.preventDefault();
    setSort((prev) => ({ ...prev, value: { ...prev.value, column: value, columnText: text } }));
    console.log(value);
  };

  return (
    <motion.div layout>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="secondary text-sm flex flex-row items-center gap-2">
          {sort.value.orderIcon}
          <span>{sort.value.columnText}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={sort.value.column}>
          {sort?.data?.columns.map(({ value, text }) => (
            <DropdownMenuRadioItem
              key={value}
              value={value}
              onClick={(e) => handleColumnClick(e, value, text)}
            >
              {text}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>

        <DropdownMenuRadioGroup value={sort.value.order}>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Sort order</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {sort?.data?.orders.map(({ value, text, icon }) => (
            <DropdownMenuRadioItem
              key={value}
              value={value}
              onClick={(e) => handleOrderClick(e, value)}
            >
              {icon} {text}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
    </motion.div>
  );
}
