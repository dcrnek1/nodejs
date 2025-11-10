import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useProductsByCategoryId } from "../../../hooks/useProduct";
import { LinkSimpleHorizontalIcon } from "@phosphor-icons/react";
import { useState } from "react";

export function CategoryDetailsDialog({ children, category }) {
  const [isOpen, setIsOpen] = useState(false);
  const products = useProductsByCategoryId(category.category_id, {
    enabled: isOpen,
  });
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-left">{category.name}</DialogTitle>
          <DialogDescription className="cursor-default">
            {category?.product_count > 0
              ? `Category contains ${category.product_count} products.`
              : "Category is empty."}
          </DialogDescription>
        </DialogHeader>
        <div
          className={`flex flex-col items-left gap-2 overflow-hidden transition-[max-height] duration-300 ease-out`}
          style={{
            maxHeight: products.isSuccess
              ? `${products.data.length * 2.5}rem`
              : "0",
          }}
        >
          {products.isError && <>Error fetching product list :(</>}
          {products.isSuccess &&
            products?.data?.length > 0 &&
            products.data.map((product, index) => (
              <div
                key={index}
                className="flex flex-row gap-1 items-center text-textLink/90 cursor-pointer"
              >
                {product.name} <LinkSimpleHorizontalIcon size={15} />
              </div>
            ))}
        </div>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild></DialogClose>
          <button className="primary">Edit category</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
