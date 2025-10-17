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
        path: "/condo-swift/",
        element: <Home />,
      },
      {
        path: "/condo-swift/detail/:id",
        element: <Detail />,
      },
      {
        path: "/condo-swift/filter",
        element: <Filter />,
      },
      {
        path: "/condo-swift/add-announce",
        element: <AddAnnounce />,
      },
      
      
    ],
  },
]);

export default router;
