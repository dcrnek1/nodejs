import { TrashSimpleIcon } from "@phosphor-icons/react";
import { Skeleton } from "../ui/Skeleton";
import { CategoryDetailsDialog } from "./CategoryDetailsDialog";
import { useProductsByCategoryId } from "@/hooks/useProduct";
import { PopoverComp } from "../PopoverComp";
import { useDeleteCategory } from "@/hooks/useCategory";

function CategoryCard({ category }) {
  const deleteCategory = useDeleteCategory(category.name);


  const handleDelete = async (setOpen) => {
    await deleteCategory.mutateAsync(category.category_id);
    setOpen(false);
  };

  const products = useProductsByCategoryId(category.category_id);

  return (
    <div
      className={`cursor-pointer rounded-md border border-solid-border/50 bg-main p-4 min-h-25 h-full hover:bg-el-hover-bg active:bg-el-bg}`}
    >
      <CategoryDetailsDialog
        key={category.category_id}
        category={category}
        products={products}
      >
        <div className="flex flex-col gap-2 h-full justify-between relative">
          <h1 className="text-lg text-primary line-clamp-2">{category.name}</h1>
          <div className="text-secondary">
            {category.product_count} products
          </div>
          <div className="absolute bottom-0 right-0 flex flex-row gap-1">
            <PopoverComp
              align="end"
              content={({ setOpen }) => (
                <div
                  className="flex flex-col gap-4"
                >
                  <div className="text-primary text-sm">Are you sure you want to delete category?</div>
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
    </div>
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
