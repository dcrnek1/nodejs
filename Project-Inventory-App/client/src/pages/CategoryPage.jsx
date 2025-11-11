import { CaretDownIcon, CaretUpIcon, FolderSimplePlusIcon } from "@phosphor-icons/react";
import { useCategories } from "../hooks/useCategory";
import { useState } from "react";
import { useEffect } from "react";
import { CategoryDetailsDialog } from "../components/dialog/category/CategoryDetailsDialog";
import { CategoryCard, CategorySkeleton } from "../components/category/CategoryCard";

export default function CategoryPage() {
  const [cardsVisible, setCardsVisible] = useState(true);
  const [order, setOrder] = useState('desc')
  const categories = useCategories(order);

  useEffect(() => {
    if (categories.isPending) {
      setCardsVisible(false);
    }

    if (categories.isSuccess) {
      const timer = setTimeout(() => {
        setCardsVisible(true);
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [categories.isPending, categories.isSuccess]);

  return (
    <div className="max-w-8xl mx-auto min-h-full padding-x py-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center border-b border-solid-border pb-6 mb-6">
        <h1 className="text-nowrap">Category list</h1>
        <div>
          <button 
          onClick={() => order === 'asc' ? setOrder('desc') : setOrder('asc')}
          className="cursor-pointer flex flex-row gap-1 items-center text-tertiary hover:text-primary primary bg-primary/5 hover:transition active:transition hover:bg-primary/10 active:bg-primary/10">
            <CaretDownIcon className={`  transition-transform duration-250 ${order === 'asc' && 'rotate-180'}`} /> <span className="w-11">{order === 'asc' ? 'Asc' : 'Desc'}</span>
          </button>
        </div>
      </div>

      {categories.isError && <div>Error fetching categories...</div>}

      {/* Category cards */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] pb-6">
        {/* Skeleton */}
        {categories.isPending &&
          Array.from({ length: 9 }).map((_, index) => (
            <CategorySkeleton key={index} />
          ))}
        {/* Add new button */}
        {categories.isSuccess && (
          <div
            className={`cursor-pointer bg-el-bg hover:bg-el-hover-bg active:bg-el-hover-bg rounded-md border border-solid-border p-2
           transition-[translate,opacity] duration-500 ease-out will-change-[opacity,translate] ${
             cardsVisible
               ? "opacity-100 translate-y-0"
               : "opacity-0 translate-y-4"
           }`}
          >
            <div
              className={`flex flex-col h-full w-full justify-center items-center min-h-13`}
            >
              <FolderSimplePlusIcon weight="regular" size={30} />
            </div>
          </div>
        )}
        {/* Cards */}
        {categories.isSuccess &&
          categories.data.map((category, index) => (
              <div
              key={category.category_id}
                className={`
                transition-[translate,opacity] duration-500 ease-out will-change-[opacity,translate] ${
                  cardsVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <CategoryCard
                  category={category}
                />
              </div>
          ))}
      </div>
    </div>
  );
}
