import Image from "@/components/Image";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAllProducts } from "@/hooks/useProduct";
import { useDelayedLoading } from "@/lib/utils";

export default function ProductsPage() {
  const allProducts = useAllProducts();
  const showSkeleton = useDelayedLoading(
    allProducts.isFetching,
    allProducts.isPending,
    1000
  );

  return (
    <div className="max-w-8xl mx-auto min-h-full padding-x py-6">
      {/* Heading */}
      <div className="flex flex-wrap justify-between items-center border-b border-solid-border pb-6 mb-6">
        <h1 className="text-nowrap">Product list</h1>
        <div className="flex flex-row gap-4 items-center">
          <div>Sort here</div>
        </div>
      </div>

      {/* Products table skeleton */}
      {allProducts.isPending && showSkeleton && (
        <div>Loading all products....</div>
      )}

      {/* Products table */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(400px,1fr))] pb-6">
        {allProducts.isSuccess &&
          allProducts.data.map((product) => (
            // {/* Card */}
            <div className="rounded-md gap-4 border solid-border cursor-pointer" key={product.product_id}>
              <div className="flex flex-row gap-2">
                {/* // Image */}
                <div className="rounded-md">
                  {product.image_path && (
                    <Image
                      src={`${import.meta.env.VITE_IMAGE_URL}${
                        product.image_path
                      }`}
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
                    <p className="text-secondary font-light text-sm h-[calc(1.25rem*5)] leading-base line-clamp-5">
                      {product.description}
                    </p>
                  </div>

                  {/* Stock and actions */}
                  <div className="text-sm text-secondary text-right">
                    <span className="font-semibold">Stock:</span> 0
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
