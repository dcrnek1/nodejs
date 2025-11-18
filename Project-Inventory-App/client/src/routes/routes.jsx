import ProductsPage from "@/pages/ProductsPage";
import App from "../App";
import ErrorPage from "../components/ErrorPage";
import AppLayout from "../layouts/AppLayout";
import CategoriesPage from "../pages/CategoriesPage";

const routes = [
  {
  Component: AppLayout,
  children: [
    {index: true, Component: App},
    {path: "/categories", Component: CategoriesPage},
    {path: "/products", Component: ProductsPage},
    {path: "*", Component: ErrorPage}
  ]
  }
];

export default routes;