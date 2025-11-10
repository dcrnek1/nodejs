import {
  NotePencilIcon,
  PlusIcon,
  TrashSimpleIcon,
} from "@phosphor-icons/react";
import { useCategories } from "../hooks/useCategory";
import { toast } from "sonner";
import { Skeleton } from "../components/ui/Skeleton";
import { useState } from "react";
import { useEffect } from "react";

export default function CategoryPage() {
  const categories = useCategories();
  const [cardsVisible, setCardsVisible] = useState(false);

  const handleEdit = (name) => {
    toast.info(`Editing category ${name}.`);
  };

  const handleDelete = (name) => {
    toast.error(`Deleting category ${name}.`);
  };

  useEffect(() => {
    if (categories.isSuccess) {
      setCardsVisible(true);
    }
  }, [categories.isSuccess]);

  return (
    <div className="max-w-8xl mx-auto min-h-full padding-x py-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center border-b border-solid-border pb-6 mb-6">
        <h1 className="text-nowrap">Category list</h1>
      </div>

      {categories.isError && <div>Error fetching categories...</div>}

      {/* Category cards */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] pb-6">
        {/* Skeleton */}
        {categories.isPending &&
          Array.from({ length: 9 }).map((_, index) => (
            <div
              key={index}
              className={`rounded-md p-2 min-h-25 flex flex-col gap-3`}
            >
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
          ))}
        {/* Cards */}
        {categories.isSuccess &&
          categories.data.map((category, index) => (
            <div
              key={index}
              className={`bg-el-bg rounded-md border border-solid-border p-2 min-h-25 
                transition-[translate,opacity] duration-500 ease-out ${
                  cardsVisible || !categories.isFetchedAfterMount ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col h-full justify-between relative">
                <h1 className="text-lg text-primary">{category.name}</h1>
                <div className="text-secondary">
                  {category.product_count} products
                </div>
                <div className="absolute bottom-0 right-0 flex flex-row gap-1">
                  <div
                    onClick={() => handleEdit(category.name)}
                    className="p-1.5 bg-subtle border border-solid-border text-tertiary rounded-full hover:bg-primary/10 hover:text-sky-500/50"
                  >
                    <NotePencilIcon />
                  </div>
                  <div
                    onClick={() => handleDelete(category.name)}
                    className="p-1.5 bg-subtle border border-solid-border text-tertiary rounded-full hover:bg-primary/10 hover:text-error/50"
                  >
                    <TrashSimpleIcon />
                  </div>
                </div>
              </div>
            </div>
          ))}

        {/* Add new button */}
        {categories.isSuccess && (
          <div className="bg-el-bg hover:bg-el-hover-bg rounded-md border border-solid-border p-2">
            <div className="flex flex-col h-full w-full justify-center items-center min-h-13">
              <PlusIcon size={20} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
