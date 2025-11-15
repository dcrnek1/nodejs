import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useProducts } from "@/hooks/useProduct";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "../ui/multi-select";
import { useCreateCategory } from "@/hooks/useCategory";

export default function CreateCategoryDialog({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "" });
  const allProducts = useProducts();
  const createCategory = useCreateCategory();

  const handleSave = async () => {
    await createCategory.mutateAsync(formData);
    setIsOpen(false);
    setFormData({ name: "" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-xl" aria-describedby={undefined}>
        <DialogHeader className="pb-4">
          <DialogTitle>Create new category</DialogTitle>
        </DialogHeader>

        <div className={`flex flex-row flex-wrap gap-4`}>
          <div className="flex flex-col items-start gap-1 flex-2 min-w-40">
            <label htmlFor="name" className="text-secondary text-xs pl-1">
              Category name:
            </label>
            <input
              className="primary w-full"
              name="name"
              placeholder="Enter new category name..."
              type="text"
              value={formData?.name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
          </div>
          <div className="flex flex-col items-start gap-1 flex-3 basis-full sm:basis-180">
            <label htmlFor="name" className="text-secondary text-xs pl-1">
              Linked products:
            </label>
            <MultiSelect
              value={formData?.product_ids?.map(String)}
              onValuesChange={(values) =>
                setFormData((prev) => ({
                  ...prev,
                  product_ids: values,
                }))
              }
            >
              <MultiSelectTrigger className="w-full flex-3 flex-wrap !bg-subtle">
                <MultiSelectValue
                  overflowBehavior="no"
                  className="w-full flex-3"
                  placeholder="Select frameworks..."
                />
              </MultiSelectTrigger>
              <MultiSelectContent search={true}>
                <MultiSelectGroup>
                  {allProducts.isSuccess &&
                    allProducts?.data?.length > 0 &&
                    allProducts.data.map((product) => (
                      <MultiSelectItem
                        key={product.product_id}
                        value={`${product.product_id}`}
                      >
                        {product.name}
                      </MultiSelectItem>
                    ))}
                </MultiSelectGroup>
              </MultiSelectContent>
            </MultiSelect>
          </div>
        </div>

        <DialogFooter className="sm:justify-end mt-4">
          <DialogClose asChild>
            <button className="secondary">Cancel</button>
          </DialogClose>
          <button className="primary" onClick={handleSave} disabled={createCategory.isPending}>
            Create
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
