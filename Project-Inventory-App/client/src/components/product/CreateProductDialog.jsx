import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "../ui/multi-select";
import { UploadIcon, X } from "@phosphor-icons/react";
import { useCreateProduct } from "@/hooks/useProduct";
import { useCategories } from "@/hooks/useCategory";

export default function CreateProductDialog({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const initialFormData = {
    name: "",
    image: "",
    imageFile: "",
    imageName: "",
    categories: [],
    description: "",
    stock: 0,
  };

  const [formData, setFormData] = useState(initialFormData);

  const createProduct = useCreateProduct();
  const handleSave = async () => {
    const form = new FormData();
    form.append("name", formData.name);
    form.append("stock", formData.stock);
    form.append("description", formData.description);
    formData.categories.forEach((c) => {
      form.append("categories[]", c); // <-- key ends with []
    });
    if (formData.imageFile) {
      form.append("image", formData.imageFile);
    }
    try {
      const createdProduct = await createProduct.mutateAsync(form);
      if (createdProduct) setIsOpen(false);
      setFormData(initialFormData);
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      /* empty */
    }
    // setIsOpen(false);
  };

  function handleImageChange(event) {
    event.preventDefault();
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
      setFormData((prev) => ({
        ...prev,
        imageName: event.target.files[0].name,
        imageFile: file,
      }));
    }
  }

  const allCategories = useCategories("tstamp", "desc", 10);
  const categories = allCategories.data?.pages.flatMap((p) => p.result) || [];

  const loaderRef = useRef();

  useEffect(() => {
    if (!loaderRef.current) return;
    if (!isOpen) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          allCategories.hasNextPage &&
          !allCategories.isFetchingNextPage
        ) {
          allCategories.fetchNextPage();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [isOpen, allCategories, allCategories.hasNextPage]);

  console.log(categories);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-xl" aria-describedby={undefined}>
        <DialogHeader className="pb-4">
          <DialogTitle>Create new product</DialogTitle>
        </DialogHeader>

        <div className={`flex flex-row flex-wrap gap-4`}>
          <div className="flex flex-row w-full gap-4">
            <div className="flex flex-col flex-3 gap-4 justify-start">
              <div className="flex flex-col gap-1 min-w-40">
                <label htmlFor="name" className="text-secondary text-xs pl-1">
                  <span className="text-error">*</span> Product name:
                </label>
                <input
                  className="primary w-full"
                  name="name"
                  placeholder="Enter new product name..."
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

              <div className="flex flex-col gap-1 min-w-40">
                <label htmlFor="stock" className="text-secondary text-xs pl-1">
                  Stock:
                </label>
                <input
                  className="primary w-full"
                  name="stock"
                  placeholder="Enter stock count..."
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      stock: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="categories"
                  className="text-secondary text-xs pl-1"
                >
                  Linked categories:
                </label>
                <MultiSelect
                  value={formData?.categories?.map(String)}
                  onValuesChange={(values) =>
                    setFormData((prev) => ({
                      ...prev,
                      categories: values,
                    }))
                  }
                  id="categories"
                >
                  <MultiSelectTrigger className="w-full flex-3 flex-wrap bg-subtle!">
                    <MultiSelectValue
                      overflowBehavior="no"
                      className="w-full flex-3"
                      placeholder="Select categories..."
                    />
                  </MultiSelectTrigger>
                  <MultiSelectContent search={true} className="">
                    <MultiSelectGroup>
                      {allCategories.isSuccess &&
                        categories.map((category) => (
                          <MultiSelectItem
                            key={category.category_id}
                            value={category.category_id}
                          >
                            {category.name}
                          </MultiSelectItem>
                        ))}
                    </MultiSelectGroup>
                    <div ref={loaderRef}></div>
                  </MultiSelectContent>
                </MultiSelect>
              </div>
            </div>

            <div className="flex flex-col items-start gap-1 flex-2 w-full">
              <label className="text-secondary text-xs pl-1">
                <span className="text-error">*</span> Product image:
              </label>
              <div className="w-full h-full">
                {formData?.image == "" && (
                  <label
                    htmlFor="product_image"
                    className="border w-full h-full flex text-tertiary hover:text-secondary flex-row gap-2 justify-center items-center text-sm border-solid-border hover:border-solid-border/30 px-4 py-2 rounded-md bg-subtle placeholder:font-normal placeholder:text-sm"
                  >
                    <UploadIcon size={35} className="" />
                  </label>
                )}
                {formData?.image !== "" && (
                  <div
                    className="h-full relative w-full rounded-xl bg-cover bg-top"
                    style={{ backgroundImage: `url("${formData.image}")` }}
                  >
                    <div
                      className="absolute top-2 right-2 p-1.5 rounded-sm bg-el-bg hover:bg-el-hover-bg"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          image: "",
                          imageName: "",
                          imageFile: "",
                        }))
                      }
                    >
                      <X />
                    </div>
                  </div>
                )}
              </div>
              <input
                className="primary w-full hidden"
                name="name"
                id="product_image"
                placeholder="Enter new product name..."
                type="file"
                value=""
                onChange={(e) => handleImageChange(e)}
              />
            </div>
          </div>

          <div className="flex flex-col items-start gap-1 flex-2 min-w-40">
            <label
              htmlFor="description"
              className="text-secondary text-xs pl-1"
            >
              Description:
            </label>
            <textarea
              className="primary w-full"
              name="description"
              placeholder="Enter stock count..."
              rows="3"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>
        </div>

        <DialogFooter className="sm:justify-end mt-4">
          <DialogClose asChild>
            <button className="secondary">Cancel</button>
          </DialogClose>
          <button className="primary" onClick={handleSave} disabled={""}>
            Create
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
