import App from "../App";
import ErrorPage from "../components/ErrorPage";
import AppLayout from "../layouts/AppLayout";

const routes = [
  {
  Component: AppLayout,
  children: [
    {index: true, Component: App},
    {path: "*", Component: ErrorPage}
  ]
  }
];

export default routes;