import Image from "@/components/Image";
import { Badge } from "@/components/ui/badge";
import { useProductById } from "@/hooks/useProduct";
import { PencilIcon } from "@phosphor-icons/react";
import { ChevronLeft } from "lucide-react";
import { NavLink, useParams } from "react-router";

export default function ProductDetailsPage() {
  const { productId } = useParams();

  const productData = useProductById(productId);
  const product = productData?.data;

  return (
    <div className="max-w-8xl mx-auto min-h-full padding-x py-6">
      {/* Heading */}
      <div className="flex flex-col flex-wrap justify-center gap-8 pb-6 mb-6 h-full">
        <div className="flex flex-row items-center justify-between">
          <NavLink to="/" className="flex flex-row gap-4 text-secondary"><ChevronLeft size={25} /> Back </NavLink>
          <button className="secondary text-sm flex flex-row items-center gap-2">
            <PencilIcon />
            <span className="font-semibold">Edit Product</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 w-full">
          <div className="w-full h-full flex justify-center">
            {productData.isSuccess && product?.image_path && (
              <div className="w-[70%] sm:w-120 relative">
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
            <div className="flex flex-col gap-8">
          <div className="text-4xl font-bold sm:text-5xl leading-tight">
            {product?.name}
          </div>

          <div className="flex flex-row gap-2 overflow-x-auto hide-scrollbar -ml-8 pl-8 -mr-5 pr-5">
            {product?.categories &&
              product?.categories.map((category) => (
                <Badge key={category.category_id} variant={"secondary"}>
                  {category.name}
                </Badge>
              ))}
          </div>

          <div className="text-md text-justify sm:text-lg leading-tight">
            {product?.description}
          </div>
          </div>
        </div>
      </div>

    </div>
  );
}
