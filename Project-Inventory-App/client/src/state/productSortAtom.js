import { atom } from "jotai";

const productSortAtom = atom({
    value: {
      column: "name",
      columnText: "Name",
      order: "desc",
      orderIcon: "SortAscendingIcon",
    },
    data: {
      columns: [
        { value: "name", text: "Name" },
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

export {productSortAtom};