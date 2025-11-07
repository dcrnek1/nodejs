import { FoldersIcon, HouseIcon, MonitorPlayIcon } from "@phosphor-icons/react";
import { NavLink } from "react-router";
import ThemeToggle from "./ThemeToggle";

export default function Navigation() {
  return (
    <navigation className="w-full mx-auto">
      {/* Mobile header */}
      <div className="px-2 py-3 text-2xl sm:hidden font-bold flex flex-row justify-between border-b border-borderFaded items-center">
        <div>Inventory App</div>
        <ThemeToggle />
      </div>
      {/* Mobile navigation */}
      <div
        className="fixed bottom-0 h-(--mobile-navbar-height) sm:hidden 
      w-full flex flex-row items-center justify-around border-t border-borderFaded"
      >
        <NavLink to="/">
          {({ isActive }) => {
            return (
              <HouseIcon
                size={32}
                weight={isActive ? "fill" : "light"}
                className="text-textPrimary"
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
                className="text-textPrimary"
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
                className="text-textPrimary"
              />
            );
          }}
        </NavLink>
      </div>

      {/* Desktop navigation */}
      <div className="hidden sm:flex border-b border-borderFaded">
        <div className="hidden sm:flex flex-row p-2 py-3 w-full items-center max-w-8xl mx-auto">
          <div className="sm:flex flex-row flex-1 gap-15 items-center">
            <div className="text-2xl font-bold">Inventory App</div>
            <div></div>
            <div className="flex gap-8 text-sm">
              <NavLink to="/">
                {({ isActive }) => (
                  <span
                    className={
                      isActive
                        ? "text-textPrimary"
                        : "text-textFaded"
                    }
                  >
                    Home
                  </span>
                )}
              </NavLink>
              <NavLink
                to="/categories"
              >
                {({ isActive }) => (
                  <span
                    className={
                      isActive
                        ? "text-textPrimary"
                        : "text-textFaded"
                    }
                  >
                    Categories
                  </span>
                )}
              </NavLink>
              <NavLink
                to="/products"
              >
                {({ isActive }) => (
                  <span
                    className={
                      isActive
                        ? "text-textPrimary"
                        : "text-textFaded"
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
