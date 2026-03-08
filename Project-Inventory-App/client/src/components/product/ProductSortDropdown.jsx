import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SortAscendingIcon, SortDescendingIcon } from "@phosphor-icons/react";
import {
  // eslint-disable-next-line no-unused-vars
  motion,
} from "motion/react";

export default function SortPopover({ sort, setSort }) {
  const handleOrderClick = (e, value) => {
    setSort((prev) => ({
      ...prev,
      value: {
        ...prev.value,
        order: value,
        orderIcon:
          value === "asc" ? (
            <SortDescendingIcon size={15} />
          ) : (
            <SortAscendingIcon size={15} />
          ),
      },
    }));
  };

  const handleColumnClick = (e, value, text) => {
    setSort((prev) => ({
      ...prev,
      value: { ...prev.value, column: value, columnText: text },
    }));
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <motion.div layout transition={{ duration: 0.1 }}>
          <button className="secondary text-sm flex flex-row items-center gap-2">
            {sort.value.orderIcon}
            <span>{sort.value.columnText}</span>
          </button>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" portaled={false} align="end">
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
  );
}
