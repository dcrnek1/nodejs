import { TrashSimpleIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import { Skeleton } from "../ui/Skeleton";

function CategoryCard({ category }) {
  const handleDelete = (name) => {
    toast.error(`Deleting category ${name}.`);
  };

  return (
    <div
      className={` rounded-md border border-solid-border p-2 min-h-25 h-full hover:bg-el-bg active:bg-el-bg}`}
    >
      <div className="flex flex-col gap-2 h-full justify-between relative">
        <h1 className="text-lg text-primary line-clamp-2">{category.name}</h1>
        <div className="text-secondary">{category.product_count} products</div>
        <div className="absolute bottom-0 right-0 flex flex-row gap-1">
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(category.name);
            }}
            className="p-1.5 bg-subtle border border-solid-border rounded-full hover:transition active:transition hover:bg-primary/10 active:bg-primary/10 text-error/60"
          >
            <TrashSimpleIcon />
          </div>
        </div>
      </div>
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
