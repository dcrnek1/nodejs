import {
  CaretDownIcon,
  CaretUpIcon,
  FolderSimplePlusIcon,
} from "@phosphor-icons/react";
import { useCategories } from "../hooks/useCategory";
import { useState } from "react";
import {
  CategoryCard,
  CategorySkeleton,
} from "../components/category/CategoryCard";
import {
  AnimatePresence,
  LayoutGroup,
  // eslint-disable-next-line no-unused-vars
  motion,
  MotionConfig,
} from "motion/react";

export default function CategoryPage() {
  const [order, setOrder] = useState("desc");
  const categories = useCategories(order);

  return (
    <MotionConfig
      transition={{ duration: categories.isFetchedAfterMount ? 0.3 : 0 }}
    >
      <LayoutGroup>
        <div className="max-w-8xl mx-auto min-h-full padding-x py-6">
          {/* Header */}
          <div className="flex flex-wrap justify-between items-center border-b border-solid-border pb-6 mb-6">
            <h1 className="text-nowrap">Category list</h1>
            <div>
              <button
                onClick={() =>
                  order === "asc" ? setOrder("desc") : setOrder("asc")
                }
                className="cursor-pointer flex flex-row gap-1 items-center text-tertiary hover:text-primary primary bg-primary/5 hover:transition active:transition hover:bg-primary/10 active:bg-primary/10"
              >
                <CaretDownIcon
                  className={`  transition-transform duration-250 ${
                    order === "asc" && "rotate-180"
                  }`}
                />{" "}
                <span className="w-11">{order === "asc" ? "Asc" : "Desc"}</span>
              </button>
            </div>
          </div>

          {categories.isError && <div>Error fetching categories...</div>}

          {/* Category cards */}
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] pb-6">
            {/* Skeleton */}

            <AnimatePresence mode="popLayout">
              {categories.isPending &&
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
              {/* Add new button */}
              {categories.isSuccess && (
                <motion.div
                  key={`add_new_button`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
                >
                  <div
                    className={`flex flex-col h-full w-full justify-center items-center min-h-13 cursor-pointer bg-el-bg hover:bg-el-hover-bg active:bg-el-hover-bg rounded-md border border-solid-border p-2`}
                  >
                    <FolderSimplePlusIcon weight="regular" size={30} />
                  </div>
                </motion.div>
              )}
              {/* Cards */}
              {categories.isSuccess &&
                categories.data.map((category) => (
                  <motion.div
                    key={`card_${category.category_id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
                  >
                    <motion.div
                      layout
                      transition={{
                        type: "spring",
                        damping: 100,
                        stiffness: 1000,
                      }}
                      className="h-full"
                    >
                      <CategoryCard category={category} />
                    </motion.div>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </div>
      </LayoutGroup>
    </MotionConfig>
  );
}
