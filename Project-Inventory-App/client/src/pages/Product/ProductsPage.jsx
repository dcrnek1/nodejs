import { useEffect, useRef } from "react";
import { useAllProducts } from "@/hooks/useProduct";
import { useAtom } from "jotai";
import { productSortAtom } from "@/state/productSortAtom";
import { productsScrollAtom } from "@/state/productsScrollAtom";
import SortPopover from "@/components/product/ProductSortDropdown";
import { ProductCard, ProductSkeleton } from "@/components/product/ProductCard";
import CreateProductDialog from "@/components/product/CreateProductDialog";
import { PlusIcon } from "@phosphor-icons/react";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";

export default function ProductsPage() {
  //Sort state
  const [sort, setSort] = useAtom(productSortAtom);

  //Data
  const limit = 6;
  const productData = useAllProducts(
    sort.value.column,
    sort.value.order,
    limit,
  );
  const allProducts = productData.data?.pages.flatMap((p) => p.result) || [];

  //Infinite scroll
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
  }, [productData]);

  //Scroll restauration
  const [productsScroll, setProductsScroll] = useAtom(productsScrollAtom);
  useEffect(() => {
    if (productsScroll !== null && productsScroll > 0) {
      window.scrollTo(0, productsScroll);
      setProductsScroll(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1 }}
    >
      <div className="max-w-8xl mx-auto min-h-full padding-x py-6">
        {/* Heading */}
        <div className="flex flex-col flex-wrap justify-center gap-6 pb-6 mb-6">
          <h1 className="text-nowrap font-inter font-semibold text-5xl tracking-wide">
            Product <br />
            list
          </h1>
          <div className="text-secondary/80 flex flex-col text-wrap">
            Curated selection of timeless product masterpieces currently
            available in our physical archive.
          </div>

          <div className="flex flex-row gap-4 items-center justify-end">
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
          {productData.isFetching &&
            Array.from({ length: 6 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
        </div>
        <div ref={loaderRef}></div>
      </div>
    </motion.div>
  );
}
