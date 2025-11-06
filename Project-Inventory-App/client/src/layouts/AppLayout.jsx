import { Outlet } from "react-router";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

export default function AppLayout() {
  return (
    <div className="grid grid-cols-1 grid-rows-[auto_1fr_auto] gap-2 min-h-svh dark:bg-gray-950 dark:text-white">
      <Navigation />
      <main className=""><Outlet /></main>
      <Footer />
    </div>
  );
}
