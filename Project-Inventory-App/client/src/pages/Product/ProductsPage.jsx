import { useAllProducts } from "@/hooks/useProduct";
import SortPopover from "@/components/product/ProductSortDropdown";
import { useEffect, useRef, useState } from "react";
import {
  PlusIcon,
  SortAscendingIcon,
  SortDescendingIcon,
} from "@phosphor-icons/react";
import { ProductCard, ProductSkeleton } from "@/components/product/ProductCard";
import { useAtom } from "jotai";
import { productsScrollAtom } from "@/state/productsScrollAtom";
import CreateProductDialog from "@/components/product/CreateProductDialog";

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

  const limit = 6;

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
      if (
        entry.isIntersecting &&
        productData.hasNextPage &&
        !productData.isFetchingNextPage
      ) {
        productData.fetchNextPage();
      }
    });

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [productData, productData.isFetchingNextPage]);

  const [productsScroll, setProductsScroll] = useAtom(productsScrollAtom);
  useEffect(() => {
    if (productsScroll !== null && productsScroll > 0) {
      window.scrollTo(0, productsScroll);
      setProductsScroll(null);
    }
  }, [productsScroll, setProductsScroll]);

  return (
    <div className="max-w-8xl mx-auto min-h-full padding-x py-6">
      {/* Heading */}
      <div className="flex flex-col flex-wrap justify-center gap-6 pb-6 mb-6">
        <h1 className="text-nowrap font-inter font-semibold text-5xl tracking-wide">
          Product <br />
          list
        </h1>
        <div className="text-secondary/80">
          Curated selection of timeless product masterpieces currently available
          in our physical archive.
        </div>
        <div className="flex flex-row gap-4 items-center">
          <CreateProductDialog>
            <button className="secondary-primary text-sm flex flex-row items-center gap-2">
              <PlusIcon />
              <span className="font-semibold">Add Item</span>
            </button>
          </CreateProductDialog>
          <SortPopover sort={sort} setSort={setSort} />
        </div>
      </div>

      {/* Products table */}
      <div className="grid gap-3 -mx-3 sm:mx-0 sm:gap-6 grid-cols-2 sm:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] pb-6">
        {productData.isSuccess &&
          allProducts.map((product) => (
            <ProductCard key={product.product_id} product={product} />
          ))}
      </div>
      <div ref={loaderRef}></div>

      {/* Products table skeleton */}
      {productData.isFetching && (
        <div className="grid gap-6 sm:gap-6 grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(400px,1fr))] pb-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      )}
    </div>
  );
}
