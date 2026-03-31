import ProductsPage from "@/pages/Product/ProductsPage";
import ErrorPage from "../components/ErrorPage";
import AppLayout from "../layouts/AppLayout";
import CategoriesPage from "../pages/Category/CategoriesPage";
import ProductDetailsPage from "@/pages/Product/ProductDetailsPage";

const routes = [
  {
  Component: AppLayout,
  children: [
    {index: true, Component: ProductsPage},
    {path: "/categories", Component: CategoriesPage},
    {path: "/products", Component: ProductsPage},
    {path: "/products/:productId", Component: ProductDetailsPage},
    {path: "*", Component: ErrorPage}
  ]
  }
];

export default routes;