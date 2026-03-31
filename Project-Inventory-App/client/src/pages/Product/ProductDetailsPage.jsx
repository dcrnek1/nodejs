import { PencilIcon} from "@phosphor-icons/react";
import { ChevronLeft } from "lucide-react";
import { NavLink } from "react-router";

export default function ProductDetailsPage() {
  return (
    <div className="max-w-8xl mx-auto min-h-full padding-x py-6">
      {/* Heading */}
      <div className="flex flex-col flex-wrap justify-center gap-6 pb-6 mb-6">
        <NavLink to="/products"><ChevronLeft size={25} /></NavLink>
        <div className="text-secondary/80">Curated selection of timeless product masterpieces currently available in our physical archive.</div>
        <div className="flex flex-row gap-4 items-center">
          <button className="secondary-primary text-sm flex flex-row items-center gap-2">
            <PencilIcon />
            <span className="font-semibold">Edit Product</span>
          </button>
        </div>
      </div>

    </div>
  );
}
