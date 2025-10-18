import { createBrowserRouter } from "react-router";

import { MainLayout } from "../layouts/MainLayout.jsx";
import { Home } from "../pages/Home.jsx";
import { Detail } from "../pages/Detail.jsx";
import { Filter } from "../pages/filter.jsx";
import { AddAnnounce } from "../pages/AddAnnounce.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/detail/:id",
        element: <Detail />,
      },
      {
        path: "/filter",
        element: <Filter />,
      },
      {
        path: "/add-announce",
        element: <AddAnnounce />,
      },
      
      
    ],
  },
]);

export default router;
