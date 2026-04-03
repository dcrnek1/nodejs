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
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";

export default function SortPopover({ sort, setSort }) {
  const handleOrderClick = (e, value) => {
    setSort((prev) => ({
      ...prev,
      value: {
        ...prev.value,
        order: value,
        orderIcon: value === "asc" ? "SortDescendingIcon" : "SortAscendingIcon",
      },
    }));
  };

  const handleColumnClick = (e, value, text) => {
    setSort((prev) => ({
      ...prev,
      value: { ...prev.value, column: value, columnText: text },
    }));
  };
  
  const iconMap = { SortAscendingIcon, SortDescendingIcon };
  const Icon = iconMap[sort.value.orderIcon];

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <motion.div layout transition={{ duration: 0.1 }}>
          <button className="secondary text-sm flex flex-row items-center gap-2">
            <Icon />
            <span>{sort.value.columnText}</span>
          </button>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" portaled="false" align="end">
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
          {sort?.data?.orders.map(({ value, text, icon }) => {
            const Icon = iconMap[icon];
            return (
              <DropdownMenuRadioItem
                key={value}
                value={value}
                onClick={(e) => handleOrderClick(e, value)}
              >
                <Icon />
                {text}
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
