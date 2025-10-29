import { FoldersIcon, HouseIcon, MonitorPlayIcon } from "@phosphor-icons/react";
import { NavLink } from "react-router";

export default function Navigation() {
  return (
    <navigation className="w-full">
      {/* Mobile header */}
      <div className="p-2 text-2xl sm:hidden font-bold">Inventory App</div>
      {/* Mobile navigation */}
      <div
        className="fixed bottom-0 h-(--mobile-navbar-height) sm:hidden 
      w-full flex flex-row items-center justify-around"
      >
        <NavLink to="/">
          {({ isActive }) => {
            return(
            <HouseIcon size={32} weight={isActive ? "fill" : "light"} className="text-gray-700" />
            )
          }}
        </NavLink>
        <NavLink to="/categories">
          {({ isActive }) => {
            return(
            <FoldersIcon size={32} weight={isActive ? "fill" : "light"} className="text-gray-700" />
            )
          }}
        </NavLink>
        <NavLink to="/products">
          {({ isActive }) => {
            return(
            <MonitorPlayIcon size={32} weight={isActive ? "fill" : "light"} className="text-gray-700" />
            )
          }}
        </NavLink>
      </div>

      {/* Desktop navigation */}
      <div className="hidden w-full p-2 sm:flex flex-row gap-15 items-center">
        <div className="text-2xl font-bold">Inventory App</div>
        <div className="flex gap-8">
          <NavLink to="/" className="text-gray-900 hover:underline">
            {({ isActive }) => (
              <span className={isActive ? "underline" : ""}>Home</span>
            )}
          </NavLink>
          <NavLink to="/categories" className="text-gray-900 hover:underline">
            {({ isActive }) => (
              <span className={isActive ? "underline" : ""}>Categories</span>
            )}
          </NavLink>
          <NavLink to="/products" className="text-gray-900 hover:underline">
            {({ isActive }) => (
              <span className={isActive ? "underline" : ""}>Products</span>
            )}
          </NavLink>
        </div>
      </div>
    </navigation>
  );
}
