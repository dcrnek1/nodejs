import { ArrowArcRightIcon, ArrowRightIcon } from "@phosphor-icons/react";
import Image from "../Image";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/Skeleton";
import { ChevronRight } from "lucide-react";

function ProductCard({ product }) {

  console.log(import.meta.env.VITE_IMAGE_URL + "  .  " + product.image_path)
  return (
    <>
      <div className="rounded-md gap-4 cursor-pointer bg-bg-main flex flex-col">
        <div className="relative">{product.image_path && (
          <Image
            src={`${import.meta.env.VITE_IMAGE_URL}${product.image_path}`}
            alt={product.name}
            className="rounded-t-xl h-120 w-full"
          />
        )}
          {!product.image_path && (
            <div className="rounded-t-xl h-120 w-full"></div>
          )}
          <div className="absolute right-4 top-4 text-white">
            <Badge variant={"default"} className="pt-1">
                  {product.stock} IN STOCK
                </Badge>
          </div>
          </div>
        <div className="px-5 pb-5 pt-2 flex flex-col gap-4">
          <div className="flex flex-row gap-2 -mr-5 overflow-x-auto pr-2 hide-scrollbar">
            {product.categories &&
              product.categories.map((category) => (
                <Badge key={category.category_id} variant={"secondary"}>
                  {category.name}
                </Badge>
              ))}
          </div>
          <div className="text-3xl font-bold sm:text-lg text-primary leading-tight py-2">{product.name}</div>
          <p className="text-secondary font-light text-sm h-[calc(1.25rem*4)] leading-base tracking-tight text-justify text line-clamp-4">
            {product.description}
          </p>
          <div className="flex w-full justify-end pt-3"><ChevronRight size={30}/></div>
        </div>
      </div>
    </>
  );
}

function ProductSkeleton() {
  return (
    <div className="flex flex-row gap-3 w-full">
      <Skeleton className="w-38 h-50" />
      <div className="w-full p-2 flex flex-col justify-between">
        <div className="rounded-md min-h-25 w-full flex flex-col gap-3">
          <Skeleton className="w-full h-7" />
          <Skeleton className="h-3 w-[30%] mt-3" />
          <Skeleton className="h-3 w-[25%]" />
          <Skeleton className="h-3 w-[40%]" />
        </div>
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-3">
            <Skeleton className="h-4 w-15" />
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

export { ProductCard, ProductSkeleton };
