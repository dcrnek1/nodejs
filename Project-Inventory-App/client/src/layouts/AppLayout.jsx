import { Outlet } from "react-router";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

export default function AppLayout() {
  return (
    <div className="grid grid-cols-1 grid-rows-[auto_1fr_auto] min-h-svh">
      <Navigation />
      <main className=""><Outlet /></main>
      <Footer />
    </div>
  );
}
