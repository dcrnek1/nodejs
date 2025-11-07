import { Link } from "react-router";
import ThemeToggle from "./ThemeToggle";

export default function Footer() {
  return (
    <div className="mb-(--mobile-navbar-height) px-2 py-8 sm:mb-0 text-tertiary border-t border-solid-border">
      <div className="max-w-8xl w-full mx-auto flex flex-col sm:flex-row justify-between gap-4">
        {/* App Info */}
        <div className="text-left flex flex-col justify-between">
          <h2 className="text-lg font-bold text-secondary">
            Inventory App
          </h2>
          <p className="text-sm">
            Manage your stock efficiently and effortlessly.
          </p>
        </div>

        {/* Links / General Info */}
        <div className="flex flex-row justify-between items-end gap-5 text-sm">
          <div className="flex gap-2 text-textLink/65">
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/help">Help</Link>
          </div>
          <div>
            <div>© 2025 Inventory Inc.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
