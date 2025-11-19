import { createBrowserRouter } from "react-router";
import { MainLayout } from "../layouts/MainLayout.jsx";
import { AdminLayout } from "../layouts/AdminLayout.jsx";

import { Home } from "../pages/Home.jsx";
import { Detail } from "../pages/Detail.jsx";
import { Filter } from "../pages/Filter.jsx";
import { AddAnnounce } from "../pages/AddAnnounce.jsx";
import { Profile } from "../pages/Profile.jsx";

import Dashboard from "../pages/Dashboard.jsx";
import HistoryTable from "../pages/HistoryTable.jsx";
import Publish from "../pages/Publish.jsx";
import {About} from "../pages/About.jsx";
import TermsOfService from "../pages/Terms.jsx";
import PrivacyPolicy from "../pages/Privacy.jsx";
import NotificationDetail from "../pages/NotificationDetail.jsx";
import PendingTable from "../pages/PendingTable.jsx";
import ShareAnnounce from "../pages/ShareAnnounce.jsx";

const router = createBrowserRouter([
  // 🏠 Layout หลักสำหรับผู้ใช้ทั่วไป
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/detail/:id", element: <Detail /> },
      { path: "/filter", element: <Filter /> },
      { path: "/add-announce", element: <AddAnnounce /> },
      { path: "/profile", element: <Profile /> },
      { path: "/about-us", element: <About /> },
      { path: "/terms-of-service", element: <TermsOfService /> },
      { path: "/privacy-policy", element: <PrivacyPolicy /> },
      { path: "/notifications/:notifyId", element:<NotificationDetail />} 
    ],
  },

  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "announce/history", element: <HistoryTable /> },
      { path: "announce/published", element: <Publish /> },
      { path: "announce/pending", element: <PendingTable />},
      // 👇 ถ้ามีหน้าอื่นในอนาคต เช่น:
      { path: "announce/details/:id", element: <ShareAnnounce /> },
      // { path: "users", element: <ManageUsers /> },
    ],
  },
]);

export default router;
