import { FoldersIcon, HouseIcon, MonitorPlayIcon } from "@phosphor-icons/react";
import { NavLink } from "react-router";
import ThemeToggle from "./ThemeToggle";

export default function Navigation() {
  return (
    <navigation className="w-full mx-auto">
      {/* Mobile header */}
      <div className="px-2 py-3 text-2xl sm:hidden font-bold flex flex-row justify-between border-b-1 dark:border-b-1 border-gray-950/10 dark:border-white/10 items-center">
        <div>Inventory App</div>
        <ThemeToggle />
      </div>
      {/* Mobile navigation */}
      <div
        className="fixed bottom-0 h-(--mobile-navbar-height) sm:hidden 
      w-full flex flex-row items-center justify-around dark:border-t-1 dark:border-white/5"
      >
        <NavLink to="/">
          {({ isActive }) => {
            return (
              <HouseIcon
                size={32}
                weight={isActive ? "fill" : "light"}
                className="text-gray-700 dark:text-gray-400"
              />
            );
          }}
        </NavLink>
        <NavLink to="/categories">
          {({ isActive }) => {
            return (
              <FoldersIcon
                size={32}
                weight={isActive ? "fill" : "light"}
                className="text-gray-700 dark:text-gray-400"
              />
            );
          }}
        </NavLink>
        <NavLink to="/products">
          {({ isActive }) => {
            return (
              <MonitorPlayIcon
                size={32}
                weight={isActive ? "fill" : "light"}
                className="text-gray-700 dark:text-gray-400"
              />
            );
          }}
        </NavLink>
      </div>

      {/* Desktop navigation */}
      <div className="border-b-1 border-gray-200 dark:border-b-1 dark:border-white/5 ">
        <div className="hidden sm:flex flex-row p-2 py-3 w-full items-center max-w-8xl mx-auto">
          <div className="sm:flex flex-row flex-1 gap-15 items-center">
            <div className="text-2xl font-bold">Inventory App</div>
            <div></div>
            <div className="flex gap-8 text-sm">
              <NavLink to="/" className="text-gray-900 dark:text-gray-50">
                {({ isActive }) => (
                  <span
                    className={
                      isActive
                        ? "dark:text-white text-gray-950"
                        : "dark:text-gray-400 text-gray-500"
                    }
                  >
                    Home
                  </span>
                )}
              </NavLink>
              <NavLink
                to="/categories"
                className="text-gray-900 dark:text-gray-50"
              >
                {({ isActive }) => (
                  <span
                    className={
                      isActive
                        ? "dark:text-white text-gray-950"
                        : "dark:text-gray-400 text-gray-500"
                    }
                  >
                    Categories
                  </span>
                )}
              </NavLink>
              <NavLink
                to="/products"
                className="text-gray-900 dark:text-gray-50"
              >
                {({ isActive }) => (
                  <span
                    className={
                      isActive
                        ? "dark:text-white text-gray-950"
                        : "dark:text-gray-400 text-gray-500"
                    }
                  >
                    Products
                  </span>
                )}
              </NavLink>
            </div>
          </div>
          <div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </navigation>
  );
}
