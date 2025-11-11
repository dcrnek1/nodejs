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
import { InfoIcon, LinkSimpleHorizontalIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { MultiSelect, MultiSelectContent, MultiSelectGroup, MultiSelectItem, MultiSelectTrigger, MultiSelectValue } from "@/components/ui/multi-select";

export function CategoryDetailsDialog({ children, category }) {
  const [isOpen, setIsOpen] = useState(false);
  const products = useProductsByCategoryId(category.category_id, {
    enabled: isOpen,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: category.name, product_ids: [] });

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setIsEditing(false);
      }, 100)
      return () => clearTimeout(timer);
    }

    if (!isEditing) {
      setFormData(() => ({ name: category.name, product_ids: products?.data?.length > 0 ? products?.data?.map((product) => (product.product_id)) : [] }))
    }


    if (isEditing) {
      setFormData((prev) => ({ ...prev, product_ids: products?.data?.length > 0 ? products?.data?.map((product) => (product.product_id)) : [] }));
    }
  }, [isOpen, isEditing])
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-left">{category.name}</DialogTitle>
          <DialogDescription className="cursor-default">
            {/* Description */}
            {!isEditing && <span>
              {category?.product_count > 0
                ? `Category contains ${category.product_count} products.`
                : "Category is empty."}
            </span>}
            {isEditing && <span className="flex flex-row gap-1 items-baseline">
              <InfoIcon className="text-info relative top-0.5" />You're editing this category.
            </span>}
          </DialogDescription>
          <div>
            {/* Products list */}
            <div
              className={`flex flex-col items-left gap-2 overflow-hidden transition-[max-height] duration-500 ease-in-out`}
              style={{
                maxHeight: products.isSuccess && !isEditing
                  ? `${products.data.length * 4}rem`
                  : "0rem",
              }}
            >
              {products.isError && <>Error fetching product list :(</>}
              {products.isSuccess &&
                products?.data?.length > 0 &&
                products.data.map((product, index) => (
                  <div
                    key={index}
                    className="text-textLink/85 hover:text-textLink cursor-pointer flex flex-row items-baseline gap-1 nowrap"
                  >
                    <LinkSimpleHorizontalIcon size={15} className="relative top-0.5" /> <span className="text-left">{product.name} </span>
                  </div>
                ))}
            </div>
            {/* Editing body */}
            <div className={`flex flex-row flex-wrap gap-4 overflow-hidden transition-[max-height] duration-500 ease-in-out pt-0`}
              style={{
                maxHeight: isEditing
                  ? `20rem`
                  : "0rem",
              }}>
              <form className="flex flex-row gap-4 w-full flex-wrap">
                <div className="flex flex-col items-start gap-1 flex-2 min-w-40">
                  <label htmlFor="name" className="text-secondary text-xs pl-1">Category name:</label>
                  <input className="primary w-full" name="name" placeholder="Enter new category name..." type="text" value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} onOpenAutoFocus={(e) => e.preventDefault()} />
                </div>
                <div className="flex flex-col items-start gap-1 flex-3 basis-full sm:basis-180">
                  <label htmlFor="name" className="text-secondary text-xs pl-1">Test multiselect:</label>
                  <MultiSelect>
                    <MultiSelectTrigger className="w-full flex-3 flex-wrap bg-subtle">
                      <MultiSelectValue overflowBehavior="no"  className="w-full flex-3" placeholder="Select frameworks..." />
                    </MultiSelectTrigger>
                    <MultiSelectContent search={true}>
                      <MultiSelectGroup>
                        <MultiSelectItem value="1">Product 1</MultiSelectItem>
                        <MultiSelectItem value="2">Product 2</MultiSelectItem>
                        <MultiSelectItem value="3">Product 3</MultiSelectItem>
                        <MultiSelectItem value="4">Product 4</MultiSelectItem>
                        <MultiSelectItem value="5">Product 5</MultiSelectItem>
                        <MultiSelectItem value="6">Product 6</MultiSelectItem>
                        <MultiSelectItem value="7">Product 7</MultiSelectItem>
                        <MultiSelectItem value="8">Product 8</MultiSelectItem>
                        <MultiSelectItem value="9">Product 9</MultiSelectItem>
                        <MultiSelectItem value="10" disabled>Product 10</MultiSelectItem>
                        <MultiSelectItem value="11">Product 11</MultiSelectItem>
                        <MultiSelectItem value="12" disabled>Product 12</MultiSelectItem>
                      </MultiSelectGroup>
                    </MultiSelectContent>
                  </MultiSelect>
                </div>
              </form>
            </div>
          </div>
        </DialogHeader>

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild></DialogClose>
          {!isEditing && <button className="primary" onClick={() => setIsEditing(!isEditing)}>Edit category</button>}
          {isEditing && <button className="secondary" onClick={() => setIsEditing(!isEditing)}>Cancel</button>}
          {isEditing && <button className="primary">Save category</button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
