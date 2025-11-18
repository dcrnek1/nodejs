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

  console.log(allProducts.data);

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
      <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] pb-6">
        {allProducts.isSuccess &&
          allProducts.data.map((product) => (
            // {/* Card */}
            <div className="rounded-md border solid-border flex flex-col gap-4 p-2 sm:p-4 bg-el-bg">
              {/* // Image and title */}
              <div className="flex flex-row gap-2 sm:gap-4">
                <div className="min-h-15 min-w-15 h-15 w-15 rounded-md">
                  {product.image_path && <Image src={`${import.meta.env.VITE_IMAGE_URL}${product.image_path}`} alt={product.name} className="rounded-md"/>}
                  {!product.image_path && <div className="bg-primary/5 min-h-15 min-w-15 h-15 w-15 rounded-md"></div>}
                </div>

                <div className="flex-1">
                  <div className="text-base sm:text-lg text-primary leading-tight line-clamp-2">
                    {product.name}
                  </div>
                </div>
              </div>
              {/* Description */}
              <p className="text-secondary font-light text-sm h-10 line-clamp-2">
                {product.description}
              </p>
              {/* Stock and actions */}
              <div className="flex flex-row gap-4 justify-between items-center">
                <div className="text-sm text-secondary">
                  <span className="font-semibold">Stock:</span> 0
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
