import { useAllProducts } from "@/hooks/useProduct";
import SortPopover from "@/components/product/ProductSortDropdown";
import { useEffect, useRef, useState } from "react";
import { SortAscendingIcon, SortDescendingIcon } from "@phosphor-icons/react";
import { ProductCard, ProductSkeleton } from "@/components/product/ProductCard";

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

  const limit = 5;

  //Data
  const productData = useAllProducts(
    sort.value.column,
    sort.value.order,
    limit,
  );

  const allProducts = productData.data?.pages.flatMap((p) => p.result) || [];

  const loaderRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && productData.hasNextPage && !productData.isFetchingNextPage) {
        productData.fetchNextPage();
      }
    });

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [productData, productData.isFetchingNextPage]);

  return (
    <div className="max-w-8xl mx-auto min-h-full padding-x py-6">
      {/* Heading */}
      <div className="flex flex-wrap justify-between items-center border-b border-solid-border pb-6 mb-6">
        <h1 className="text-nowrap">Product list</h1>
        <div className="flex flex-row gap-4 items-center">
          <SortPopover sort={sort} setSort={setSort} />
        </div>
      </div>

      {/* Products table */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(400px,1fr))] pb-6">
        {productData.isSuccess &&
          allProducts.map((product) => (
            <ProductCard key={product.product_id} product={product} />
          ))}
      </div>
      <div ref={loaderRef}></div>

      {/* Products table skeleton */}
      {productData.isFetching && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      )}
    </div>
  );
}
