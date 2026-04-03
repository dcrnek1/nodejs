import { atom } from "jotai";

const categorySortAtom = atom({
    value: {
      column: "name",
      columnText: "Name",
      order: "desc",
      orderIcon: "SortAscendingIcon",
    },
    data: {
      columns: [
        { value: "name", text: "Name" },
        { value: "product_count", text: "Product count" },
        { value: "tstamp", text: "Updated" },
      ],
      orders: [
        {
          value: "desc",
          text: "Descending",
          icon: "SortAscendingIcon",
        },
        {
          value: "asc",
          text: "Ascending",
          icon: "SortDescendingIcon",
        },
      ],
    },
  });

export {categorySortAtom};