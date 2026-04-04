import { useEffect, useRef } from "react";
import { useCategories } from "../../hooks/useCategory";
import {
  CategoryCard,
  CategorySkeleton,
} from "../../components/category/CategoryCard";
import CreateCategoryDialog from "@/components/category/CreateCategoryDialog";
import SortPopover from "@/components/category/CategorySortDropdown";
import { useAtom } from "jotai";
import { categorySortAtom } from "@/state/categorySortAtom";
import { PlusIcon } from "@phosphor-icons/react";
  // eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion, MotionConfig } from "motion/react";

export default function CategoriesPage() {
  //Sort state
  const [sort, setSort] = useAtom(categorySortAtom);

  //Fetching data
  const categories = useCategories(sort.value.column, sort.value.order, 20);
  const allCategories = categories.data?.pages.flatMap((p) => p.result) || [];

  //Infinite scroll
  const loaderRef = useRef();
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          categories.hasNextPage &&
          !categories.isFetchingNextPage
        ) {
          categories.fetchNextPage();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [categories, categories.hasNextPage]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1 }}
    >
      <div className="max-w-8xl mx-auto min-h-full padding-x py-6">
        <MotionConfig
          transition={{ duration: categories.isFetchedAfterMount ? 0.2 : 0 }}
        >
          {/* Header */}
          <div className="flex flex-col flex-wrap justify-center gap-6 pb-6 mb-6">
            <h1 className="text-nowrap font-inter font-semibold text-5xl tracking-wide">
              Category <br />
              list
            </h1>
            <div className="text-secondary/80">
              Curated selection of timeless product masterpieces currently
              available in our physical archive.
            </div>
            <div className="flex flex-row gap-4 items-center justify-end">
              <CreateCategoryDialog>
                <button className="secondary-primary text-sm flex flex-row items-center gap-2">
                  <PlusIcon />
                  <span className="font-semibold">Add Item</span>
                </button>
              </CreateCategoryDialog>
              <SortPopover sort={sort} setSort={setSort} />
            </div>
          </div>

          {categories.isError && <div>Error fetching categories...</div>}

          {/* Category cards */}
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] pb-6">
            {/* Skeleton */}

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

              {categories.isFetchingNextPage &&
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
          </div>

          <div ref={loaderRef}></div>
        </MotionConfig>
      </div>
    </motion.div>
  );
}
