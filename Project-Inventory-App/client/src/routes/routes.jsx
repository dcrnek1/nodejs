import ProductsPage from "@/pages/ProductsPage";
import App from "../App";
import ErrorPage from "../components/ErrorPage";
import AppLayout from "../layouts/AppLayout";
import CategoriesPage from "../pages/Category/CategoriesPage";

const routes = [
  {
  Component: AppLayout,
  children: [
    {index: true, Component: ProductsPage},
    {path: "/categories", Component: CategoriesPage},
    {path: "/products", Component: ProductsPage},
    {path: "*", Component: ErrorPage}
  ]
  }
];

export default routes;