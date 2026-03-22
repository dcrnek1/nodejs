import {
  FolderSimplePlusIcon,
  SortAscendingIcon,
  SortDescendingIcon,
} from "@phosphor-icons/react";
import { useCategories } from "../../hooks/useCategory";
import { useEffect, useRef, useState } from "react";
import {
  CategoryCard,
  CategorySkeleton,
} from "../../components/category/CategoryCard";
import {
  AnimatePresence,
  // eslint-disable-next-line no-unused-vars
  motion,
  MotionConfig,
} from "motion/react";
import { useDelayedLoading } from "@/lib/utils";
import CreateCategoryDialog from "@/components/category/CreateCategoryDialog";
import SortPopover from "@/components/category/CategorySortDropdown";

export default function CategoriesPage() {
  //Sort state
  const [sort, setSort] = useState({
    value: {
      column: "name",
      columnText: "Name",
      order: "desc",
      orderIcon: <SortAscendingIcon size={15} />,
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
          icon: <SortAscendingIcon size={15} />,
        },
        {
          value: "asc",
          text: "Ascending",
          icon: <SortDescendingIcon size={15} />,
        },
      ],
    },
  });
  const categories = useCategories(sort.value.column, sort.value.order);
  const allCategories = categories.data?.pages.flatMap((p) => p.result) || [];

  const loaderRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && categories.hasNextPage) {
        categories.fetchNextPage();
      }
    });

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [categories, categories.hasNextPage]);

  return (
    <MotionConfig
      transition={{ duration: categories.isFetchedAfterMount ? 0.2 : 0 }}
    >
      <div className="max-w-8xl mx-auto min-h-full padding-x py-6">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center border-b border-solid-border pb-6 mb-6">
          <h1 className="text-nowrap">Category list</h1>
          <div className="flex flex-row gap-4 items-center">
            <SortPopover sort={sort} setSort={setSort} />
          </div>
        </div>

        {categories.isError && <div>Error fetching categories...</div>}

        {/* Category cards */}
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] pb-6">
          {/* Skeleton */}

          <AnimatePresence mode="popLayout">
            {/* Add new button */}
            {categories.isSuccess && (
              <motion.div
                key={`add_new_button`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
              >
                <CreateCategoryDialog>
                  <div
                    className={`flex flex-col h-full w-full justify-center items-center min-h-13 cursor-pointer bg-el-bg hover:bg-el-hover-bg active:bg-el-hover-bg rounded-md border border-solid-border p-2`}
                  >
                    <FolderSimplePlusIcon weight="regular" size={30} />
                  </div>
                </CreateCategoryDialog>
              </motion.div>
            )}
            {/* Cards */}

            {categories.isSuccess &&
              allCategories.map((category) => (
                <motion.div
                  key={`card_${category.category_id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  whileTap={{ scale: 0.99, transition: { duration: 0.1 } }}
                >
                  <CategoryCard category={category} />
                </motion.div>
              ))}

              
            {categories.isFetching &&
              Array.from({ length: 9 }).map((_, index) => (
                <motion.div
                  key={`skeleton_${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <CategorySkeleton />
                </motion.div>
              ))}
          </AnimatePresence>
        </div>

        <div ref={loaderRef}></div>
      </div>
    </MotionConfig>
  );
}
