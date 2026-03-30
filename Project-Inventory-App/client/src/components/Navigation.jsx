import { ArticleIcon, FoldersIcon, HouseIcon, MonitorPlayIcon } from "@phosphor-icons/react";
import { NavLink } from "react-router";
import ThemeToggle from "./ThemeToggle";

export default function Navigation() {
  return (
    <div className="w-full mx-auto">
      {/* Mobile header */}
      <div className="padding-x py-3 text-2xl sm:hidden font-bold flex flex-row justify-between items-center">
        <div className="text-2xl font-inter font-bold select-none">App. <span className="text-xs font-light">by Dario</span></div>
        <ThemeToggle />
      </div>
      {/* Mobile navigation */}
      <div
        className="fixed z-49 bottom-0 h-(--mobile-navbar-height) sm:hidden 
      w-full flex flex-row items-center justify-around bg-main/70 backdrop-blur-xs"
      >
        <NavLink to="/">
          {({ isActive }) => {
            return (
              <ArticleIcon
                size={32}
                weight={isActive ? "fill" : "light"}
                className="text-primary"
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
                className="text-primary"
              />
            );
          }}
        </NavLink>
      </div>

      {/* Desktop navigation */}
      <div className="hidden sm:flex">
        <div className="hidden sm:flex flex-row padding-x py-3 w-full items-center max-w-8xl mx-auto">
          <div className="sm:flex flex-row flex-1 gap-15 items-center">
            <div className="text-2xl font-inter font-bold select-none">App. <span className="text-xs font-light">by Dario</span></div>
            <div></div>
            <div className="flex gap-3 text-sm">
              <NavLink to="/">
                {({ isActive }) => (
                  <span
                    className={
                      isActive
                        ? "text-primary bg-el-hover-bg px-2 py-1.5 rounded-full"
                        : "text-tertiary px-2 py-1 hover:bg-el-hover-bg hover:text-primary transition rounded-full"
                    }
                  >
                    Products
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
                        ? "text-primary bg-el-hover-bg px-2 py-1 rounded-full"
                        : "text-tertiary px-2 py-1 hover:bg-el-hover-bg hover:text-primary transition rounded-full"
                    }
                  >
                    Categories
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
    </div>
  );
}
