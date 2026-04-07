import Image from "@/components/Image";
import { Badge } from "@/components/ui/badge";
import { PopoverComp } from "@/components/PopoverComp";
import { useDeleteProduct, useProductById } from "@/hooks/useProduct";
import { NavLink, useNavigate, useParams } from "react-router";
import { ChevronLeft } from "lucide-react";
import { PencilIcon, TrashSimpleIcon } from "@phosphor-icons/react";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import { toast } from "sonner";

export default function ProductDetailsPage() {
  const { productId } = useParams();

  const productData = useProductById(productId);
  const product = productData?.data;

  const navigate = useNavigate();
  const deleteProduct = useDeleteProduct(product?.name);
  const handleDelete = async (setOpen) => {
    await deleteProduct.mutateAsync(product?.product_id);
    setOpen(false);
    navigate("/");
  };

  return (
    <div className="max-w-8xl mx-auto min-h-full padding-x py-6">
      {/* Heading */}

      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1 }}
        >
          <div className="flex flex-col flex-wrap justify-center gap-12 pb-6 mb-6 h-full">
            <div className="flex flex-row items-center justify-between">
              <NavLink
                to="/"
                className="flex flex-row items-center gap-1 text-secondary text-md"
              >
                <ChevronLeft size={25} /> <div>Back</div>
              </NavLink>
              <div className="flex flex-row items-center gap-3">
                <PopoverComp
                  align="end"
                  content={({ setOpen }) => (
                    <div className="flex flex-col gap-4">
                      <div className="text-primary text-sm">
                        Are you sure you want to delete this product?
                      </div>
                      <div className="flex flex-row gap-2 justify-end">
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
                            handleDelete(setOpen);
                          }}
                          disabled={deleteProduct.isPending}
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  )}
                >
                  <button
                    className="p-1.5 secondary no-scale rounded-full hover:transition active:transition hover:bg-primary/10 active:bg-primary/10 text-secondary"
                  >
                    <TrashSimpleIcon className="text-red-700" />
                  </button>
                </PopoverComp>

                <button
                  onClick={() =>
                    toast.error("Product editing not implemented.", {
                      description:
                        "Head over to categories page to check edit functionality.",
                    })
                  }
                  className="secondary text-sm flex flex-row items-center gap-2"
                >
                  <PencilIcon />
                  <span className="font-semibold">Edit Product</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 w-full">
              <div className="w-full h-full flex justify-center flex-2">
                {productData.isSuccess && product?.image_path && (
                  <div className="w-[70%] sm:w-full relative">
                    <Image
                      src={`${import.meta.env.VITE_IMAGE_URL}${product.image_path}`}
                      alt={product.name}
                      className="rounded-xl w-full object-cover z-1"
                    />
                    <div className="absolute w-50 h-50 bg-[#A8ABB4]/30 -left-7 -bottom-5 rounded-xl z-0"></div>
                    <div className="absolute w-50 h-50 bg-[#A8ABB4]/15 -right-7 -top-5 rounded-xl z-0"></div>
                  </div>
                )}
                {productData.isSuccess && !product.image_path && (
                  <div className="rounded-xl w-[80%] object-cover"></div>
                )}
              </div>
              <div className="flex flex-col gap-8 flex-4">
                <div className="text-4xl font-bold sm:text-5xl leading-tight">
                  {product?.name}
                </div>

                <div className="flex flex-row gap-2.5 items-center">
                  <div
                    className={`h-1.5 w-1.5 ${product?.stock > 0 ? "bg-success" : "bg-error"} rounded-full`}
                  ></div>
                  <div className="uppercase text-xs tracking-widest text-secondary">
                    Stock: {product?.stock}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex flex-row gap-2 w-full items-center">
                    <div className="text-tertiary uppercase text-xs tracking-widest">
                      Categories
                    </div>
                    <hr className="w-full bg-primary/30"></hr>
                  </div>
                  <div className="flex flex-row gap-2 overflow-x-auto hide-scrollbar -ml-8 pl-8 -mr-5 pr-5">
                    {product?.categories &&
                      product?.categories.map((category) => (
                        <Badge key={category.category_id} variant={"secondary"}>
                          {category.name}
                        </Badge>
                      ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex flex-row gap-2 w-full items-center">
                    <div className="text-tertiary uppercase text-xs tracking-widest">
                      Description
                    </div>
                    <hr className="w-full bg-primary/30"></hr>
                  </div>
                  <div className="text-md text-justify sm:text-lg leading-tight">
                    {product?.description}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
