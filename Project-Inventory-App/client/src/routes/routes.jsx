import App from "../App";
import ErrorPage from "../components/ErrorPage";
import AppLayout from "../layouts/AppLayout";
import CategoryPage from "../pages/CategoryPage";

const routes = [
  {
  Component: AppLayout,
  children: [
    {index: true, Component: App},
    {path: "/categories", Component: CategoryPage},
    {path: "*", Component: ErrorPage}
  ]
  }
];

export default routes;