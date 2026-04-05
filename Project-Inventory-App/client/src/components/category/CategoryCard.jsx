import { TrashSimpleIcon } from "@phosphor-icons/react";
import { Skeleton } from "../ui/Skeleton";
import { CategoryDetailsDialog } from "./CategoryDetailsDialog";
import { useProductsByCategoryId } from "@/hooks/useProduct";
import { PopoverComp } from "../PopoverComp";
import { useDeleteCategory } from "@/hooks/useCategory";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";

function CategoryCard({ category }) {
  const deleteCategory = useDeleteCategory(category.name);

  const handleDelete = async (setOpen) => {
    await deleteCategory.mutateAsync(category.category_id);
    setOpen(false);
  };

  const products = useProductsByCategoryId(category.category_id);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={`cursor-pointer rounded-md bg-bg-main p-4 min-h-25 h-full mb-10 hover:bg-bg-main/90 active:bg-el-bg}`}
    >
      <CategoryDetailsDialog
        key={category.category_id}
        category={category}
        products={products}
      >
        <div className="flex flex-col gap-1 h-full justify-between relative">
          <div className="relative h-full w-full">
            <h1 className="text-2xl z-2 absolute top-0 left-0 font-semibold text-primary line-clamp-2">
              {category.name}
            </h1>
            <div className="text-secondary z-0 text-9xl tracking-tighter font-mono font-bold absolute -bottom-11 -left-6 overflow-hidden text-subtle">
              {category.product_count}
            </div>
          </div>
          <div className="absolute bottom-0 right-0 flex flex-row gap-1">
            <PopoverComp
              align="end"
              content={({ setOpen }) => (
                <div className="flex flex-col gap-4">
                  <div className="text-primary text-sm">
                    Are you sure you want to delete category?
                  </div>
                  <div className="flex flex-row gap-2 justify-end">
                    <button
                      className="secondary w-fit"
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="primary w-fit"
                      onClick={() => {
                        handleDelete(setOpen);
                      }}
                      disabled={deleteCategory.isPending}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              )}
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="p-1.5 no-scale bg-subtle border border-solid-border rounded-full hover:transition active:transition hover:bg-primary/10 active:bg-primary/10 text-secondary"
              >
                <TrashSimpleIcon />
              </div>
            </PopoverComp>
          </div>
        </div>
      </CategoryDetailsDialog>
    </motion.div>
  );
}

function CategorySkeleton(key) {
  return (
    <div key={key} className={`rounded-md p-2 min-h-25 flex flex-col gap-3`}>
      <Skeleton className="w-full h-7" />
      <Skeleton className="h-4 w-[30%]" />
      <div className="flex flex-row justify-between">
        <Skeleton className="h-4 w-[50%]" />
        <div className="flex gap-2">
          <Skeleton className="h-4 w-5" />
          <Skeleton className="h-4 w-5" />
        </div>
      </div>
    </div>
  );
}

export { CategoryCard, CategorySkeleton };
