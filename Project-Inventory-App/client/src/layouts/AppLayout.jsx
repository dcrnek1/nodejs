import { Outlet } from "react-router";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Toaster } from "../components/ui/sonner";

export default function AppLayout() {
  return (
    <div className="grid grid-cols-1 grid-rows-[auto_1fr_auto] min-h-svh bg-main text-primary">
      <Navigation />
      <main className="bg-subtle py-3">
        <Outlet />
        <Toaster
          position="top-center"
          toastOptions={{
            classNames: {
              toast: "!bg-sonner-bg !border-solid-border !text-primary !shadow-sm",
              description: "!text-tertiary",
              closeButton: "!bg-subtle !text-primary !border-none",
            },
          }}
          swipeDirections="top-right"
          visibleToasts={9}
        />
      </main>
      <Footer />
    </div>
  );
}
