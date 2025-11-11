import { Outlet } from "react-router";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Toaster } from "../components/ui/Sonner";

export default function AppLayout() {
  return (
    <div className="grid grid-cols-1 grid-rows-[auto_1fr_auto] min-h-svh bg-main text-primary">
      <Navigation />
      <main className="bg-subtle">
        <Outlet />
        <Toaster
          position="top-center"
          duration="8000"
          toastOptions={{
            classNames: {
              toast:
                "!bg-sonner-bg !border-solid-border !text-primary !shadow-sm",
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
