import ProductsPage from "@/pages/Product/ProductsPage";
import ErrorPage from "../components/ErrorPage";
import AppLayout from "../layouts/AppLayout";
import CategoriesPage from "../pages/Category/CategoriesPage";
import ProductDetailsPage from "@/pages/Product/ProductDetailsPage";
import SignInPage from "@/pages/Auth/SignInPage";
import AuthSuccessPage from "@/pages/Auth/AuthSuccessPage";

const routes = [
  {
  Component: AppLayout,
  children: [
    {index: true, Component: ProductsPage},
    {path: "/categories", Component: CategoriesPage},
    {path: "/products", Component: ProductsPage},
    {path: "/products/:productId", Component: ProductDetailsPage},
    {path: "/signin", Component: SignInPage},
    {path: "/signinsuccess", Component: AuthSuccessPage},
    {path: "*", Component: ErrorPage}
  ]
  }
];

export default routes;