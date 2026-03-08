import Image from "@/components/Image";
import { useAllProducts } from "@/hooks/useProduct";
import { useDelayedLoading } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import SortPopover from "@/components/product/ProductSortDropdown";
import { useState } from "react";
import { SortAscendingIcon, SortDescendingIcon } from "@phosphor-icons/react";
import { useSearchParams } from "react-router";
import PaginationComponent from "@/components/Pagination";

export default function ProductsPage() {
  //Sort state
  const [sort, setSort] = useState({
    value: {
      column: "name",
      columnText: "Name",
      order: "desc",
      orderIcon: <SortAscendingIcon size={15} />,
    },
    data: {
      columns: [
        { value: "name", text: "Name" },
        { value: "tstamp", text: "Updated" },
      ],
      orders: [
        {
          value: "desc",
          text: "Descending",
          icon: <SortAscendingIcon size={15} />,
        },
        {
          value: "asc",
          text: "Ascending",
          icon: <SortDescendingIcon size={15} />,
        },
      ],
    },
  });

  
  //Pagination
  const [params] = useSearchParams();
  let page = Number(params.get("page") || 1);
  page = page < 1 ? 1 : page;
  const limit = 10;

  //Data
  const allProducts = useAllProducts(sort.value.column, sort.value.order, page, limit);
  const totalPageCount = Math.ceil((allProducts?.data?.total ?? 0) / limit);
  const showSkeleton = useDelayedLoading(
    allProducts.isFetching,
    allProducts.isPending,
    1000
  );


  return (
    <div className="max-w-8xl mx-auto min-h-full padding-x py-6">
      {/* Heading */}
      <div className="flex flex-wrap justify-between items-center border-b border-solid-border pb-6 mb-6">
        <h1 className="text-nowrap">Product list release</h1>
        <div className="flex flex-row gap-4 items-center">
          <SortPopover sort={sort} setSort={setSort} />
        </div>
      </div>

      {/* Products table skeleton */}
      {allProducts.isPending && showSkeleton && (
        <div>Loading all products....</div>
      )}

      {/* Products table */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(400px,1fr))] pb-6">
        {allProducts.isSuccess &&
          allProducts.data.result.map((product) => (
            // {/* Card */}
            <div
              className="rounded-md gap-4 border solid-border cursor-pointer"
              key={product.product_id}
            >
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
          ))}
      </div>
      <PaginationComponent page={page} total={totalPageCount} />
    </div>
  );
}
