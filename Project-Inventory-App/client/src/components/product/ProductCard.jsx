import Image from "../Image";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/Skeleton";

function ProductCard({ product }) {
  return (
    <div className="rounded-md gap-4 border solid-border cursor-pointer">
      <div className="flex flex-row gap-2">
        {/* // Image */}
        <div className="rounded-md">
          {product.image_path && (
            <Image
              src={`${import.meta.env.VITE_IMAGE_URL}${product.image_path}`}
              alt={product.name}
              className="rounded-md h-50 w-30"
            />
          )}
          {!product.image_path && (
            <div className="bg-primary/5 h-15 w-15 rounded-md"></div>
          )}
        </div>
        <div className="flex flex-col justify-between gap-2 p-2 pr-4">
          {/* Product title */}
          <div className="flex-1 flex flex-col gap-2">
            <h1 className="text-lg sm:text-lg text-primary leading-tight line-clamp-2">
              {product.name}
            </h1>
            {/* Description */}
            <p className="text-secondary font-light text-sm h-[calc(1.25rem*4)] leading-base tracking-tight text-justify text line-clamp-4">
              {product.description}
            </p>
          </div>

          {/* Stock and actions */}
          <div className="flex flex-row justify-between items-end">
            <div className="max-h-[calc(1.50rem*2)] overflow-hidden flex gap-1 flex-wrap">
              {product.categories &&
                product.categories.map((category) => (
                  <Badge key={category.category_id} variant={"outline"}>
                    {category.name}
                  </Badge>
                ))}
            </div>
            <div className="ml-auto whitespace-nowrap">
              <span className="font-semibold text-sm text-secondary">
                Stock: 0
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
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
