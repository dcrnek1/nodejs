import { Outlet } from "react-router";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Toaster } from "../components/ui/sonner";

export default function AppLayout() {
  return (
    <div className="grid grid-cols-1 grid-rows-[auto_1fr_auto] gap-2 min-h-svh bg-bgPrimary text-textPrimary">
      <Navigation />
      <main className=""><Outlet />
        <Toaster />
      </main>
      <Footer />
    </div>
  );
}
