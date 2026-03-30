import { ArrowArcRightIcon, ArrowRightIcon } from "@phosphor-icons/react";
import Image from "../Image";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/Skeleton";
import { ChevronRight } from "lucide-react";
import { NavLink } from "react-router";

function ProductCard({ product }) {
  console.log(import.meta.env.VITE_IMAGE_URL + "  .  " + product.image_path);
  return (
    <NavLink to={`/products/${product.product_id}`}>
      <div className="rounded-md gap-4 cursor-pointer bg-bg-main flex flex-col shadow-lg/1">
        <div className="relative">
          <div className="absolute z-1 top-0 left-0 h-full w-full bg-gradient-to-t from-bg-main from-0% via-bg-main via-25% to-transparent to-50%"></div>
          {product.image_path && (
            <Image
              src={`${import.meta.env.VITE_IMAGE_URL}${product.image_path}`}
              alt={product.name}
              className="rounded-t-xl h-150 w-full"
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
          <div className="absolute bottom-0 left-0 px-5 w-full flex flex-col gap-3 z-2">
            <div className="text-3xl font-bold sm:text-3xl text-primary/95 leading-tight line-clamp-2">
              {product.name}
            </div>
            <div className="flex flex-row gap-2 -mr-5 -ml-5 pl-5 overflow-x-auto pr-2 hide-scrollbar h-7">
              {product.categories &&
                product.categories.map((category) => (
                  <Badge key={category.category_id} variant={"secondary"}>
                    {category.name}
                  </Badge>
                ))}
            </div>
            <p className="text-secondary font-light text-sm h-[calc(1.25rem*4)] leading-base tracking-tight text-justify text line-clamp-4">
              {product.description}
            </p>
          </div>
        </div>
        <div className="px-5 pb-5 flex flex-col gap-4 h-full">
          {/* <div className="flex flex-row gap-2 -mr-5 overflow-x-auto pr-2 hide-scrollbar h-10">
            {product.categories &&
              product.categories.map((category) => (
                <Badge key={category.category_id} variant={"secondary"}>
                  {category.name}
                </Badge>
              ))}
          </div> */}

          <div className="flex flex-col justify-between h-full">
            {/* <p className="text-secondary font-light text-sm h-[calc(1.25rem*4)] leading-base tracking-tight text-justify text line-clamp-4">
              {product.description}
            </p> */}
            <div className="flex w-full justify-end pt-3">
              <ChevronRight size={30} />
            </div>
          </div>
        </div>
      </div>
    </NavLink>
  );
}

function ProductSkeleton() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <Skeleton className="w-full h-100" />
      </div>
      <div className="flex flex-row gap-2 px-6">
        <Skeleton className="w-15 h-5" />
        <Skeleton className="w-20 h-5" />
        <Skeleton className="w-15 h-5" />
        <Skeleton className="w-25 h-5" />
      </div>
      <div className="px-6 flex flex-col gap-2">
        <Skeleton className="w-[75%] h-5" />
        <Skeleton className="w-[45%] h-5" />
      </div>
      <div className="px-6 flex flex-col gap-2">
        <Skeleton className="w-[100%] h-3" />
        <Skeleton className="w-[100%] h-3" />
        <Skeleton className="w-[100%] h-3" />
        <Skeleton className="w-[100%] h-3" />
        <Skeleton className="w-[50%] h-3" />
      </div>
      <div className="px-6 flex flex-row justify-end">
        <Skeleton className="w-10 h-10" />
      </div>
    </div>
  );
}

export { ProductCard, ProductSkeleton };
