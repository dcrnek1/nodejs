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
import {
  useProducts,
  useProductsByCategoryId,
} from "../../../hooks/useProduct";
import { InfoIcon, LinkSimpleHorizontalIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";
import { PopoverComp } from "@/components/PopoverComp";
import { useUpdateCategory } from "@/hooks/useCategory";
import {
  AnimatePresence,
  // eslint-disable-next-line no-unused-vars
  motion,
  MotionConfig,
} from "motion/react";
import { Skeleton } from "@/components/ui/Skeleton";
import { useDelayedLoading } from "@/lib/utils";

export function CategoryDetailsDialog({ children, category }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: category.name,
    product_ids: [],
  });
  const products = useProductsByCategoryId(category.category_id, {
    enabled: isOpen,
  });
  const allProducts = useProducts({
    enabled: isEditing,
  });
  const updateCategory = useUpdateCategory();
  const [isSaving, setIsSaving] = useState(false);
  const showProductsSkeleton = useDelayedLoading(products.isFetching, 500);

  useEffect(() => {
    setFormData(() => ({
      name: category.name,
      product_ids:
        products?.data?.length > 0
          ? products?.data?.map((product) => product.product_id)
          : [],
    }));
  }, [products.data]);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setIsEditing(false);
      }, 100);
      return () => clearTimeout(timer);
    }

    if (isEditing) {
      setFormData((prev) => ({
        ...prev,
        product_ids:
          products?.data?.length > 0
            ? products?.data?.map((product) => product.product_id)
            : [],
      }));
    }
  }, [isOpen, isEditing]);

  const handleConfirmSave = async () => {
    try {
      setIsSaving(true);
      await updateCategory.mutateAsync({
        category_id: category.category_id,
        data: formData,
      });
      setIsEditing(false);
    } catch {
      setIsSaving(false);
      return;
    }
    setIsSaving(false);
  };

  return (
    <MotionConfig transition={{ duration: 0.2 }} className="overflow-hidden">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent
          className="sm:max-w-xl"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader className="overflow-hidden relative">
            <DialogTitle className="text-left">{category.name}</DialogTitle>
            <DialogDescription className="cursor-default">
              {/* Description */}
              {!isEditing && (
                <span>
                  {category?.product_count > 0
                    ? `Category contains ${category.product_count} products.`
                    : "Category is empty."}
                </span>
              )}
              {isEditing && (
                <span className="flex flex-row gap-1 items-baseline">
                  <InfoIcon className="text-info relative top-0.5" />
                  You're editing this category.
                </span>
              )}
            </DialogDescription>
            {/* Products list */}
            <AnimatePresence mode="popLayout">
              <div className="overflow-auto max-h-[calc(100vh/1.8)]">
                {!isEditing ? (
                  <div className={`flex flex-col items-left gap-2`}>
                    {products.isError && (
                      <motion.div
                        key={`products_load_error_${category.category_id}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        Error fetching product list :(
                      </motion.div>
                    )}
                    {showProductsSkeleton && (
                      <motion.div
                        key={`products_skeleton_${category.category_id}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-row gap-2">
                            <Skeleton className="w-5 h-4 bg-primary/5" />
                            <Skeleton className="w-[50%] h-4 bg-primary/5" />
                          </div>
                        </div>
                      </motion.div>
                    )}
                    {products.isSuccess &&
                      products?.data?.length > 0 &&
                      !isEditing &&
                      products.data.map((product, index) => (
                        <motion.div
                          key={`products_${product.product_id}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="overflow-hidden"
                        >
                          <div
                            key={index}
                            className="text-textLink/85 hover:text-textLink cursor-pointer flex flex-row items-baseline gap-1 nowrap"
                          >
                            <LinkSimpleHorizontalIcon
                              size={15}
                              className="relative top-0.5"
                            />{" "}
                            <span className="text-left">{product.name} </span>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                ) : (
                  /* Editing body */

                  <motion.div
                    key={`editing_section_${category.category_id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="overflow-hidden"
                  >
                    <div
                      className={`flex flex-row flex-wrap gap-4 overflow-hidden`}
                    >
                      <div className="flex flex-col items-start gap-1 flex-2 min-w-40">
                        <label
                          htmlFor="name"
                          className="text-secondary text-xs pl-1"
                        >
                          Category name:
                        </label>
                        <input
                          className="primary w-full"
                          name="name"
                          placeholder="Enter new category name..."
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="flex flex-col items-start gap-1 flex-3 basis-full sm:basis-180">
                        <label
                          htmlFor="name"
                          className="text-secondary text-xs pl-1"
                        >
                          Test multiselect:
                        </label>
                        <MultiSelect
                          value={formData.product_ids.map(String)}
                          defaultValues={formData.product_ids.map(String)}
                          onValuesChange={(values) =>
                            setFormData((prev) => ({
                              ...prev,
                              product_ids: values,
                            }))
                          }
                        >
                          <MultiSelectTrigger className="w-full flex-3 flex-wrap bg-subtle">
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
                                allProducts.data.map((product, key) => (
                                  <MultiSelectItem
                                    key={key}
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
                  </motion.div>
                )}
              </div>
            </AnimatePresence>
          </DialogHeader>

          <DialogFooter className="sm:justify-end mt-4">
            <DialogClose asChild></DialogClose>
            {!isEditing && (
              <button
                className="primary"
                onClick={() => setIsEditing(!isEditing)}
              >
                Edit category
              </button>
            )}
            {isEditing && (
              <button
                className="secondary"
                onClick={() => setIsEditing(!isEditing)}
              >
                Cancel
              </button>
            )}
            {isEditing && (
              <PopoverComp
                align="end"
                content={({ setOpen }) => (
                  <div className="flex flex-col gap-4 items-end">
                    <div className="flex flex-row gap-2 items-end">
                      <button
                        className="secondary w-fit"
                        onClick={() => {
                          setOpen(false);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="primary w-fit"
                        onClick={() => {
                          handleConfirmSave();
                          setOpen(false);
                        }}
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                )}
              >
                <button className="primary" disabled={isSaving}>
                  Update category
                </button>
              </PopoverComp>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MotionConfig>
  );
}
