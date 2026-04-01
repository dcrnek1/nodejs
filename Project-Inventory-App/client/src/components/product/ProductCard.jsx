import Image from "../Image";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/Skeleton";
import { ChevronRight } from "lucide-react";
import { NavLink } from "react-router";
import { useAtom } from "jotai";
import { productsScrollAtom } from "@/state/productsScrollAtom";

function ProductCard({ product }) {

  const [_, setProductsScroll] = useAtom(productsScrollAtom);

  return (
    <NavLink to={`/products/${product.product_id}`} onClick={() => setProductsScroll(window.scrollY)}>
      <div className="rounded-md gap-4 cursor-pointer bg-bg-main flex flex-col shadow-lg/1 h-full">
        <div className="relative">
          {product.image_path && (
            <Image
              src={`${import.meta.env.VITE_IMAGE_URL}${product.image_path}`}
              alt={product.name}
              className="rounded-t-xl h-60 sm:h-120 w-full"
            />
          )}
          {!product.image_path && (
            <div className="rounded-t-xl h-50 w-full"></div>
          )}
          <div className="absolute right-4 top-4 text-white">
            <Badge variant={"default"} className="">
              {product.stock} in stock
            </Badge>
          </div>
          
        </div>
        <div className="px-5 pb-5 flex flex-col gap-4 h-full">
            <div className="flex flex-row gap-1 sm:gap-2 -mr-5 -ml-5 pl-5 overflow-x-auto pr-2 hide-scrollbar h-8 sm:h-10">
              {product.categories &&
                product.categories.map((category) => (
                  <Badge key={category.category_id} variant={"secondary"} className={"text-[0.6rem] sm:text-sm"}>
                    {category.name}
                  </Badge>
                ))}
            </div>

          <div className="flex flex-col justify-between h-full">
            
            <div className="text-md font-bold sm:text-xl text-primary/95 leading-tight line-clamp-2">
              {product.name}
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
        <Skeleton className="w-full h-3" />
        <Skeleton className="w-full h-3" />
        <Skeleton className="w-full h-3" />
        <Skeleton className="w-full h-3" />
        <Skeleton className="w-[50%] h-3" />
      </div>
      <div className="px-6 flex flex-row justify-end">
        <Skeleton className="w-10 h-10" />
      </div>
    </div>
  );
}

export { ProductCard, ProductSkeleton };
